const express = require('express');
const Event = require('../../models/event'); 
const LikeLog = require('../../models/like-log'); 
const catchErrors = require('../../lib/async-error');

const router = express.Router();

router.use(catchErrors(async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    next({status: 401, msg: 'Unauthorized'});
  }
}));

router.use('/event', require('./event'));

// Like for Event
router.post('/event/:id/enter', catchErrors(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next({status: 404, msg: 'Not exist event'});
  }
  var likeLog = await LikeLog.findOne({author: req.user._id, event: event._id});
  if(likeLog){

    req.flash('danger','Already Entered!');
  }
  
  if (!likeLog) {
    event.numLikes++;
    await Promise.all([
      event.save(),
      LikeLog.create({author: req.user._id, event: event._id})
    ]);
  }
  return res.json(event);
}));

module.exports = router;