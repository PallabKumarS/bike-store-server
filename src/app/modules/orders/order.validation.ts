import Joi from 'joi';

// Joi schema for validating the order data
export const orderValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  product: Joi.string().required().messages({
    'string.base': 'Product ID must be a string',
    'any.required': 'Product ID is required',
  }),
  quantity: Joi.number().integer().positive().required().messages({
    'number.base': 'Quantity must be a positive integer',
    'any.required': 'Quantity is required',
    'number.positive': 'Quantity must be a positive integer',
  }),
  totalPrice: Joi.number().positive().required().messages({
    'number.base': 'Total Price must be a positive number',
    'any.required': 'Total Price is required',
    'number.positive': 'Total Price must be a positive number',
  }),
});
