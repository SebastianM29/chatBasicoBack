import { config } from "dotenv";
config()
 


export default  {
mongoURL : process.env.MONGOURL,
mongoURLSession : process.env.MONGOURLSESSION,
sessionKey: process.env.SECRETKEYSESSION



}