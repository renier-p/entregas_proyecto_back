import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import session from "express-session";
import bodyParser from "body-parser";
import { engine }  from "express-handlebars";
import MongoStore from 'connect-mongo';
import sessionsRouter from './router/api/session.js';
import viewsRouter from './router/views.js';


import productsRoutes from "./router/products.router.js"
import cartsRoutes from "./router/carts.router.js"
import viewsRoutes from "./router/views.router.js"
import socketProducts from './listener/socketProducts.js';
import socketMessage from './listener/socketMessage.js';


dotenv.config();
console.log(process.env.MONGO_URL);

const app = express();
const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//rutas

app.use("/api", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/", viewsRoutes);
app.use(session({
  secret:'secretkey',
  resave: false,
  saveUninitialized: true,
  store:MongoStore.create({ mongoUrl: 'mongodb+srv://rainer:2025@cluster0.1fy9xjh.mongodb.net/ecommerce_final?retryWrites=true&w=majority&appName=Cluster0' }),
  // cookie: { maxAge: 180 * 60 * 1000 },
}))
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter)

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((error) => console.error("Error en la conexion", error));

// const httpServer = app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const httpServer=app.listen(PORT, () => {
  try {
      console.log(`Listening to the port ${PORT}\nAcceder a:`)
      console.log(`\t1). http://localhost:${PORT}/api/products`)
      console.log(`\t2). http://localhost:${PORT}/api/carts`)
  }
  catch (err) {
      console.log(err)
  }
})

const socketServer = new Server(httpServer)
socketProducts(socketServer);
socketMessage(socketServer)
