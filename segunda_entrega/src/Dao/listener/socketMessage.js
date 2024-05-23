import MessageManager from "../mongo/messageManagerMongo.js";

const mess = new MessageManager();

const socketMessage = (socketServer) => {
  socketServer.on("connection", async (socket) => {
    console.log("Usuario conectado con ID: " + socket.id);

    socket.on("nuevousuario", async (usuario) => {
      socket.broadcast.emit("broadcast", usuario);

      try {
        const messages = await mess.getMessages();
        socket.emit("chat", messages);
      } catch (error) {
        console.error("Error al obtener los mensajes:", error);
      }
    });

    socket.on("mensaje", async (info) => {
      await mess.createMessage(info);
      const messages = await mess.getMessages();
      socketServer.emit("chat", messages);
    });

    socket.on("clearchat", async () => {
      try {
        await mess.deleteAllMessages();
        const messages = await mess.getMessages();
        socketServer.emit("chat", messages);
      } catch (error) {
        console.error("Error al borrar los mensajes:", error);
      }
    });
  });
};

export default socketMessage;
