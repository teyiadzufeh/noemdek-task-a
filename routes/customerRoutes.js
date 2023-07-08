const express = require('express');
const router = express.Router();
const customerControllers = require('../controllers/customerControllers');
const { userAuth, userRoles } = require('../middlewares/auth');
const { USER_ROLES } = require('../constants/types');

router.post('/create', customerControllers.createCustomer);
router.get('/get', [userAuth, userRoles([USER_ROLES.ADMIN])], customerControllers.getCustomer);
router.put('/update/:id', [userAuth, userRoles([USER_ROLES.ADMIN])], customerControllers.updateCustomer);
router.delete('/delete/:id', [userAuth, userRoles([USER_ROLES.ADMIN])], customerControllers.deleteCustomer);

module.exports = router;