import { request, response } from "express";
import { allUserSer, createUserSer, deleteUserSer, editProfileSer } from "../services/userServices.js";
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
        console.log('se logueo y este es el req.user',req.user);
        const {pass, ...userFiltered} = req.user._doc
        console.log('que quedaria en userFiltered',userFiltered);

        return res.json(userFiltered)
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

export const editProfileUser = async(req=request,res=response) => {
    try {
        const id = req.params.id
        const dataEdit = req.body
        console.log('viendo ',id,dataEdit);
        const resp = await editProfileSer(id,dataEdit)

        if (resp.error) {
            
            
            return res.status(400).json({
                msg:resp.msg
            })
        }

        res.json({
            msg:'perfil editado',
            data:resp.data
        })
        
    } catch (error) {
        throw new Error(error.message || 'Error al Editar');
        
    }
}


export const deleteUser = async (req=request,res=response) => {
    try {
        const id =  req.params.id
        console.log('viendo el id',id);
        await deleteUserSer(id)
        res.json({
            msg:'usuario eliminado'
        })
        
    } catch (error) {
        
        
        throw new Error(error.message || 'Error se Servidor al eliminar usuario');
    }

}

export const logout = (req=request,res=response) => {
    try {
        //limpieza de passport -req.user y req.session.passport
        req.logOut(function(err) {
            if (err) {
                console.log('error al borrar passport', err);
                
                return res.status(500).json({
                    msg:'Error al cerrar sesion',
                    error:err
                })
            }

        //Borra el regustro de store
            req.session.destroy(function(err) {
                if (err) {
                    console.log('error al destruir sesion', err);
                      return res.status(500).json({
                    msg:'Error al destruir sesion',
                    error:err
                })
                }


                console.log( 'necesito ver el valor de node_env', process.env.NODE_ENV);
                
                    res.clearCookie('connect.sid', { 
                        
                        secure: process.env.NODE_ENV === 'production', 
                        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                        maxAge: 24 *60 *60 * 1000,
                        httpOnly: true, // 👈 ¡AGREGA ESTO!
                        path: '/' // Agregar el path por defecto también es buena práctica
                    });
        
                return res.status(200).json({ msg: 'Sesión cerrada exitosamente.' })

            })
        })
        //  Borrar la Cookie del Navegador
        
    } catch (error) {

        throw new Error(error.message || 'Error al cerrar sesion');
        
    }
}