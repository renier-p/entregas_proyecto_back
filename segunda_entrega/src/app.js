import express from "express";
import mongoose from "mongoose";
import mongodb from "mongodb";
import dotenv from "dotenv";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";

import productsRoutes from "./router/products.router.js"
import cartsRoutes from "./router/carts.router.js"
import viewsRoutes from "./router/views.router.js"
import socketProducts from './Dao/listener/socketProducts.js';
import socketMessage from './Dao/listener/socketMessage.js';


dotenv.config();
console.log(process.env.MONGO_URL);

const app = express();
const PORT = 8080;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((error) => console.error("Error en la conexion", error));

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

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((error) => console.error("Error en la conexion", error));

const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const socketServer = new Server(httpServer)
socketProducts(socketServer);
socketMessage(socketServer)
