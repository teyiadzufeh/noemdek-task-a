const db = require('../db');
const { JsonResponse } = require('../lib/apiResponse');
const { MSG_TYPES } = require('../constants/types');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { validateCustomer, validateCustomerUpdate } = require('../middlewares/validate');

/**
 * CREATE CUSTOMER
 * POST /customer/create
 * @param {*} req 
 * @param {*} res 
 */
exports.createCustomer = async (req,res) => {
    try {
      //VALIDATE REQUEST BODY
      const { error } = validateCustomer(req.body)
      if(error) return JsonResponse(res, 400, error.details[0].message);

      const {name, company, email, password} = req.body;

      const id = uuidv4();
      const finalPassword = await bcrypt.hash(password, 10);

      const customerExists = await db.query(
        `SELECT *  FROM customer WHERE email=$1`,
        [email]
      );
      if (customerExists.rows.length > 0) {
        return JsonResponse(res, 400, 'Customer already exists with this email');
      }

      const customer = await db.query(
        `INSERT INTO customer (id, name, company, email, password) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`, 
        [id, name, company, email, finalPassword]
      );

      delete customer.rows[0].password;
      //RETURN THE CREATED CUSTOMER'S DETAILS
      return JsonResponse(res, 200, MSG_TYPES.CREATED, customer.rows[0]);
    } catch (error) {
      console.log(error);
      return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR);
    }
}

/**
 * GET CUSTOMER
 * GET /customer/get
 * @param {*} req 
 * @param {*} res 
 */
exports.getCustomer = async (req,res) => {
    try {
        // REQUEST BODY FOR API
        const {email} = req.body;
        // CHECK IF CUSTOMER EXISTS IN DB
        const customerExists = await db.query(
          `SELECT *  FROM customer WHERE email=$1`,
          [email]
        );
        if (!(customerExists.rows.length > 0)) {
          return res.status(400).json({
            status: 400,
            message: "This E-mail doesn't exist",
          });
        }else {
          delete customerExists.rows[0].password;
          //RETURN THE FETCHED DETAILS
          return JsonResponse(res,200, 'Customer details fetched successfully', customerExists.rows[0]);
        } 
    } catch (error) {
        console.log(error)
        return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR);  
    }
}

/**
 * UPDATE CUSTOMER DETAILS
 * PUT /customer/update/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.updateCustomer =  async (req,res) => {
  try {
    //VALIDATE REQUEST BODY
    const { error } = validateCustomerUpdate(req.body)
    if(error) return JsonResponse(res, 400, error.details[0].message);
    
    const {name, company} = req.body;
    const customerExists = await db.query(
      `SELECT *  FROM customer WHERE id=$1`,
      [req.params.id]
    );
    if (!(customerExists.rows.length > 0)) {
      return JsonResponse(res,404,"This customer doesn't exist")
    }else {
      const updatedCustomer = await db.query(
        `UPDATE customer
        SET name = $1, company = $2
        WHERE id = $3 RETURNING *`,
        [name, company, req.params.id]
      );
      delete updatedCustomer.rows[0].password;
      //RETURN THE UPDATED DETAILS
      return JsonResponse(res,200, MSG_TYPES.UPDATED, updatedCustomer.rows[0]);
    } 
  } catch (error) {
    console.log(error)
    return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR);  
  }
}

/**
 * DELETE CUSTOMER
 * DELETE /customer/delete/:id
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteCustomer =  async (req,res) => {
  try {
    const customerExists = await db.query(
      `SELECT *  FROM customer WHERE id=$1`,
      [req.params.id]
    );
    if (!(customerExists.rows.length > 0)) {
      return JsonResponse(res,404,"This customer doesn't exist")
    }else {
      await db.query(
        `DELETE FROM customer WHERE id = $1`,
        [req.params.id]
      );
      return JsonResponse(res,200, MSG_TYPES.DELETED);
    } 
  } catch (error) {
    console.log(error)
    return JsonResponse(res, 500, MSG_TYPES.SERVER_ERROR);  
  }
}