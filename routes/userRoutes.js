const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const { userAuth, userRoles } = require('../middlewares/auth');
const { USER_ROLES } = require('../constants/types');

router.get('/getUser', [userAuth, userRoles([USER_ROLES.ADMIN])], userControllers.getUser);
router.post('/login', userControllers.loginUser);
router.post('/driver/create', userControllers.createDriver);
router.delete('/delete/:id', [userAuth, userRoles([USER_ROLES.ADMIN])], userControllers.deleteUser);

module.exports = router;