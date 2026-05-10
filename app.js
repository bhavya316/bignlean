const http = require("http");
const apis = require("./routes");
const sequelize = require("./config/database");

const port = process.env.PORT || 3002;
// const port =  1135;
sequelize.sync();

const server = http.createServer(apis);

server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
