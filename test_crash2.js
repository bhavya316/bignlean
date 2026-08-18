const errorHandler = require("./middleware/errorHandler");
const req = { method: "GET", originalUrl: "/test" };
const res = { status: () => ({ json: console.log }) };
const err = new Error("Unique Constraint");
err.name = "SequelizeUniqueConstraintError";
err.errors = [{ path: "phone" }];
try {
  errorHandler(err, req, res, () => {});
} catch (e) {
  console.error("CRASHED!", e);
}
