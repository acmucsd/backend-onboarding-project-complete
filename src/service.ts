import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { Item } from './models/Item';
import { Order } from './models/Order';
import { User } from './models/User';

export const createItem = async (conn: Connection, name: string, price: number) => {
  const item = new Item();
  item.name = name;
  item.description = "TODO: FILL THIS OUT";
  item.price = price;
  const createdItem = await conn.manager.save(item);
  return createdItem.uuid;
};

export const getItems = async (conn: Connection): Promise<Item[]> => {
  return conn.manager.find<Item>(Item)
}

export const deleteItem = async (conn: Connection, uuid: string): Promise<void> => {
  await conn.manager.delete(Item, {
    uuid
  });
}

// User Routes

export const createUser = async (conn: Connection, username: string, password: string): Promise<User> => {
  const user = new User();
  user.username = username;
  user.password = password;
  return conn.manager.save(user);
}

export const loginUser = async (conn: Connection, username: string, password: string): Promise<User> => {
  const account = await conn.manager.find(User, {
    where: {
      username,
      password
    }
  });
  if (account.length > 0) {
    return account[0];
  }
  throw new Error("no user found");
}

export const getUser = async (conn: Connection, userId: string): Promise<User> => {
  return conn.manager.findOne(User, { where: { uuid: userId } });
}

// Order Routes
export const createOrder = async (conn: Connection, itemId: string, userId: string): Promise<Order> => {
  const order = new Order();
  order.item = Item.create({ uuid: itemId });
  order.user = User.create({ uuid: userId });
  return conn.manager.save(Order, order);
}

export const getOrder = async (conn: Connection, orderId: string): Promise<Order> => {
  return conn.manager.findOne(Order, { where: { uuid: orderId } });
}
