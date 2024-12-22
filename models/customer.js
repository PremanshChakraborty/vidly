const mongoose =require('mongoose');
const Joi = require('joi');


const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        minlength: 5,
    }
}));

function validateCustomer(customer) {
    const schema = Joi.object({
        isGold: Joi.bool(),
      name: Joi.string().min(5).required(),
      phone: Joi.string().min(5),
    });
  
    return schema.validate(customer);
}

module.exports.Customer = Customer;
exports.validate = validateCustomer;