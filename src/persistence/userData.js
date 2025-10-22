// import {UserServices} from "../dao/mongo/userServices.js";
import {UserServices} from "../dao/mongo/userServices.js";

const user = new UserServices()

export const allUserPer = () => {
    return user.findAll()
}

export const createUserPer = async (us) => {
    return await user.createUser(us)
}

export const loginPer = async(email,pass) => {
    return await user.log(email,pass)
}

export const editProfilePer = async(id,dataEdit) => {
    return await user.editProfile(id,dataEdit)
}