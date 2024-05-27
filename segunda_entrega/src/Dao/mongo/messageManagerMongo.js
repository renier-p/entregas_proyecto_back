import messageModel from "../models/messages.model.js"
export default class MessageManager {
    getMessages = async () => {
        try {
            return await messageModel.find().lean();
        } catch (error) {
            console.error("Error al obtener mensajes:", error)
            return error
        }
    }
    

    createMessage = async (message) => {
        if (message.user.trim() === '' || message.message.trim() === '') {
            console.warn("Mensaje vacío.")
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
        console.error("Error borrando mensaje:", error)
        return error
        }
    }
}