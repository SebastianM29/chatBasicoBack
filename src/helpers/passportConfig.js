
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
                    imagePath: 'imgUser/' + req.file.filename,
                    created: new Date()
                    
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
          passwordField:'password'
          },async(req,username,password,done) => {
          try {
            
            
            
            const resp = await loginSer(username,password)
            if (resp.error) {
                
                console.log('entra al error de login?');
                
                 
                return done(null,false,{msg:resp.msg})
                
            }
              console.log('aca passport lo usa');
              
            return done(null,resp.data)

         } catch (error) {
            return done(error)
         }

        }

    ))


    passport.serializeUser((user,done) => {
        done(null,{
            id:user._id.toString(),
            email:user.email,

        
        
        
        
        })

    })

    //  name: req.body.name,
    //                 nickname:req.body.nickname,
    //                 email:username,
    //                 pass: password,
    //                 imagePath: 'imgUser/' + req.file.filename,
    //                 created: new Date()

    passport.deserializeUser(async(user,done) => {
          // 🚨 DEBUG: Mira si se llama y qué ID busca
    console.log('--- DESERIALIZACIÓN INICIADA ---');
    console.log('ID que Passport está buscando:', user.id); 

    try {
        const finding = await Users.findById(user.id);

        if (!finding) {
            console.log('🔴 ERROR: Usuario NO encontrado en la DB con ID:', user.id);
            return done(null, false); // Esto resulta en el 401
        }
        
        console.log('🟢 ÉXITO: Usuario encontrado y deserializado:', finding.email);
        done(null, finding);
    } catch (error) {
        console.error('🔴 ERROR CRÍTICO en la DB durante deserialización:', error);
        done(error);
    }
    })
}
