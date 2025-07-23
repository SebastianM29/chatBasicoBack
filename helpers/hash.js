import bcrypt from "bcrypt";

export const createHash = async(password) => {
    return await bcrypt.hashSync(password,bcrypt.genSaltSync(10))

}


export const compare = async (password,user)  => { 
    console.log(user,password);
    
    return await bcrypt.compare(password,user.pass)
}