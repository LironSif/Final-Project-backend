import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        minlength: [2, 'too short'],
        maxlength:50
    },
    email: {
        type:String,
        required:true,
        unique:true,
        lowerCase:true,
        validate: {
            validator: function(value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: "invalid email address"
        }
    },
    password: {
        type: String,
        required: true,
        minlength:[8, "password must be at least 8 characters"]
    },
    chemicals: {
        type: Object, // or a more specific schema if needed
        required: true,
    },
    shelfConfig:{
        type: Object, // or a more specific schema if needed
    }
}, {
    timestamps: true,
    minimize: false
})

const User = mongoose.model('User', userSchema )
export default User;