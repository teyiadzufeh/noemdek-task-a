const express = require('express');
const router = express.Router();
const vehicleControllers = require('../controllers/vehicleControllers');
const { userAuth, userRoles } = require('../middlewares/auth');
const { USER_ROLES } = require('../constants/types');

router.post('/create', [userAuth, userRoles([USER_ROLES.ADMIN])], vehicleControllers.createVehicle);
router.put('/update/:id', [userAuth, userRoles([USER_ROLES.ADMIN])], vehicleControllers.updateVehicle);
router.delete('/delete/:id', [userAuth, userRoles([USER_ROLES.ADMIN])], vehicleControllers.deleteVehicle);
router.get('/get/:id', [userAuth, userRoles([USER_ROLES.ADMIN])], vehicleControllers.getVehicle);

module.exports = router;