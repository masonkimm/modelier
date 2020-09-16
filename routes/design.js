const express = require('express');
const router = express.Router();
const Deisgn = require('../models/design');
const Comment = require('../models/comment');
const { route } = require('./comments');
const middleware = require('../middleware');
const nodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
const geocoder = nodeGeocoder(options);

//index route
router.get('/designs', (req, res) => {
  // get all campgrounds from db
  Design.find({}, (err, allDesigns) =>{
    if (err) {
      console.log('error occured');
      console.log(err);
    } else {
      res.render('designs/index', {
        designs: allDesigns,
        currentUser: req.user,
      });
    }
  });
});

//show new designs form
router.get('/designs/new', middleware.isLoggedIn, (req, res) => {
  res.render('designs/new');
});


//creating new campground to db
router.post('/designs', middleware.isLoggedIn, (req, res) => {
  const name = req.body.name;
  const price = req.body.price;
  const image = req.body.image;
  const desc = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  

  geocoder.geocode(req.body.location, (err, data) =>{
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newDesign = {name: name, image: image, description: desc, author:author, price: price, location: location, lat: lat, lng: lng};
    // Create a new design and save to DB
    Campground.create(newDesign, (err, newlyCreated)=>{
        if(err){
            console.log(err);
        } else {
            //redirect back to designs page
            console.log(newlyCreated);
            res.redirect("/designs");
        }
    });
  });

});

//SHOW - shows more info about one designs
router.get('/designs/:id', (req, res) => {
  // find the design with provided ID
  Design.findById(req.params.id)
    .populate('comments')
    .exec((err, foundDesign) =>{
      if (err) {
        console.log(err);
      } else {
        
        // render show template with that design
        res.render('designs/show', { design: foundDesign });
      }
    });
});

//Edit DESIGN
router.get('/designs/:id/edit', middleware.checkDesignOwnership, (req, res) => {
  //is user logged in
  Design.findById(req.params.id, (err, foundDesign) => {
    res.render('designs/edit', { design: foundDesign });
  });
});


// UPDATE DESIGN ROUTE
router.put('/designs/:id', (req, res)=>{
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.design.lat = data[0].latitude;
    req.body.design.lng = data[0].longitude;
    req.body.design.location = data[0].formattedAddress;

    Design.findByIdAndUpdate(req.params.id, req.body.design, (err, design)=>{
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/designs/" + design._id);
        }
    });
  });
});

router.delete('/designs/:id', middleware.checkDesignOwnership, (req, res) => {
  Design.findByIdAndRemove(req.params.id, (err, foundDesign) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/designs');
    }
  });
});


module.exports = router;
