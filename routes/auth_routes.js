const express =require('express');
const Router = express.Router();

const {signup} = require('../controller/auth_controller');
Router.post('/signup', signup);

module.exports = Router;