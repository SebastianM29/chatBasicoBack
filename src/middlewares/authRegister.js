import passport from "passport";

export const authRegister = (Strategy) => {

    return (req,res,next) => {
         passport.authenticate(Strategy,(err,user,info) => {

            console.log('que deberia llegar a este lugar, Estoy desde el middleware authRegister',user);
            
            if (err) {
                console.log("pasa por err");
                
                return next(err)
            }


            if (!user) {
                console.log("pasa por sin usuario");
                req.userError = info.msg
                return next()
            }


            req.logIn(user,(err) => {
                if(err) {
                    return res.status(400).json({error:'error session passport',details:err})
                }

                //-----
                req.session.save((saveErr) => {
                 
                   if (saveErr) {
                       console.error('session save error:', saveErr);
                       return res.status(500).json({ error: 'Error saving session', details: saveErr }); 
                    }
                    
                    // 🟢 PASO 2: SOLO CONTINÚA A LA RUTA FINAL CUANDO EL GUARDADO ES EXITOSO 🟢
                
                    console.log('--- LOGIN: session guardada ---');
                    console.log('req.sessionID:', req.sessionID);
                    console.log('req.session.passport:', req.session.passport); // debería verse { user: 'id' }
                    console.log('req.user:', req.user);

                    return next();
              
               
       
                 // LOGS PARA VERIFICAR
       
                 // Si este middleware tiene que delegar a otro handler (next), llamalo ahora
                 // next();
       
                 // O responder directamente (si tu flujo responde aquí)
                 
                 //---
                })
                
             
             
            })



        })
        (req,res,next)
    }

}