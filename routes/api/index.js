const express = require('express');
const Event = require('../../models/event'); 
const User = require('../../models/user');
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
  var user = await User.findById(req.user._id);
  if(likeLog){

    req.flash('danger','Already Entered!');
  }
  
  if (!likeLog) {
    await Promise.all([
      event.save(),
      LikeLog.create({author: req.user._id, event: event._id, name: user.name})
    ]);
  }
  return res.json(event);
}));

module.exports = router;