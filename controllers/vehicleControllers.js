const db = require('../db');
const {nanoid} = require("nanoid");
const { JsonResponse } = require('../lib/apiResponse');
const { MSG_TYPES } = require('../constants/types');

/**
 * CREATE VEHICLE
 * POST /create
 * @param {*} req 
 * @param {*} res 
 */
exports.createVehicle = async (req,res) => {
    try {
      const {name, type, status} = req.body;

      const id = `${name.slice(0,3)}_${type.slice(0,2)}_${nanoid(15)}`;

      const vehicle = await db.query(
        `INSERT INTO vehicle (id, name, type, status) 
        VALUES ($1, $2, $3, $4) RETURNING *`, 
        [id, name, type, status]
      );

      return JsonResponse(res, 200, MSG_TYPES.CREATED, vehicle.rows[0]);
    } catch (error) {
      console.log(error);
      return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR);
    }
}

/**
 * GET VEHICLE
 * GET /vehicle/get/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.getVehicle = async (req,res) => {
  try {
      // CHECK IF CUSTOMER EXISTS IN DB
      const vehicleExists = await db.query(
        `SELECT *  FROM vehicle WHERE id=$1`,
        [req.params.id]
      );
      if (!(vehicleExists.rows.length > 0)) {
        return JsonResponse(res,404,'Vehicle not found')
      }else {
        delete vehicleExists.rows[0].password;
        //RETURN THE FETCHED DETAILS
        return JsonResponse(res,200, 'Vehicle details fetched successfully', vehicleExists.rows[0]);
      } 
  } catch (error) {
      console.log(error)
      return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR);  
  }
}

/**
 * UPDATE VEHICLE DETAILS
 * PUT /vehicle/update/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.updateVehicle =  async (req,res) => {
  try {
    //VALIDATE REQUEST BODY
    if (!req.body.status) return JsonResponse(res,400,'Can only update vehicle status');
    
    const {status} = req.body;
    const vehicleExists = await db.query(
      `SELECT *  FROM vehicle WHERE id=$1`,
      [req.params.id]
    );
    if (!(vehicleExists.rows.length > 0)) {
      return JsonResponse(res,404,"This vehicle doesn't exist")
    }else {
      const updatedVehicle = await db.query(
        `UPDATE vehicle
        SET status = $1
        WHERE id = $2 RETURNING *`,
        [status, req.params.id]
      );
      delete updatedVehicle.rows[0].password;
      //RETURN THE UPDATED DETAILS
      return JsonResponse(res,200, MSG_TYPES.UPDATED, updatedVehicle.rows[0]);
    } 
  } catch (error) {
    console.log(error)
    return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR);  
  }
}

/**
 * DELETE VEHICLE
 * DELETE /vehicle/delete/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteVehicle =  async (req,res) => {
  try {
    const vehicleExists = await db.query(
      `SELECT *  FROM vehicle WHERE id=$1`,
      [req.params.id]
    );
    if (!(vehicleExists.rows.length > 0)) {
      return JsonResponse(res,404,"This vehicle doesn't exist")
    }else {
      await db.query(
        `DELETE FROM vehicle WHERE id = $1`,
        [req.params.id]
      );
      return JsonResponse(res,200, MSG_TYPES.DELETED);
    } 
  } catch (error) {
    console.log(error)
    return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR);  
  }
}