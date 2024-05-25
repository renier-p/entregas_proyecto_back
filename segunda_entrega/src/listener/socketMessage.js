import MessageManager from "../Dao/mongo/messageManagerMongo.js";
const mm = new MessageManager();

const socketChat = (socketServer) => {
    socketServer.on('connection', async (socket) => {
        console.log("Usuario conectado: " + socket.id);


        socket.on("nuevousuario", async (usuario) => {
            socket.broadcast.emit("broadcast", usuario);

            try {
                const messages = await mm.getMessages();
                socket.emit("chat", messages); 
            } catch (error) {
                console.error("Error obteniendo mensajes:", error);
            }
        });

      
        socket.on("mensaje", async (info) => {
            await mm.createMessage(info);
            const messages = await mm.getMessages();
            socketServer.emit("chat", messages); 
        });

        socket.on("clearchat", async () => {
            try {
                await mm.deleteAllMessages();
                const messages = await mm.getMessages();
                socketServer.emit("chat", messages); 
            } catch (error) {
                console.error("Error borrando mensajes:", error);
            }
        });
    });
};

export default socketChat;
