import { request, response } from "express";
import { allUserSer, createUserSer } from "../services/userServices.js";
import { getMonthlySeriesForChartSer } from "../services/purchaseServices.js";


export const allUser = async(req=request,res=response) => {
   
    
const all = await allUserSer()
if (all.error) {
    console.log(`${all.msg}`);
    return res.status(400).json({
            msg:all.msg
    })
    
}

return res.json({
    users : all
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

 export const login = async(req=request,res=response) => {
    try {
        if (req.userError) {
            console.log('HAY UM ERROR FINAl?');
            
             return res.status(400).json({msg:req.userError})
        }
        console.log('se logueo y este es el req.user',req.user,req.session);
        
        return res.json(req.user)
    } catch (error) {
        throw new Error(error.message);
        
    }


 }

 export const monthSales = async(req=request,res=response) => {
    try {

        
        const  id  = req.params.id;
        const  year  = req.params.year;
        console.log('llegando a las ventas mensuales',id,year);

       const sales = await getMonthlySeriesForChartSer(id, { year });
       console.log('lo que me devolveria sales',sales);
       
       return res.json(sales);
    } catch (error) {
        throw new Error(error.message);
    }
}
