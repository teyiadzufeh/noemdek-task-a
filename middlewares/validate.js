const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
    min: 8,
    max: 20,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 1,
};

function validateDriver(driver) {
    const Schema = Joi.object().keys({
        email: Joi.string().email().label("Email").max(100).required(),
        first_name: Joi.string().label("First Name").max(30).required(),
        last_name: Joi.string().label("Last Name").max(30).required(),
        password: passwordComplexity({ ...complexityOptions, requirementCount: 1 })
            .label("Password")
            .required(),
    });

    return Schema.validate(driver);
}

function validateCustomer(customer) {
    const Schema = Joi.object().keys({
        name: Joi.string().label("Name").max(100).required(),
        company: Joi.string().label("Company").max(100).required(),
        email: Joi.string().email().label("Email").max(100).required(),
        password: passwordComplexity({ ...complexityOptions, requirementCount: 1 })
            .label("Password")
            .required(),
    });

    return Schema.validate(customer);
}

function validateScheduleUpdate(schedule) {
    const Schema = Joi.object().keys({
        dropoff: Joi.string().label("Dropoff").max(100),
        note: Joi.string().label("Note").max(100)
    });

    return Schema.validate(schedule);
}

function validateCustomerUpdate(customer) {
    const Schema = Joi.object().keys({
        name: Joi.string().label("name").max(100),
        company: Joi.string().label("company").max(100)
    });

    return Schema.validate(customer);
}


function validateLogin(user) {
    const Schema = Joi.object().keys({
        email: Joi.string().email().label("Email").max(100).required(),
        password: Joi.string().label("Password").max(100).required(),
    });

    return Schema.validate(user);
}

module.exports = {
    validateDriver,
    validateLogin,
    validateCustomer,
    validateScheduleUpdate,
    validateCustomerUpdate,
    complexityOptions
};
