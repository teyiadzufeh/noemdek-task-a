const jwt = require('jsonwebtoken');
const db = require('../db');
const { MSG_TYPES, USER_ROLES } = require("../constants/types");
const { JsonResponse } = require('../lib/apiResponse');


const jwtSign = async (user) => {
    const payload = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
    }
    return jwt.sign(
        payload, 
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: '1d'
        });
}

const userAuth = async (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        return JsonResponse(res, 401, MSG_TYPES.ACCESS_DENIED);
    }

    try {
        //Store decoded token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
        let user;
        let userToken;

        //check whether token matches what is in the db
        user = await db.query(
            `SELECT *  FROM "user" WHERE id=$1`,
            [decoded.id]
          );
        
        //assign value of the user token if it exists
        userToken = user && user.rows[0].token;
        if (userToken == undefined) {
            //if userToken is undefined, check whether user is a customer instead
            user = await db.query(
                `SELECT *  FROM customer WHERE id=$1`,
                [decoded.id]
              );
            userToken = user && user.rows[0].token;

            //if userToken is still undefined, the token is invalid
            if(userToken == undefined){
                return JsonResponse(res, 404, "Token is invalid for this user");
            }
        } else if (userToken !== token) {
            //token is invalid if userToken doesn't match the pattern
            return JsonResponse(res, 401, MSG_TYPES.WRONG_TOKEN);
        }

        //store the "decoded" object as the user. 
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return JsonResponse(res, 403, MSG_TYPES.SESSION_EXPIRED);
        }
        JsonResponse(res, 406, MSG_TYPES.INVALID_TOKEN)
    }
}

const userRoles = (roles = []) => {
    return async (req, res, next) => {
        if (req.user.role === USER_ROLES.ADMIN) {
            next();
        } else {
            if (roles.length < 1) {
                return JsonResponse(res, 403, MSG_TYPES.PERMISSION);
            } else if (roles.includes(req.user.role)) {
                next();
            } else {
                return JsonResponse(res, 403, MSG_TYPES.PERMISSION);
            }
        }
    }
}

module.exports = {jwtSign, userAuth, userRoles}