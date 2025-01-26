import { OrderModel } from '../modules/orders/order.model';
import { UserModel } from '../modules/user/user.model';

// order id
export const generateOrderId = async () => {
  const findLastOrderId = async () => {
    const lastOrder = await OrderModel.findOne({}, { id: 1, _id: 0 })
      .sort({ createdAt: -1 })
      .lean();

    return lastOrder?.id; // Return the full id (e.g., "Order-XXXX") without substring
  };

  let currentId = '0';
  const lastOrderId = await findLastOrderId();

  if (lastOrderId) {
    currentId = lastOrderId.substring(6); // Extract numeric part after "Order-"
  }

  const incrementId = `Order-${(Number(currentId) + 1).toString().padStart(4, '0')}`;
  return incrementId;
};

// user id
export const generateUserId = async () => {
  const findLastUserId = async () => {
    const lastUser = await UserModel.findOne({}, { id: 1, _id: 0 })
      .sort({ createdAt: -1 })
      .lean();

    return lastUser?.id ? lastUser.id : undefined; // No substring here
  };

  let currentId = '0';
  const lastUserId = await findLastUserId();

  if (lastUserId) {
    currentId = lastUserId.substring(5); // Extract the numeric part after 'User-'
  }

  const incrementId = `User-${(Number(currentId) + 1).toString().padStart(4, '0')}`;
  return incrementId;
};
