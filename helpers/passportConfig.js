
import Users from "../dao/mongo/models/userModels.js";
import passport from "passport";
import {Strategy} from "passport-local";
import { createUserSer, loginSer } from "../services/userServices.js";



export const passportInitialize = () => {

    passport.use('register', new Strategy({
        passReqToCallback:true,
        usernameField:'email',
        passwordField:'pass'},async ( req,username,password,done) => {
            try {
                     const user =  {
                    name: req.body.name,
                    nickname:req.body.nickname,
                    email:username,
                    pass: password,
                    imagePath:req.body.imagePath,
                    created:req.body.created
                    
                }
                const resp = await createUserSer(user)

                if (resp.error) {
                    console.log('entrrando a error');
                    
                    return done(null,false,{msg:resp.msg})
                }
              
               
            
            done(null, resp.data ); 
                
                
            } catch (error) {

                console.log('entra al catch');
                
                console.log(error);
               return done(error)
                
            }


        }))

    passport.use('login', new Strategy({
           passReqToCallback:true,
           usernameField:'email',
          passwordField:'pass'
          },async(req,username,password,done) => {
          try {
            
            
            const resp = await loginSer(username,password)
            if (resp.error) {
                
                console.log('entra al error de login?');
                
                 
                return done(null,false,{msg:resp.msg})
                
            }

            return done(null,resp.data)

         } catch (error) {
            return done(error)
         }

        }

    ))


    passport.serializeUser((user,done) => {
        done(null,user.id)

    })

    passport.deserializeUser(async(id,done) => {
        const finding = await Users.findById(id)
        done(null,finding)
    })
}
