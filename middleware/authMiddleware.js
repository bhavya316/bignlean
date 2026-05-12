const jwt = require("jsonwebtoken");
const User = require("../user/model/user");
const createHttpError = require("../utils/httpError");

const extractBearerToken = (authorizationHeader) => {
  if (!authorizationHeader) return null;

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) return null;

  return token;
};

const authMiddleware = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw createHttpError(500, "JWT_SECRET is not configured");
    }

    const token = extractBearerToken(req.headers.authorization);
    if (!token) {
      throw createHttpError(401, "Authorization token is required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id || decoded.type !== "user") {
      throw createHttpError(401, "Invalid authorization token");
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw createHttpError(401, "Authenticated user no longer exists");
    }

    if (user.isBlocked) {
      throw createHttpError(403, "User account is blocked");
    }

    req.user = user;
    req.auth = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return next(createHttpError(401, "Invalid or expired authorization token"));
    }

    next(error);
  }
};

const requireSameUserParam = (paramName = "id") => (req, res, next) => {
  const requestedUserId = Number(req.params[paramName]);
  const authenticatedUserId = Number(req.auth?.id || req.user?.id);

  if (!requestedUserId || requestedUserId !== authenticatedUserId) {
    return next(createHttpError(403, "You are not authorized to access this user resource"));
  }

  next();
};

const requireSameUserBody = (fieldName = "user", options = {}) => (req, res, next) => {
  if (options.optional && req.body[fieldName] === undefined) {
    return next();
  }

  const requestedUserId = Number(req.body[fieldName]);
  const authenticatedUserId = Number(req.auth?.id || req.user?.id);

  if (!requestedUserId || requestedUserId !== authenticatedUserId) {
    return next(createHttpError(403, "You are not authorized to modify this user resource"));
  }

  next();
};

const requireSameUserQuery = (fieldName = "userId", options = {}) => (req, res, next) => {
  if (options.defaultToAuthenticatedUser && req.query[fieldName] === undefined) {
    req.query[fieldName] = String(req.auth?.id || req.user?.id);
  }

  const requestedUserId = Number(req.query[fieldName]);
  const authenticatedUserId = Number(req.auth?.id || req.user?.id);

  if (!requestedUserId || requestedUserId !== authenticatedUserId) {
    return next(createHttpError(403, "You are not authorized to access this user resource"));
  }

  next();
};

const requireOwnedResource =
  (Model, paramName = "id", ownerField = "user") =>
  async (req, res, next) => {
    try {
      const resourceId = Number(req.params[paramName]);
      if (!resourceId) {
        throw createHttpError(400, "Resource ID is required");
      }

      const resource = await Model.findByPk(resourceId);
      if (!resource) {
        throw createHttpError(404, "Resource not found");
      }

      if (Number(resource[ownerField]) !== Number(req.auth?.id || req.user?.id)) {
        throw createHttpError(403, "You are not authorized to access this resource");
      }

      req.authorizedResource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  authMiddleware,
  requireOwnedResource,
  requireSameUserBody,
  requireSameUserParam,
  requireSameUserQuery,
};
