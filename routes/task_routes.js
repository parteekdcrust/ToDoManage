const express =require('express');
const router = express.Router();
const{ createTask, getAllTasks,getTask,deleteTask, assignTask} = require('../controller/task_controller');
const {verifyToken} = require('../controller/auth_controller');

router.route('/').post(createTask);
router.route('/').get(getAllTasks);
router.route('/:id').get(getTask);
router.route('/:id').delete(verifyToken,deleteTask);
router.route('/assign/:id').post(verifyToken,assignTask );


module.exports = router;