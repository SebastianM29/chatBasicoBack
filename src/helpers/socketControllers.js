import { connectedUsersManager } from "../dao/connectedUsers.js";
import { loginSer } from "../services/userServices.js";

let currentAuction = null;
let auctionTimer = null;
let timeLeft = 0;

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

   socket.on('logout',(id) => {
    console.log('id que llega',id);
    

   })

   socket.on('start',(product) => {
    console.log('llega el producto?',product);
    
    timeLeft = 120
    currentAuction = {product,time:timeLeft}


    io.emit('startR',currentAuction)

    if (auctionTimer) {
        clearInterval(auctionTimer)
    }

    auctionTimer = setInterval(() => {
      timeLeft--
      io.emit('tick',{time:timeLeft})

      if (timeLeft <= 0) {
        clearInterval(auctionTimer)
        auctionTimer = null
        io.emit('end',{product:currentAuction})
        currentAuction = null
        
      }

    }, 1000);     
   })

   socket.on('currentProduct',(cb) => {
  if (typeof cb === 'function') {
    cb( currentAuction? currentAuction : null)
    
  }
   })





}