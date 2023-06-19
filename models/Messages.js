import mongoose from 'mongoose';

const messagesSchema = mongoose.Schema({
    
    text:String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var Messages = mongoose.model('Messages', messagesSchema);

export default Messages;