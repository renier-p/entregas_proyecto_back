import ProductManager from "../mongo/productsManagerMongo.js";

const prod = new ProductManager();

const socketProducts = (socketServer) => {
  socketServer.on("connection", async (socket) => {
    console.log("Cliente conectado con ID:", socket.id);

    const productList = await prod.getProductsView();

    socketServer.emit("enviodeproducts", productList);
    socket.on("addProduct", async (obj) => {
      await prod.addProduct(obj);

      const productList = await prod.getProductsView();

      socketServer.emit("enviodeproducts", productList);
    });
    socket.on("deleteProduct", async (id) => {
      console.log(id);

      await prod.deleteProduct(id);

      const productList = await prod.getProductsView();
      socketServer.emit("enviodeproducts", productList);
    });
    socket.on("nuevousuario", (usuario) => {
      console.log("usuario", usuario);
      socket.broadcast.emit("broadcast", usuario);
    });
    socket.on("disconnect", () => {
      console.log(`Usuario con el ID : ${socket.id} esta desconectado `);
    });
  });
};

export default socketProducts;
