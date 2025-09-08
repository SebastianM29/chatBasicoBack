import mongoose, { model,Schema } from "mongoose";

const productSchema = new Schema( {
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    imagePath: {
        type: String,
        required: true
    }
})


export default model('Products',productSchema)