import mongoose from 'mongoose';

const loginSchema = mongoose.Schema({
   
    firstname: String,
    lastname: String,
    email: String,
    when: {
        type: Date,
        default: new Date(),
    },
})

var loginUsers = mongoose.model('loginUsers', loginSchema);

export default loginUsers;