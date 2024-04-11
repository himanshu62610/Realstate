const slugify = require("slugify");
const { v4: uuidv4 } = require('uuid');
const {sendMail}=require("../helpers.js/email.js");
const Ad = require("../models/Ad.js");
const User=require( "../models/User.js");
const axios =require("axios");




function generateRandomId(length) {
  const uuid = uuidv4().replace(/-/g, ''); 
  return uuid.substr(0, length); 
}

async function fetchCityCoordinates(city) {
  try {
    const osmGeocodingEndpoint = 'https:
    const osmResponse = await axios.get(osmGeocodingEndpoint, {
      params: {
        q: city,
        format: 'json',
      },
    });

    
    const firstResult = osmResponse.data[0];

    
    const latitude = firstResult?.lat || 28.6139; 
    const longitude = firstResult?.lon || 77.2090; 

    return { latitude, longitude };
  } catch (error) {
    console.error('Error fetching OSM data:', error);
    throw error;
  }
}

async function fetchAddressCoordinates(address){
  try{
    
  const osmGeocodingEndpoint = 'https:
  const osmResponse = await axios.get(osmGeocodingEndpoint, {
    params: {
      q: address,
      format: 'json',
    },
  });

  
  const latitude = osmResponse.data[0]?.lat;
  const longitude = osmResponse.data[0]?.lon;
  
  return { latitude, longitude };
}
  catch(error){
    console.error('Error fetching OSM data:', error);
    throw error;
  }
}


async function fetchCoordinates(address,city){
  try{
    
    const coordinates=await fetchAddressCoordinates(address);
    let latitude=coordinates.latitude;
    let longitude=coordinates.longitude;
  
    if (latitude === undefined || longitude === undefined) {
      
      const cityCoordinates = await fetchCityCoordinates(city);
    
  
      
     
  
      
  
        latitude = cityCoordinates.latitude;
        longitude = cityCoordinates.longitude;

  return { latitude, longitude };
    }
}
  catch(error){
    console.error('Error fetching OSM data:', error);
    throw error;
  }
}


exports.create = async (req, res) => {
try {
  console.log(req.body);
  const { photos, description, city, address, price, type, landsize } = req.body;

  /*if (!photos?.length) {
    return res.json({ error: "Photos are required" });
  }*/
  if (!address) {
    return res.json({ error: "Address is required" });
  }
  if (!price) {
    return res.json({ error: "Price is required" });
  }
  if (!type) {
    return res.json({ error: "Is property a house or land?" });
  }
  if (!description) {
    return res.json({ error: "Description is required" });
  }
  
 
  const coordinates=await fetchAddressCoordinates(address);

  let latitude=coordinates.latitude;
  let longitude=coordinates.longitude;

  console.log(latitude,longitude);
  if (latitude === undefined || longitude === undefined) {
    
    const cityCoordinates = await fetchCityCoordinates(city);
  

    
   

    

      latitude = cityCoordinates.latitude;
      longitude = cityCoordinates.longitude;
  }
  const ad = await new Ad({
    ...req.body,
    postedBy: req.user._id,
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    slug: slugify(`${type}-${address}-${price}-${generateRandomId(6)}`),
  }).save();

  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { role: "Seller" },
    },
    { new: true }
  );

  user.password = undefined;
  user.resetCode = undefined;

  res.json({
    ad,
    user,
  });
} catch (err) {
  res.json({ error: "Something went wrong. Try again." });
  console.log(err);
}
}


exports.ads = async (req, res) => {
  try {
    const adsForSell = await Ad.find({ action: "Sell" })
      .select(" -photo.Key -photo.key -photo.ETag")
      .sort({ createdAt: -1 })
      .limit(12);

    const adsForRent = await Ad.find({ action: "Rent" })
      .select("-photo.Key -photo.key -photo.ETag")
      .sort({ createdAt: -1 })
      .limit(12);

    res.json({ adsForSell, adsForRent });
  } catch (err) {
    console.log(err);
  }
};


exports.read = async (req, res) => {
  try {
    const ad = await Ad.findOne({ slug: req.params.slug }).populate(
      "postedBy",
      "name username email phone company photo.Location"
    );

    
    const related = await Ad.find({
      _id: { $ne: ad._id },
      action: ad.action,
      type: ad.type,
      /*address: {
        $regex: ad.googleMap[0].city,
        $options: "i",
      },*/
    })
      .limit(3)
      .select("-photos.Key -photos.key -photos.ETag -photos.Bucket -googleMap");

    res.json({ ad,related});
  } catch (err) {
    console.log(err);
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { wishlist: req.body.adId },
      },
      { new: true }
    );

    const { password, resetCode, ...rest } = user._doc;

     console.log("added to wishlist => ", rest);

    res.json(rest);
  } catch (err) {
    console.log(err);
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: req.params.adId },
      },
      { new: true }
    );

    const { password, resetCode, ...rest } = user._doc;
     console.log("remove from wishlist => ", rest);

    res.json(rest);
  } catch (err) {
    console.log(err);
  }
};



