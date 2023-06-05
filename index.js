const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { initDB, disconnectDB } = require("./config/dbConnect");
initDB();
require("dotenv").config();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const authRouter = require('./routes/auth_routes');
const taskRouter = require('./routes/task_routes');

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.use('/api/auth',authRouter);
app.use('/api/task',taskRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
