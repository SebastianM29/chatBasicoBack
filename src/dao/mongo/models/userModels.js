import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema ({
    name: {
        type:String,
        required:true
    },
    nickname: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
    },
    pass: {
        type:String,
        required:true
    },
    imagePath: {
        type:String,
        required:false
    },
    role: {
        type:String,
        default:'user',
        enum:['user','admin']

    },
    created: {
        type:String,
        required:true
    },


})



export default model('Users',userSchema)