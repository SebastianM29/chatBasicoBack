import { loginSer } from "../services/userServices.js";


export const socketControllers = (socket,io) => {
    socket.emit('actualUser',socket.id)
    if (socket.request.session?.user) {
     socket.emit('validateUser',socket.request.session.user)
    }
    socket.on('sendUser',async(obj) => {
      console.log(obj.email,obj.password);
      const resp = await loginSer(obj.email,obj.password)
      if (resp.error) {
        socket.emit('validateUser',resp.msg)
    }else{

      const session = socket.request.session
      session.user =  resp.data
      session.save()
          socket.emit('validateUser',session.user)

      }

      
    })

}