exports.contactSeller = async (req, res) => {
  try {
    const { name, email, message, phone, adId } = req.body;
    const ad = await Ad.findById(adId).populate("postedBy", "email");
    console.log(message);
    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enquiredProperties: adId },
    });

    if (!user) {
      return res.json({ error: "Could not find user with that email" });
    } else {
      const content=
      `<p>You have received a new customer enquiry</p>
  
      <h4>Customer details</h4>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Phone: ${phone}</p>
      <p>Message: ${message}</p>
  
    <a href="${process.env.CLIENT_URL}/ad/${ad.slug}">${ad.type} in ${ad.address} for ${ad.action} ${ad.price}</a>
    `
      sendMail(email,adId,"New  enquiry received",content)
      return res.json({ ok: true });
    } 
    }
    catch (err) {
      console.log(err);
  }
}

exports.userAds = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;

    const total = await Ad.find({ postedBy: req.user._id });

    const ads = await Ad.find({ postedBy: req.user._id })
      .populate("postedBy", "name email username phone company")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.json({ ads, total: total.length });
  } catch (err) {
    console.log(err);
  }
};

exports.update = async (req, res) => {
  try {
    const { photos, price, type, address, description } = req.body;

    const ad = await Ad.findById(req.params._id);
    
    const owner = req.user._id == ad?.postedBy;

    if (!owner) {
      return res.json({ error: "Permission denied" });
    } else {
      
      if (!photos.length) {
        return res.json({ error: "Photos are required" });
      }
      if (!price) {
        return res.json({ error: "Price is required" });
      }
      if (!type) {
        return res.json({ error: "Is property hour or land?" });
      }
      if (!address) {
        return res.json({ error: "Address is required" });
      }
      if (!description) {
        return res.json({ error: "Description is required" });
      }

      

    const coordinates=await fetchAddressCoordinates(address);
  let latitude=coordinates.latitude;
  let longitude=coordinates.longitude;

  if (latitude === undefined || longitude === undefined) {
    
    const cityCoordinates = await fetchCityCoordinates('New Delhi');

      latitude = cityCoordinates.latitude;
      longitude = cityCoordinates.longitude;
  }

      
      await Ad.findOneAndUpdate(
        { _id: req.params._id, postedBy: req.user._id },
        {
          ...req.body,
          slug: ad.slug,
          location: {
            type: "Point",
            coordinates: [longitude,latitude],
          },
        }
      );

      res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.remove = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params._id);
    const owner = req.user._id == ad?.postedBy;

    if (!owner) {
      return res.json({ error: "Permission denied" });
    } else {
      await Ad.findByIdAndRemove(ad._id);
      res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
  }
};


exports.enquiriedProperties = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const ads = await Ad.find({ _id: user.enquiredProperties }).sort({
      createdAt: -1,
    });
    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

exports.wishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const ads = await Ad.find({ _id: user.wishlist }).sort({
      createdAt: -1,
    });
    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};


exports.adsForSell = async (req, res) => {
  try {
    const ads = await Ad.find({ action: "Sell" })
      .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
      .sort({ createdAt: -1 })
      .limit(24);

    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

exports.adsForRent = async (req, res) => {
  try {
    const ads = await Ad.find({ action: "Rent" })
      .select("-googleMap -location -photo.Key -photo.key -photo.ETag")
      .sort({ createdAt: -1 })
      .limit(24);

    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};


exports.search = async (req, res) => {
  try {
    
    const { action, address, type, priceRange } = req.query;

    
  const coordinates=await fetchAddressCoordinates(address);
    
  let latitude=coordinates.latitude;
  let longitude=coordinates.longitude;

  if (latitude === undefined || longitude === undefined) {
    
    const cityCoordinates = await fetchCityCoordinates('New Delhi');

      latitude = cityCoordinates.latitude;
      longitude = cityCoordinates.longitude;
  }

    console.log(longitude,latitude);

    const ads = await Ad.find({
      action: action === "Buy" ? "Sell" : "Rent",
      type,
      price: {
        $gte: parseInt(priceRange[0]),
        $lte: parseInt(priceRange[1]),
      },
      

       location: {
         $near: {
           $maxDistance: 500000, 
           $geometry: {
             type: "point",
             coordinates: [longitude,latitude],
           },
         },
       },
    })
      .limit(24)
      .sort({ createdAt: -1 })
      .select(
        "-photos.key -photos.Key -photos.ETag -photos.Bucket -location -googleMap"
      );

      if (ads.length === 0) {
        
        console.log('hello world');
        return res.status(204).json({ message: 'No content' });
      }

     console.log("hello");
    res.json(ads);
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



