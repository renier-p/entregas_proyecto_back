import mongoose from 'mongoose'

const collection = "messages"

const schema = new mongoose.Schema({
    user: String,
    message: String,
    
},
{ timestamps: true}
)

const messageModel = mongoose.model(collection,schema)

export default messageModel