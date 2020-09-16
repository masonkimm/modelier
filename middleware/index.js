// middleware page
const Design = require('../models/design')
const Comment = require('../models/comment')

const middlewareObj = {};

middlewareObj.checkDesignOwnership = (req, res, next) => {
  //is user logged in
  if (req.isAuthenticated()) {
    // find user's design
    Design.findById(req.params.id, (err, foundDesign) => {
      if (err) {
        req.flash('error', 'Deisgn not found')
        console.log(err);
      } else {
        if (foundDesign.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'Access Denied')
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Login Required')
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  //is user logged in
  if (req.isAuthenticated()) {
    // find user's Comment
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'Access Denied')
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Login Required')
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Login Required")
  res.redirect('/login');
};

module.exports = middlewareObj;
