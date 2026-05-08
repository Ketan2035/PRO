import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

const connectDb=async()=>{
    try{
        await mongoose.connect("mongodb+srv://ketanrs59_db_user:ketan59@cluster0.fmplo3s.mongodb.net/?appName=Cluster0");
        console.log("Databse connected succesfully");
    }catch(error){
        console.error("DB Error:", error.message);
        process.exit(1);
    }
}

export default  connectDb;
