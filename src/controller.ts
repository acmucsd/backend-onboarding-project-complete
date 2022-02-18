import { Router, Request, Response } from "express";
import path from "path";
import { createItem, createOrder, createUser, deleteItem, getItems, getOrder, getOrdersForUser, getUser, getUsers, loginUser } from "./service";

export const router = Router();

const checkValidString = (str) => {
  return str && (typeof str === 'string' || str instanceof String) && str.length > 0;
};

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// We're disabling bearer-based authentication for this example since it'll make it tricky to test with pure html
// sending bearer tokens in your requests is *far* easier using frameworks like axios or fetch
// const authorizedUsers = ["ronak"]; // not really how auth works, but this is a simple example
// 
// router.use("/admin", (req, res, next) => {
//   const bearerHeader = req.headers['authorization'];

//   if (bearerHeader) {
//     const bearer = bearerHeader.split(' ');
//     const bearerToken = bearer[1];
//     if (authorizedUsers.includes(bearerToken)) {
//       return next();
//     }
//   }
//   return res.status(401).send({ error: true, message: "Unauthorized" });
// });

// Item Routes

router.get('/items', async (req, res) => {
  return res.json(
    await getItems(req.dbConnection)
  );
});

router.post('/item', async (req: Request, res: Response) => {
  if (!('name' in req.body) || !('price' in req.body) || !('description' in req.body)) {
    res.status(400).send('Missing required variables!');
  }
  const name = req.body.name as string;
  const description = req.body.description as string;
  const price = Number(req.body.price);
  if (name.length < 0 || name.length > 26 || description.length < 0 || isNaN(price)) {
    return res.status(400).send('Invalid argument shape!');
  }
  const uuid = await createItem(req.dbConnection, name, description, price);
  return res.send({
    uuid
  });
});

router.delete('/items/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  if (!uuid) {
    res.status(400).send({ error: true, message: "bad uuid" });
  }
  await deleteItem(req.dbConnection, uuid);
  res.send({ error: false, message: "success" });
});

router.post('/order', async (req, res) => {
  const { itemId, userId } = req.body;
  if (itemId && userId) {
    res.send(await createOrder(req.dbConnection, itemId, userId));
  } else {
    res.status(400).send({ error: true, message: "invalid parameters"});
  }
});

router.get('/orders', async (req, res) => {
  const userId = req.query.userId as string;
  if (userId && userId.length > 0) {
    return res.send(await getOrdersForUser(req.dbConnection, userId))
  } else {
    return res.status(400).send({ error: true, message: "bad user status" });
  }
})

router.get('/orders/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  if (checkValidString(uuid)) {
    return res.send(await getOrder(req.dbConnection, uuid));
  } else {
    return res.status(400).send({ error: true, message: "invalid string"});
  }
});

router.post('/user', async (req, res) => {
  const { username, password } = req.body;
  if (checkValidString(username) && checkValidString(password)) {
    return res.send(await createUser(req.dbConnection, username, password));
  } else {
    return res.status(400).send({ error: true, message: "invalid string"});
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (checkValidString(username) && checkValidString(password)) {
    res.send(await loginUser(req.dbConnection, username, password));
  } else {
    return res.status(400).send({ error: true, message: "invalid string"});
  }
});

router.get('/users', async (req, res) => {
  res.send(await getUsers(req.dbConnection));
});

router.get('/users/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  if (checkValidString(uuid)) {
    res.send(await getUser(req.dbConnection, uuid));
  } else {
    return res.status(400).send({ error: true, message: "invalid string"});
  }
});

// error handling
router.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).send({ message: "Something went wrong on our side", error: true, details: JSON.stringify(err)});
});
