import { request, response } from "express";
import { allUserSer, createUserSer } from "../services/userServices.js";


export const allUser = async(req=request,res=response) => {
const all = await allUserSer()
if (all.error) {
    console.log(`${all.msg}`);
    
}

return res.json({
    msg:'todos los usuarios'
})
}

export const createUser = async(req=request,res=response) => {
try {
    
    if (!req.user) {
        console.log('en el controlador entra por el error ');
       return res.status(400).json({
            msg:req.userError
        })
        
        
    }
    
     console.log('deberia ver el usuario',req.user);
     
    const createUser = req.user
    
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                msg:'Error al destruir la sesion',
                data:createUser,
                error:err
            })
        }
      console.log('sesion destruida');
      
    })
    
    return res.json({
        msg:'usuario registrado',
        data:createUser
    })
} catch (error) {
    throw new Error("Error al registrar usuario" + error);
    
}
              
}



