import { allUserPer, createUserPer, loginPer } from "../persistence/userData.js"


export const allUserSer = () =>  {
    return allUserPer()
}

export const createUserSer = async (user) => {
    return await createUserPer(user)
}

export const loginSer = async(email,pass) => {
        return loginPer(email,pass)
}