const express = require('express');
const router = express.Router();
const UsersController = require('../controller/UsersController');
const {
  protect
} = require('../middleware/AuthMiddleware');
const upload = require('../middleware/MulterMiddleware');

// getData
router.get('/', UsersController.getAllUsers);
router.get('/:id', UsersController.getDetailUsers);
router.put('/:id', protect, upload, UsersController.updateUsers);
// router.delete('/:id', jobseekersController.deleteJobseekers);

// // auth
router.post('/auth/register', UsersController.registerUsers);
router.post('/auth/login', UsersController.loginUser);
router.post('/auth/refresh-token', UsersController.refreshTokenUsers);

module.exports = router;