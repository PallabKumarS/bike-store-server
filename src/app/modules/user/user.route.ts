import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';
import { UserControllers } from './user.controller';

const router = express.Router();

router.post(
  '/create-user',
  //   auth(USER_ROLE.admin),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createUser,
);

router.get(
  '/me',
  //  auth('customer', 'admin'),
  UserControllers.getMe,
);

router.post(
  '/change-status/:id',
  //   auth('admin'),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

export const UserRoutes = router;
