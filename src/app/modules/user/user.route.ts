import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/users/create-user',
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createUser,
);

router.get(
  '/users/me',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  UserControllers.getMe,
);

router.patch(
  '/users/change-status/:userId',
  auth(USER_ROLE.admin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

router.get('/users', auth(USER_ROLE.admin), UserControllers.getAllUsers);

router.delete(
  '/users/:userId',
  auth(USER_ROLE.admin),
  UserControllers.deleteUser,
);

export const UserRoutes = router;
