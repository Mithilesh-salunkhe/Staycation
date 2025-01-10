const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/staycation"

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{ //arrow function...
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner:'6768ce95f50f37657d1884d9'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB(); 