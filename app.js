import { Server } from "./src/dao/server.js";


const server = new Server()
await server.connectingDB()
server.listen()