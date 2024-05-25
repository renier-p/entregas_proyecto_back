import mongoose from 'mongoose'

const messgaeCollection = "messages"

const messageSchema = new mongoose.Schema({
    user: String,
    message: String,
    
},
{ timestamps: true}
)

const messageModel = mongoose.model(messgaeCollection,messageSchema)

export default messageModel