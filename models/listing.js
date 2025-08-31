const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        filename:String,
        url: {
        type: String,
        default:"https://media.istockphoto.com/id/1396856251/photo/colonial-house.jpg?s=612x612&w=0&k=20&c=_tGiix_HTQkJj2piTsilMuVef9v2nUwEkSC9Alo89BM=",
        set: (v) =>
            v === " "
                ? "https://media.istockphoto.com/id/1396856251/photo/colonial-house.jpg?s=612x612&w=0&k=20&c=_tGiix_HTQkJj2piTsilMuVef9v2nUwEkSC9Alo89BM="
                : v
        }
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },

    location:String,
    country:String
});

const listing=mongoose.model("listing",listingSchema);

module.exports=listing;