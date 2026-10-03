const Listing = require("../models/listing.js");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); 


module.exports.index= async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});    
};

module.exports.renderNewForm= (req,res)=>{
  // if(!req.isAuthenticated){
  //   req.flash("error","You must be logged in to create listing!");
  //   return res.redirect("/listings");
  // }
  res.render("listings/new.ejs");
};


module.exports.showListing=(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({path: "reviews", populate:{path:"author",},})
  .populate("owner");
  if(!listing){
    req.flash("error"," Listing you requested for does not exist!");
    return res.redirect("/listings");  
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
});


module.exports.createListing=(async (req, res) => {
  let response= await geocodingClient.forwardGeocode({
  query:req.body.listing.location,
  limit: 1
})
  .send()

    //let{title,description,country,location,price,image}=req.body
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //   throw new ExpressError(400,result.error);
    // }
      const newListing = new Listing(req.body.listing);
      newListing.owner=req.user._id;

    if(req.file){
      let url=req.file.path;
      let filename=req.file.filename;
      newListing.image={url,filename};
}
      newListing.geometry=response.body.features[0].geometry;
      let savedListing= await newListing.save();
      console.log(savedListing);  
      req.flash("success","New Listing Created!");
      res.redirect("/listings");
    });


module.exports.renderEditForm=( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
    req.flash("error"," Listing you requested for does not exist!");
    return res.redirect("/listings");  
  }
  let originaImageUrl=listing.image.url;
  originaImageUrl=originaImageUrl.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs", { listing , originaImageUrl});
});



module.exports.updateListing=(async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  // Update text/details
  Object.assign(listing, req.body.listing);

  let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    if (response.body.features.length > 0) {
        listing.geometry = response.body.features[0].geometry;
    }

  // Update image only if a new image was uploaded
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };
  }

  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
//  let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });

//   if(typeof req.file!=="undefined"){
//   let url=req.file.path;
//   let filename=req.file.filename;
//   listing.image={url,filename};
//   await listing.save();
//   }

//   req.flash("success","Listings Updated!");
//   res.redirect(`/listings/${id}`);
});


module.exports.destroyListings=(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","Listing Deleted!");
  res.redirect("/listings");
});
