const express = require('express');
const router = express.Router();
const Design = require('../models/design');
const Comment = require('../models/comment');
const middleware = require('../middleware')




// comments new
router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn, (req, res) => {
  // res.send("hi")
  Design.findById(req.params.id, (err, foundDesign) => {
    if (err) {
      res.redirect('/designs');
    } else {
      res.render('comments/new', { design: design });
    }
  });
});

// comments create
router.post('/designs/:id/comments', middleware.isLoggedIn, (req, res) => {
  //look up design using ID
  Design.findById(req.params.id, (err, design) => {
    if (err) {
      console.log(err);
      res.redirect('/designs');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {

          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();

          design.comments.push(comment);
          design.save();
          req.flash('success', "New Comment Added")
          res.redirect('/designs/' + design._id);
        }
      });
    }
  });
});

router.get('/designs/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect('back');
    } else {
      
      res.render('comments/edit', {
        comment: foundComment,
        design_id: req.params.id,
      });
    }
  });
});

router.put('/designs/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect('back');
      } else {
        req.flash('success', "Comment Edited")
        res.redirect('/designs/' + req.params.id);
      }
    }
  );
});

router.delete('/designs/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err, foundDesign) => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success', "Comment Deleted")
      res.redirect('/designs/'+ req.params.id);
    }
  });
});

module.exports = router;
