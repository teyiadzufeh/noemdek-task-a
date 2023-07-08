const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { JsonResponse } = require('../lib/apiResponse');
const { MSG_TYPES } = require('../constants/types');
const bcrypt = require("bcrypt");
const { jwtSign } = require('../middlewares/auth');
const { validateLogin, validateDriver } = require('../middlewares/validate');

/**
 * LOGIN A USER
 * POST /user/login
 * @param {*} req 
 * @param {*} res 
 */
exports.loginUser = async (req,res) => {
  try {
    const { error } = validateLogin(req.body);
    if(error) return JsonResponse(res, 400, error.details[0].message);

    const {email, password} = req.body;
    const userExists = await getUserViaEmailOrId(email);
    if (!(userExists.rows.length > 0)) {
      return JsonResponse(res, 400, MSG_TYPES.ACCOUNT_INVALID);
    }

    const validPassword = await bcrypt.compare(password, userExists.rows[0].password);
    if (!validPassword) return JsonResponse(res, 400, MSG_TYPES.ACCOUNT_INVALID);

    const token = await jwtSign(userExists.rows[0]);
    res.header("x-auth-token",token);

    await db.query(`
    UPDATE "user" SET token = '${token}' WHERE email=$1`,
    [email]
    )

    const loggedInUser = await getUserViaEmailOrId(email);
    delete loggedInUser.rows[0].password;
    return JsonResponse(res, 200, MSG_TYPES.LOGGED_IN, loggedInUser.rows[0]);
  } catch (error) {
    console.log(error);
    return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR, error);
  }
}

/**
 * CREATE A DRIVER
 * POST /user/driver/create
 * @param {*} req 
 * @param {*} res 
 */
exports.createDriver = async (req,res) => {
  try {
    const { error } = validateDriver(req.body);
    if(error) return JsonResponse(res, 400, error.details[0].message);

    const {first_name, last_name, email, password} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const driverExists = await getUserViaEmailOrId(email);
    if (driverExists.rows.length > 0) return JsonResponse(res, 400, MSG_TYPES.ACCOUNT_EXISTS)

    const driver = await db.query(
      `INSERT INTO "user" (id, first_name, last_name, email, password, role) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [uuidv4(), first_name, last_name, email, hashedPassword, 'driver']
    )

    delete driver.rows[0].password;
    return JsonResponse(res, 200, MSG_TYPES.ACCOUNT_CREATED, driver.rows[0]);
  } catch (error) {
    console.log(error);
    return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR);
  }
}

/**
 * GET A USER/DRIVER
 * GET /user/getUser
 * @param {*} req 
 * @param {*} res 
 */
exports.getUser = async (req,res) => {
    try {
        // REQUEST BODY FOR API
        const {email} = req.body;
        // CHECK IF USER EXISTS IN DB
        const userExists = await getUserViaEmailOrId(email);
        if (!(userExists.rows.length > 0)) {
          return res.status(404).json({
            status: 404,
            message: "The E-mail doesn't exist",
          });
        }else {
        delete userExists.rows[0].password;
        return res.status(200).json({
            status: 200,
            message: userExists.rows[0]
        })
        } 
    } catch (error) {
        console.log(error)
        next(error)   
    }
}

/**
 * DELETE USER
 * DELETE /user/delete/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteUser =  async (req,res) => {
  try {
    const userExists = await getUserViaEmailOrId(null, req.params.id)
    if (!(userExists.rows.length > 0)) {
      return JsonResponse(res,404,"This user doesn't exist")
    }else {
      await db.query(
        `DELETE FROM "user" WHERE id = $1`,
        [req.params.id]
      );
      return JsonResponse(res,200, MSG_TYPES.DELETED);
    } 
  } catch (error) {
    console.log(error)
    return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR);  
  }
}

//function to check if a user Exists.
const getUserViaEmailOrId = async (email, id) => {
  try {
    let userExists;
    if (email){
      userExists = await db.query(
        `SELECT *  FROM "user" WHERE email=$1`,
        [email]
      );
    }
    else if (email==null){
      userExists = await db.query(
        `SELECT *  FROM "user" WHERE id=$1`,
        [id]
      );
    }
    return userExists; 
  } catch (error) {
    console.log(error) 
  }
}