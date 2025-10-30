import  cors  from "cors";
import express, { urlencoded } from 'express'
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { Server as SocketIoServer  } from "socket.io";
import * as http from "http";
import  userRoutes  from "../routes/user.routes.js";
import  adminRoutes  from "../routes/admin.routes.js";
import { connectDb } from "../db/dbConnection.js";
import MongoStore from "connect-mongo";
import  obj  from "../config/config.js";
import session, { Cookie } from "express-session";
import { passportInitialize } from "../helpers/passportConfig.js";
import passport from "passport";
import { socketControllers } from "../helpers/socketControllers.js";
const _filename = fileURLToPath(import.meta.url)
const _dirname = dirname(_filename)



export class Server {
    constructor(){
    
    this.VERCEL =  "https://rematesargentina.vercel.app"

    this.isProduction = process.env.NODE_ENV === 'production' 

    console.log('necesito ver q valor tiene en la clase server el inicio',process.env.NODE_ENV);
    
    this.app = express()
    // justo después de crear this.app
    if (this.isProduction) {
    this.app.set('trust proxy', 1); // importante para que secure cookies funcionen detrás de proxies (Render, Heroku, etc.)
    }

    this.httpServer = http.createServer(this.app)

    this.io = new SocketIoServer(this.httpServer,{
        cors:{
            origin:["http://localhost:5173",this.VERCEL],
            
            credentials:true,
            methods:["GET","POST"]
        }

    })

    this.configSession = {
        store:MongoStore.create({
         mongoUrl:obj.mongoURLSession,
         ttl:1000000   
        }),
        secret:obj.sessionKey,
        resave:false,
        saveUninitialized:false,
        cookie: {
            secure: this.isProduction,
            sameSite: this.isProduction ?'none' :'lax',
            maxAge: 24 *60 *60 * 1000,
            httpOnly:true,
            path:'/',
            domain: this.isProduction ? 'rematesargentina.onrender.com' : undefined

        }
    }
    
    this.sessionMiddleware = session(this.configSession)
    // passportInitialize()
    this.initializePassport()

    this.middlewares()
    this.configureSocket()
    this.routes()
    this.socket()
    
    
    }
    

    middlewares() {
        this.app.use(express.json())
        this.app.use(urlencoded({
            extended:true
        }))
        this.app.use(cors({
            origin: (origin, callback) => {
            const allowedOrigins = [
           'http://localhost:5173',
           'https://rematesargentina.vercel.app'
               ];
              if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
              } else {
                  callback(new Error('Not allowed by CORS'));
              }
            },
            credentials:true
        }))
        
        this.app.use(this.sessionMiddleware)

           ///----ADD CHECKING MIDDLEWARE FOR SECURE COOKIES -----///
        this.app.use((req, res, next) => {
        // Verifica si la solicitud llegó a través de HTTPS (la bandera 'secure' en Express es fiable si 'trust proxy' está en true)
        const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
        
        // Verifica si la sesión existe y si la conexión es segura
        if (req.session && req.session.cookie && isSecure) {
            
            // Re-establece las opciones de la cookie de sesión para forzar SameSite=None
            req.session.cookie.secure = true;
            req.session.cookie.sameSite = 'none';

            // Este paso es a menudo redundante si la configuración inicial ya era correcta,
            // pero asegura que las propiedades no se borren en el camino.
        }
        next();
        });




        this.app.use(passport.initialize())
        this.app.use(passport.session())


        this.app.use(express.static(path.join(_dirname,"../public")))

    }
    
    routes(){
        this.app.use('/users',userRoutes)
        this.app.use('/admin',adminRoutes)
    }

    configureSocket() {
        const wrap = (middleware) => (socket,next) => middleware(socket.request,{},next)
        this.io.use(wrap(this.sessionMiddleware))
            // 2. APLICAR passport.initialize()
        this.io.use(wrap(passport.initialize())); 

        // 3. APLICAR passport.session()
        this.io.use(wrap(passport.session())); // 👈 Esto añade req.logIn, req.isAuthenticated, etc.

    }

    socket(){
        this.io.on('connection',  (socket) => {
            console.log('conectado el cliente');
            
           socketControllers(socket,this.io)
         }
        )
    }

    initializePassport() {
        passportInitialize()
    }

    listen(){
        const PORT = process.env.PORT || 3000;
        this.httpServer.listen(PORT, () => {
            console.log(`conectado en el puerto ${PORT}`);
        })
    }

    async connectingDB(){
        await connectDb()
    }

}