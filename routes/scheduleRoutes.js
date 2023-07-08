const express = require('express');
const router = express.Router();
const scheduleControllers = require('../controllers/scheduleControllers');
const { userAuth, userRoles } = require('../middlewares/auth');
const { USER_ROLES } = require('../constants/types');

router.post('/create', [userAuth, userRoles([USER_ROLES.ADMIN])], scheduleControllers.createSchedule);
router.get('/all', [userAuth, userRoles([USER_ROLES.ADMIN])], scheduleControllers.getAllSchedules);
router.get('/get/:id', [userAuth, userRoles([USER_ROLES.ADMIN])], scheduleControllers.getSchedule);
router.put('/update/:id', [userAuth, userRoles([USER_ROLES.ADMIN])], scheduleControllers.updateSchedule);
router.delete('/delete/:id', [userAuth, userRoles([USER_ROLES.ADMIN])], scheduleControllers.deleteSchedule);
router.get('/vehicle/:vehicleId', [userAuth, userRoles([USER_ROLES.ADMIN])], scheduleControllers.getVehicleSchedule);
router.get('/driver/:driverId', [userAuth, userRoles([USER_ROLES.ADMIN, USER_ROLES.DRIVER])], scheduleControllers.getDriverSchedule);

module.exports = router;