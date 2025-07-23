import passport from "passport";

export const authRegister = (Strategy) => {

    return (req,res,next) => {
         passport.authenticate(Strategy,(err,user,info) => {
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
                next()
                console.log("todo bien");
            })



        })
        (req,res,next)
    }

}