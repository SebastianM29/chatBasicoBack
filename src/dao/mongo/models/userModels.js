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
    address:{
        type:String,
    },
    city:{
        type:String,
    },
    province:{
        type:String,
    },
    country:{
        type:String,
    },

    location:{
        type:{
            type:String,
            enum:['Point'],
            default:'Point'
        },
        coordinates:{
            type:[Number], // [Longitud, Latitud]
            default:undefined
        }

    },

    created: {
        type:Date,
        default:Date.now
    },


},{timestamps:false}

)



export default model('Users',userSchema)