import { model,Schema } from "mongoose";

const purchaseSchema = new Schema({
 
    product:{
        type: Schema.Types.ObjectId,
        ref:'Products'
    },
    buyer:{
        type: Schema.Types.ObjectId,
        ref:'Users'
    },
    finalPrice:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }


})


export default model('Purchase',purchaseSchema)