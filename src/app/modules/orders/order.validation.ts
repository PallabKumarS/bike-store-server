import { z } from 'zod';

export const orderValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a valid email address',
      })
      .email('Email must be a valid email address'),

    product: z.string({
      required_error: 'Product ID is required',
      invalid_type_error: 'Product ID must be a string',
    }),

    quantity: z
      .number({
        required_error: 'Quantity is required',
        invalid_type_error: 'Quantity must be a positive integer',
      })
      .int('Quantity must be an integer')
      .positive('Quantity must be a positive integer'),

    totalPrice: z
      .number({
        required_error: 'Total Price is required',
        invalid_type_error: 'Total Price must be a positive number',
      })
      .positive('Total Price must be a positive number'),
  }),
});
