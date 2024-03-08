const mongoose=require("mongoose");
const Listing=require("../models/listing");
const {data}=require("./data");

const MONGO_URL="mongodb://127.0.0.1:27017/tripling";
async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

let initialize=async ()=>{
    await Listing.deleteMany({});
    let newdata=data.map((obj)=>({
        ...obj,
        owner: '65c73fce67ef1c409429ba33',
    }));
    await Listing.insertMany(newdata);
}

initialize().then(()=>{
    console.log("Initialisation successfull");
})
.catch((err)=>{
    console.log(err);
});