import mongoose from "mongoose";
import obj from "../../config/config.js";

export const connectDb = async() => {
 
    try {
        // await mongoose.connect(obj.mongoURL)
        await mongoose.connect('mongodb+srv://zvzcaricatura:<db_password>@simplechat.s2czy5l.mongodb.net/?retryWrites=true&w=majority&appName=simpleChat')
        console.log('conectado a base de datos');
        
    } catch (error) {
        console.log(error);
        
        throw new Error("Error al conectarse en base de Datos",error);
        
    }

} 