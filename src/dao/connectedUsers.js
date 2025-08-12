class ConnectedUsers {
    constructor() {
        this.users = new Map();
        
    }
    addUser(socketId,user) {
        console.log(`Aca veo el id ${socketId} , y el dato del usuario ${user}`);
        
        for (const element of this.users.values()) {
            
            if (element.email === user.email) {
                return {
                    error:true,
                    msg:'Existe un usuario conectado con ese mail'
                }
            }
            
        }
        
        this.users.set(socketId, user);
        return {
            error: false,
        }

    }

    removeUser(socketId) {
        this.users.delete(socketId);
    }

    getUser(socketId) {
        return this.users.get(socketId)
    }

    getUsers() {
        return Array.from(this.users.values());
    }
}

export const connectedUsersManager = new ConnectedUsers()