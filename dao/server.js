import  cors  from "cors";
import express, { urlencoded } from 'express'
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { Server as SocketIoServer  } from "socket.io";
import * as http from "http";
import  userRoutes  from "../routes/user.routes.js";
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
    
    this.app = express()
    this.httpServer = http.createServer(this.app)

    this.io = new SocketIoServer(this.httpServer,{
        cors:{
            origin:["http://localhost:5173"],
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
               maxAge: 24 *60 *60 * 1000,
               secure: false,
               httpOnly:true
        }
    }
    
    // passportInitialize()
    this.middlewares()
    this.routes()
    this.configureSocket()
    this.socket()
    this.initializePassport()
    this.connectingDB()
    
    }

    middlewares() {
        this.app.use(express.json())
        this.app.use(urlencoded({
            extended:true
        }))
        this.app.use(cors())
        
        this.app.use(session(this.configSession))
        this.app.use(passport.initialize())
        this.app.use(passport.session())


        this.app.use(express.static(path.join(_dirname,"../public")))

    }
    
    routes(){
        this.app.use('/users',userRoutes)
    }

    configureSocket() {
        const wrap = (middleware) => (socket,next) => middleware(socket.request,{},next)
        this.io.use(wrap(session(this.configSession)))
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
        this.httpServer.listen(3000, () => {
            console.log('conectado');
            
        })
    }

    async connectingDB(){
        await connectDb()
    }

}