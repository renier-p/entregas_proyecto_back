import express from "express";
import mongoose from "mongoose";
import mongodb from "mongodb";
import dotenv from "dotenv";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";

dotenv.config();
console.log(process.env.MONGO_URL);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((error) => console.error("Error en la conexion", error));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
