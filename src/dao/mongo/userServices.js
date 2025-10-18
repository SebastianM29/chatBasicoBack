import { compare, createHash } from "../../helpers/hash.js";
import { connectedUsersManager } from "../connectedUsers.js";
import User from "../mongo/models/userModels.js";

export class UserServices {
    constructor() {

    }

    async findAll() {
      const all = await User.find()
      if (all.length === 0 ) {
        return {
            error:true,
            msg:'no hay usuarios'
        }
      }
      
      return all
    
    }

    async createUser(user) {
       console.log('ubicacion del usuario', user);
       user.location = JSON.parse(user.location)
       
      user.email = user.email?.trim().toLowerCase()
      
      if (![user.name,
            user.nickname,
            user.email,
            user.pass,
            user.imagePath,
            user.address,
            user.city,
            user.province,
            user.location
          
          ]
            .every(Boolean)) {
        console.log(user);
        
         return {
          error:true,
          msg:'faltan datos'
         }  
      }
      
      
      const findSameEmail = await User.findOne({email:user.email})
      
      if (findSameEmail) {
        return {
          error:true,
          msg:'Email ya registrado'
        }  
      }
      
      if (user.email === 'zzevazzz_1@hotmail.com') {
      user.role = 'admin'
      console.log('creando admin');
      
      }

      try {
        const creating = await createHash(user.pass)
        user.pass = creating

        const created = await User.create(user)
      
        
        return {
          error:false,
          data : created
        }
        
      } catch (error) {
        throw new Error('error en la base de datos' + error)
      }

    }

    async log(email,password) {
      
      
    console.log('llega email y password', email,password);
     const allNow = connectedUsersManager.getUsers()
      console.log(typeof allNow);
      
     for (const element of allNow) {
      console.log('deberia ver algo',element);
      console.log('deberia ver algo y seria el email',email);
      
      if (element.email  === email) {
        console.log('no deberia entrar al error');
        
      return{
      error:true,
      msg:'usuario ya conectado'
    }

      }  ;
      
      
     }


     console.log('usuarios conectados',allNow);
     
     const finding = await User.findOne({email:email})
     if (!finding) {
      return{
        error:true,
        msg:'usuario no encontrado'
      }
     }
    
     console.log('usuario encontrado ',finding);
     

     const check = await compare(password,finding.pass)
     
     if (!check) {
      console.log('entra a false');
      
      return {
        error:true,
        msg:'contraseña incorrecta'
     }}
     
     return{
      error:false,
      data:finding
     }

    }
}