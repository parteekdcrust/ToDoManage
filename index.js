const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {initDB,disconnectDB} = require('./config/dbConnect');
initDB();
require('dotenv').config();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function (req, res) {
  res.send('Hello World')
});

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
});