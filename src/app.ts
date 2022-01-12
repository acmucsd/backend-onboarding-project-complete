import Express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import "reflect-metadata" // required for typeorm
import { createConnection } from "typeorm";
import cors from 'cors'
import { Item } from './models/Item';
import { router } from './controller';
import { Order } from './models/Order';
import { User } from './models/User';

const app = Express();
const port = process.env.PORT || 4000;

app.use(cors())

app.use(bodyParser.json()); // regular json payloads
app.use(bodyParser.urlencoded({ extended: true })); // html form payloads

const main = async () => {
  const options = process.env["DATABASE_URL"] ? {
    url: process.env["DATABASE_URL"],
  } : {
    host: process.env["DATABASE_URL"],
    port: 5432,
    username: "test",
    password: "password",
    database: "testdb",
  };

  const conn = await createConnection({
    ...options, type: 'postgres',
    entities: [
      Item,
      Order,
      User,
    ],
    synchronize: true,
    logging: false
  })

  // ensure every request has a db connection
  app.use((req, _res, next) => {
    req.dbConnection = conn;
    return next();
  });

  app.use(router)
  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
}

main();
