import { compare, createHash } from "../../helpers/hash.js";
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
     
      
      if (![user.name,user.nickname,user.email,user.pass,user.imagePath,user.created].every(Boolean)) {
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

    async log(email,pass) {

     const finding = await User.findOne({email:email})
     if (!finding) {
      return{
        error:true,
        msg:'usuario no encontrado'
      }
     }

     const check = await compare(pass,finding)
     
     if (!check) {
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