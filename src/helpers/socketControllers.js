import { connectedUsersManager } from "../dao/connectedUsers.js";
import { loginSer } from "../services/userServices.js";


export const socketControllers = (socket,io) => {
    socket.emit('actualUser',socket.id)
    // if (socket.request.session?.user) {

    // socket.emit('allUsers', connectedUsersManager.getUsers());
    //     socket.emit('validateUser',socket.request.session.user)

    // }

    socket.on('sendUser',async(obj) => {

        console.log(obj.email,obj.password);
        const resp = await loginSer(obj.email,obj.password)

      if (resp.error) {

        socket.emit('validateUser',resp.msg)

    }else{

        const session = socket.request.session
        session.user =  resp.data
        session.save()

        const respUser = connectedUsersManager.addUser(socket.id,resp.data)
          
        if (respUser.error) {
            socket.emit('validateUser',respUser.msg)
          }else{

            socket.emit('validateUser',session.user)
            io.emit('allUsers',connectedUsersManager.getUsers())
            io.emit('userConnected',{socket:socket.id,nickname:session.user.nickname})
          }

      }

      
    })

    socket.on('creatingMsg',msg => {
        console.log(msg);

        const user =  connectedUsersManager.getUser(socket.id)

        io.emit('newMsg',{user:user.nickname,msg})
    })

   socket.on('disconnect',() => {
        connectedUsersManager.removeUser(socket.id)
        if (socket.request.session) {
           socket.request.session.destroy()
        }
        io.emit('allUsers',connectedUsersManager.getUsers())  
     
   })


}