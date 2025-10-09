import bcrypt from "bcrypt";

export const createHash = async(password) => {
    return await bcrypt.hashSync(password,bcrypt.genSaltSync(10))

}


export const compare = async (password,pass)  => { 
     console.log('mostrame el hash lo q viene de compare',password,pass);
     
    
    return await bcrypt.compare(password,pass)
}