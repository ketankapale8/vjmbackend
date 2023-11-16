import mongoose from "mongoose";
mongoose.set('strictQuery', false)

export const connectDatabase = async () =>{
    try{
        const {connection} = await mongoose.connect(process.env.MONGOURI || "mongodb://127.0.0.1:27017");
        console.log(`MongoDB Connected : ${connection.host}`)
        
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}