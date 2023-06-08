const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { initDB, disconnectDB } = require("./config/dbConnect");
initDB();
require("dotenv").config();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const swaggerUi = require('swagger-ui-express');
swaggerDocument = require(`./swagger.json`);
const cors = require('cors');
app.use(cors());
const logger = require('./config/logger');

const authRouter = require('./routes/auth_routes');
const taskRouter = require('./routes/task_routes');
const userRouter = require('./routes/admin_routes');

app.use('/api/auth',authRouter);
app.use('/api/task',taskRouter);
app.use('/api/admin/user',userRouter);

app.use((req, res, next) => {
  logger.info("Hello from middleware");
  next();
});
process.on("SIGINT", () => {
  disconnectDB();
  logger.info("Closing server");
  process.exit();
});

process.on("exit", () => {
  logger.info("Server closed");
});
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  logger.info(`Server is listening on port ${port}`);
});
