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
    },
    monthKey: {
       type: String,
       index: true },
    year: { 
        type: Number,
        index: true 
    },
    monthNum: {
        type: Number,
        index: true
    }


})

// Si no viene seteado, lo derivamos de createdAt
purchaseSchema.pre("save", function(next) {
  if (!this.monthKey && this.createdAt) {
    const d = new Date(this.createdAt);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    this.monthKey = `${yyyy}-${mm}`;
  }
  next();
});

export default model('Purchase',purchaseSchema)