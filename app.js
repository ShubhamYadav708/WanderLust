const express=require("express");
const app=express();
const mongoose=require("mongoose");
const listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js")

main().then(()=>{
    console.log("Database connection successfull");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
};

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// app.get("/testlisting",async (req,res)=>{
//     let sampleListing=new listing({
//         title:"Beautiful farmhouse",
//         discription:"On the mountains",
//         location:"Kashmir,J&K",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Testing was successful");
// })

// app.get("/",(req,res)=>{
//     res.send("route is working");
// });

//Index route
app.get("/listings",async (req,res)=>{
    // res.send("Route working successfully!!");
    let allListings=await listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//Create route
app.post("/listings",wrapAsync(async (req,res,next)=>{
    // let{title,description,price,location,country}=req.body;
    // const newListing=new listing({
    //     title:title,
    //     description:description,
    //     price:price,
    //     location:location,
    //     country:country
    // });
        const newListing = new listing(req.body.Listing);
        // res.send("working");
        await newListing.save()
        res.redirect("/listings");
}));

//new route
app.get("/listings/new",(req,res)=>{
    // res.send("route working");
    res.render("./listings/new.ejs");
})

//Show route
app.get("/listings/:id",async (req,res)=>{
    let{id}=req.params;
    const Listing=await listing.findById(id);
    //console.log(Listing);
    res.render("./listings/show.ejs",{Listing});
});

//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let{id}=req.params;
    const Listing=await listing.findById(id);
    res.render("./listings/edit.ejs",{Listing});
})

//update route
app.put("/listings/:id", async(req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect("/listings");
});

//delete route
app.delete("/listings/:id",async (req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

//Custom error handler
app.use((err,req,res,next)=>{
    res.send("Something went wrong");
})

app.listen(8080,()=>{
    console.log("app is running on port 8080");
});

