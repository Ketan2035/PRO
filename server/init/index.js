import mongoose from "mongoose"
import initdata from "./data.js"
import customerUser from "../models/customer.js";
import proUser from "../models/professional.js";



main()
  .then((res) => {
    console.log("connection succesfull");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb+srv://ketanrs59_db_user:rSfBPWqG4dK4F3xb@cluster0.fmplo3s.mongodb.net/");
}

const initDB = async () => {
  initdata.data = initdata.data.map((obj) => ({
    ...obj
  }));
  await customerUser.insertMany(initdata.data);
  console.log("data was initilized");
};

initDB();
