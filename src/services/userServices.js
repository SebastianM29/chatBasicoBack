
import { allUserPer,createUserPer, deleteUserPer, editProfilePer, loginPer  } from "../persistence/userData.js"


export const allUserSer = () =>  {
    
    return allUserPer()
}

export const createUserSer = async (user) => {
    return await createUserPer(user)
}

export const loginSer = async(email,pass) => {
        return loginPer(email,pass)
}

export const editProfileSer = async(id,dataEdit) => {
return await editProfilePer(id,dataEdit)
}

export const deleteUserSer = async(id) => {
    return await deleteUserPer(id)
}