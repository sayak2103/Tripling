const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    const listings=await Listing.find({});
    res.render("listings/home.ejs",{listings});
}

module.exports.newListingFormRender=(req,res)=>{
    res.render("listings/newListing.ejs");
}

module.exports.postNewListing=async(req,res,next)=>{
    let {listing,category}=req.body;
    let filename,url;
    if(req.file){
        filename= req.file.filename;
        url=req.file.path;
    }
    else{
        filename="listingImage";
        url="";
    }
    let newCategory=[];
    for(const property in category){
        if(property)
            newCategory.push(`${property}`);
    }
    const newListing=new Listing({
        title: listing.title,
        description: listing.description,
        location: listing.location,
        country: listing.country,
        image: {
            url: url,
            filename: filename,
        },
        price: listing.price,
    });
    newListing.owner=req.user._id;
    newListing.category=newCategory;
    newListing.save()
    .then(()=>{
        req.flash("success","New listing was created");
        res.redirect('/listings');
    })
    .catch((err)=>{
        console.log("controller error");
        next(err);
    });
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(`${id}`).populate({path: "reviews",populate: {path :"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    else
    res.render("listings/show.ejs",{listing});
}

module.exports.editListingformRender=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(`${id}`);
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    else{
        let imageUrl= listing.image.url.replace("upload/","upload/c_scale,h_100,w_100/");
        res.render("listings/editForm.ejs",{listing,imageUrl});
    }
}

module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    let {title,description,location,country,price}=req.body;
    let {image}=await Listing.findById(`${id}`);
    let url;
    if(req.file){
        url=req.file.path;
    }
    else{
        url=image.url;
    }
    await Listing.findByIdAndUpdate(`${id}`,{
        title: title,
        description: description,
        location: location,
        country: country,
        price: price,
        $set: {'image.url': url},
    })
    .then(()=>{
        req.flash("success","Listing updated!");
        res.redirect(`/listings/${id}`);
    });
}

module.exports.searchListing=async(req,res)=>{
    let allListing=await Listing.find({});
    let {searchQuery}=req.query;
    searchQuery=searchQuery.toLowerCase();
    let listings=[];
    let ttle=[];
    let descp=[];
    let loc=[];
    let cntry=[];
    let catg=[];
    for(item of allListing){
        if(item.title.toLowerCase().indexOf(searchQuery)>=0){
            ttle.push(item);
        }
        else if(item.description.toLowerCase().indexOf(searchQuery)>=0){
            descp.push(item);
        }
        else if(item.location.toLowerCase().indexOf(searchQuery)>=0){
            loc.push(item);
        }
        else if(item.country.toLowerCase().indexOf(searchQuery)>=0){
            cntry.push(item);
        }
        else {
            for(filter of item.category){
                if(filter.toLowerCase().indexOf(searchQuery)>=0)
                catg.push(item);
            }
        }
    }
    listings=ttle.concat(descp,loc,cntry,catg);
    if(listings.length>0)
    res.render("listings/home.ejs",{listings});
    else{
        req.flash("error","No related items found! ");
        res.redirect("/listings");
    }
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(`${id}`)
    .then(()=>{
        req.flash("success","Listing deleted!");
        res.redirect("/listings");
    });
}