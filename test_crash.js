const errorHandler = require("./middleware/errorHandler");
const req = { method: "GET", originalUrl: "/test" };
const res = { status: () => ({ json: console.log }) };
try {
  errorHandler(new Error("Test"), req, res, () => {});
} catch (e) {
  console.error("CRASHED!", e);
}
