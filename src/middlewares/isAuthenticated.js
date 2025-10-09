export const isAuthenticated = (req,res,next) => {
    // 🚨 Log 1: Revisa el objeto session (debería tener el ID de Passport)
    // console.log('--- Revisión de Autenticación ---',req);
    console.log('Contenido de req.session:', req.session); 

    // 🚨 Log 2: Revisa si Passport pudo cargar el usuario
    console.log('Usuario cargado (req.user):', req.user); 
    console.log('Estado de autenticación:', req.isAuthenticated()); 
    console.log('-------------------------------');


    if (req.isAuthenticated()) {
        return next();
    }
    
    // Si llegamos aquí, la autenticación falló.
    res.status(401).json({ msg: 'Unauthorized' });
}