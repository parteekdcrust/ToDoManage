const express = require('express');
const router = express.Router();
const{ createTask, getAllTasks,getTask,deleteTask, assignTask, changeStatus} = require('../controller/task_controller');
const {verifyToken, authorize} = require('../controller/auth_controller');

router.route('/').post(verifyToken,createTask);
router.route('/').get(verifyToken,getAllTasks);
router.route('/:id').get(verifyToken,authorize(["Admin"]),getTask);
router.route('/:id').delete(verifyToken,deleteTask);
router.route('/assign/:id').post(verifyToken,assignTask );
router.route('/status/:id').post(verifyToken,changeStatus);

module.exports = router;