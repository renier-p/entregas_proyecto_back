import messageModel from "../models/messages.model.js"

class MessageManager {
    getMessages = async () => {
        try {
            return await messageModel.find().lean();
        } catch (error) {
            console.error("Error obteniendo mensajes:", error)
            return error
        }
    }
    

    createMessage = async (message) => {
        if (message.user.trim() === '' || message.message.trim() === '') {
            console.warn("El mensaje está en blanco.")
            return null;
    }

    try {
        return await messageModel.create(message)
    } catch (error) {
        console.error("Error al crear mensaje:", error)
        return error
    }
}

deleteAllMessages = async () => {
try {
    console.log("Borrando mensajes...")
    const result = await messageModel.deleteMany({})
    console.log("Mensajes borrados:", result)
    return result
    } catch (error) {
        console.error("Error al borrar los mensajes:", error)
        return error
        }
    }
}

export default MessageManager;