import { connectedUsersManager } from "../dao/connectedUsers.js";
import { addPurchaseSer } from "../services/purchaseServices.js";
import { loginSer } from "../services/userServices.js";
import passport from 'passport';

let currentAuction = null;
let auctionTimer = null;
let timeLeft = 0;

export const socketControllers = (socket,io) => {
    
    socket.emit('actualUser',socket.id)


  
socket.on('sendUser', async (obj) => {
  console.log(obj.email, obj)
  


     // Tu lógica actual
      const respUser = connectedUsersManager.addUser(socket.id,obj)
      if (respUser.error) {
        socket.emit('validateUser', respUser.msg)
      } else {
        socket.emit('validateUser', obj)
        io.emit('allUsers', connectedUsersManager.getUsers())
        io.emit('userConnected', {
          socket: socket.id,
          user: obj.nickname,
          imagePath: obj.imagePath
        })
      }
  
  
 
 

})

    socket.on('creatingMsg',msg => {
        console.log(msg);

        const user =  connectedUsersManager.getUser(socket.id)
        console.log('usuario !!!logueado', socket.request.session);
        
        io.emit('newMsg',{user:user.nickname,msg})
    })

   socket.on('disconnect',() => {
        connectedUsersManager.removeUser(socket.id)
     
        io.emit('allUsers',connectedUsersManager.getUsers())  
     
   })

   socket.on('logout',() => {
   
         connectedUsersManager.removeUser(socket.id)

        if (socket.request.session) {
           socket.request.session.destroy()
        }
        io.emit('allUsers',connectedUsersManager.getUsers())  
      

   })

   socket.on('start', (product) => {
    console.log('llega el producto?',product);
    
    timeLeft = 30
    currentAuction = {product,time:timeLeft,highestBid:0,highestBidder:null}


    io.emit('startR',currentAuction)

    if (auctionTimer) {
        clearInterval(auctionTimer)
    }

    auctionTimer = setInterval(async () => {
      timeLeft--
      io.emit('tick',{time:timeLeft})

      if (timeLeft <= 0) {
        clearInterval(auctionTimer)
        auctionTimer = null
        const resp = await addPurchaseSer(currentAuction)
    
        console.log('necesito saber q termina enviandoi siempre',resp);
        
        io.emit('end',{purchase:resp})
        currentAuction = null
        
      }

    }, 1000); 

    
   })

   socket.on('currentProduct',(cb) => {
  if (typeof cb === 'function') {
    cb( currentAuction? currentAuction : null)
    
  }
   })

   socket.on('makeBid',(bid) => {
    console.log('llega la puja?',bid,'lo que hay',currentAuction);
    console.log('llega la puja?',bid.amount,'lo que hay',currentAuction.highestBid);


    if (currentAuction.highestBid < bid.amount && bid.amount > bid.product.price ) {
        currentAuction.highestBid = bid.amount
        const user = connectedUsersManager.getUser(socket.id)
        currentAuction.highestBidder = user  
        console.log('oferta mayor');
        
        io.emit('newBid',currentAuction)
    }

   })

   socket.on('whoAmI', (cb) => {
        const user = connectedUsersManager.getUser(socket.id)
        const {pass,...filtereduSer} = user
        cb({ user: filtereduSer ? filtereduSer : null, socketId: socket.id })

   })





}