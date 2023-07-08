const db = require('../db');
const {nanoid} = require("nanoid");
const { JsonResponse } = require('../lib/apiResponse');
const { MSG_TYPES } = require('../constants/types');
const { validateScheduleUpdate } = require('../middlewares/validate');

/**
 * CREATE SCHEDULE
 * POST /schedule/create
 * @param {*} req 
 * @param {*} res 
 */
exports.createSchedule = async (req,res) => {
    try {
      let {vehicleId, driverId, clientId, service, startDate, endDate, pickup, dropoff, note} = req.body;
      if (!dropoff) dropoff = pickup;

      const id = `${vehicleId.slice(0,5)}_${driverId.slice(0,5)}_${nanoid(10)}`;
      const createdBy = `${req.user.first_name} ${req.user.last_name}`;

      let checkClientID = await isUUID(clientId);
      let checkDriverID = await isUUID(driverId);
      
      if (!checkClientID) return JsonResponse(res, 400, 'Invalid clientid format. Must be uuid');
      if (!checkDriverID) return JsonResponse(res, 400, 'Invalid driverid format. Must be uuid');

      const vehicleExists = await db.query(
        `SELECT *  FROM vehicle WHERE id=$1`,
        [vehicleId]
      );
      if (!(vehicleExists.rows.length > 0)) {
        return JsonResponse(res, 400, 'Invalid vehicle id, vehicle not found');
      }

      const clientExists = await db.query(
        `SELECT *  FROM customer WHERE id=$1`,
        [clientId]
      );
      if (!(clientExists.rows.length > 0)) {
        return JsonResponse(res, 400, 'Invalid client id, client not found');
      }


      const driverExists = await db.query(
        `SELECT *  FROM "user" WHERE id=$1 AND role='driver'`,
        [driverId]
      );
      if (!(driverExists.rows.length > 0)) {
        return JsonResponse(res, 400, 'Invalid driver id, driver not found');
      }

      const schedule = await db.query(
        `INSERT INTO schedule (id, vehicle_id, driver_id, client_id, service, start_date, end_date, pickup, dropoff, note, created_by) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`, 
        [id, vehicleId, driverId, clientId, service, startDate, endDate, pickup, dropoff, note, createdBy]
      );

      return JsonResponse(res, 200, MSG_TYPES.CREATED, schedule.rows[0]);
    } catch (error) {
      console.log(error);
      return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR);
    }
}

/**
 * GET ALL SCHEDULES
 * GET /schedule/all
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllSchedules = async (req,res) => {
    try {
      // CHECK IF SCHEDULE EXISTS IN DB
      const scheduleExists = await db.query(
        `SELECT * FROM schedule`
      );
      if (!(scheduleExists.rows.length > 0)) {
        return JsonResponse(res,400,'No schedules found');
      }else {
      return JsonResponse(res,200,'Schedule(s) fetched successfully',scheduleExists.rows)
      } 
    } catch (error) {
      console.log(error)
      return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR);   
    }
}

/**
 * GET SCHEDULE FOR A VEHICLE
 * GET /schedule/vehicle/:vehicleId
 * @param {*} req 
 * @param {*} res 
 */
exports.getVehicleSchedule = async (req,res, next) => {
  try {
      // CHECK IF SCHEDULE EXISTS IN DB
      const scheduleExists = await db.query(
        `SELECT schedule.*, vehicle.name AS vehicleName, vehicle.type AS vehicleType, vehicle.status AS vehicleStatus  
        FROM schedule 
        INNER JOIN vehicle ON schedule.vehicle_id = vehicle.id
        WHERE schedule.vehicle_id=$1`,
        [req.params.vehicleId]
      );
      if (!(scheduleExists.rows.length > 0)) {
        return JsonResponse(res,400,'Invalid Vehicle Id');
      }else {
      return JsonResponse(res,200,'Schedule(s) fetched successfully',scheduleExists.rows)
      } 
  } catch (error) {
      console.log(error)
      return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR);   
  }
}

/**
 * GET SCHEDULE FOR A DRIVER
 * GET /schedule/driver/:driverId
 * @param {*} req 
 * @param {*} res 
 */
exports.getDriverSchedule = async (req,res, next) => {
  try {
      // CHECK IF SCHEDULES EXIST IN DB
      const scheduleExists = await db.query(
        `SELECT schedule.*, "user".first_name AS driverFirstName, "user".last_name AS driverLastName, "user".email AS driverEmail  
        FROM schedule 
        INNER JOIN "user" ON schedule.driver_id = "user".id
        WHERE schedule.driver_id=$1`,
        [req.params.driverId]
      );
      if (!(scheduleExists.rows.length > 0)) {
        return JsonResponse(res,400,'Invalid Driver Id');
      }else {
      return JsonResponse(res,200,'Schedule(s) fetched successfully',scheduleExists.rows)
      } 
  } catch (error) {
      console.log(error)
      next(error)   
  }
}

/**
 * GET SCHEDULE
 * GET /schedule/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.getSchedule = async (req,res) => {
    try {
        // CHECK IF SCHEDULE EXISTS IN DB
        const scheduleExists = await db.query(
          `SELECT schedule.*, vehicle.name AS vehicleName, vehicle.type AS vehicleType, vehicle.status AS vehicleStatus  
          FROM schedule 
          INNER JOIN vehicle ON schedule.vehicle_id = vehicle.id
          WHERE schedule.id=$1`,
          [req.params.id]
        );
        if (!(scheduleExists.rows.length > 0)) {
          return JsonResponse(res,400,'Invalid Schedule Id');
        }else {
        return JsonResponse(res,200,'Schedule fetched successfully',scheduleExists.rows[0])
        } 
    } catch (error) {
        console.log(error)
        next(error)   
    }
}

/**
 * UPDATE SCHEDULE DETAILS
 * PUT /schedule/update/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.updateSchedule =  async (req,res) => {
  try {
    const { error } =validateScheduleUpdate(req.body);
    if(error) return JsonResponse(res,400, error.details[0].message);

    let {dropoff, note} = req.body;

    const scheduleExists = await db.query(
      `SELECT *  FROM schedule WHERE id=$1`,
      [req.params.id]
    );
    if (!dropoff) dropoff = scheduleExists.rows[0].dropoff
    if (!note) note = scheduleExists.rows[0].note
    if (!(scheduleExists.rows.length > 0)) {
      return JsonResponse(res,404,"This schedule doesn't exist")
    }else {
      const updatedSchedule = await db.query(
        `UPDATE schedule
        SET dropoff = $1, note = $2
        WHERE id = $3 RETURNING *`,
        [dropoff, note, req.params.id]
      );
      //RETURN THE UPDATED DETAILS
      return JsonResponse(res,200, MSG_TYPES.UPDATED, updatedSchedule.rows[0]);
    } 
  } catch (error) {
    console.log(error)
    return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR);  
  }
}

/**
 * DELETE SCHEDULE
 * DELETE /schedule/delete/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteSchedule =  async (req,res) => {
  try {
    const scheduleExists = await db.query(
      `SELECT *  FROM schedule WHERE id=$1`,
      [req.params.id]
    );
    if (!(scheduleExists.rows.length > 0)) {
      return JsonResponse(res,404,"This schedule doesn't exist")
    }else {
      await db.query(
        `DELETE FROM schedule WHERE id = $1`,
        [req.params.id]
      );
      return JsonResponse(res,200, MSG_TYPES.DELETED);
    } 
  } catch (error) {
    console.log(error)
    return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR);  
  }
}

//FUNCTION TO ENSURE THAT A value is in UUID format
async function isUUID(str) {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str);
}