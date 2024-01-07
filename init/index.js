const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


main()
    .then(() => {
        console.log("Connected to 80");
    })
    .catch((err) => {
        console.log(err); 
    })

// to establish connection with mongoose database
async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");  // this is our url (we have given database name as wanderlust)
}

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: "65468a7697337fefa3f5bb3b"}))  // this will this new property to all the items of the array
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();
