import Joi from 'joi';

export const bikeValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  brand: Joi.string().required().messages({
    'string.base': 'Brand must be a string',
    'any.required': 'Brand is required',
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a positive number',
    'any.required': 'Price is required',
    'number.positive': 'Price must be a positive number',
  }),
  category: Joi.string()
    .valid('Mountain', 'Road', 'Hybrid', 'Electric')
    .required()
    .messages({
      'any.required': 'Category is required',
      'any.only': 'Category must be one of Mountain, Road, Hybrid, or Electric',
    }),
  description: Joi.string().required().messages({
    'string.base': 'Description must be a string',
    'any.required': 'Description is required',
  }),
  quantity: Joi.number().integer().positive().required().messages({
    'number.base': 'Quantity must be a positive integer',
    'any.required': 'Quantity is required',
    'number.positive': 'Quantity must be a positive integer',
  }),
  inStock: Joi.boolean().required().messages({
    'any.required': 'inStock is required',
    'boolean.base': 'inStock must be a boolean value',
  }),
});
