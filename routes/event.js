const express = require('express');
var Event = require('../models/event');
var User = require('../models/user')

const catchErrors = require('../lib/async-error');

const router = express.Router();

// 동일한 코드가 users.js에도 있습니다. 이것은 나중에 수정합시다.
function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

/* GET event listing. */
router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}},
    ]};
  }
  const events = await Event.paginate(query, {
    sort: {createdAt: -1}, 
    populate: 'author', 
    page: page, limit: limit
  });
  res.render('event/index', {events: events, term: term, query: req.query});
}));

router.get('/new', needAuth, (req, res, next) => {
  res.render('event/new', {event: {}});
});

router.get('/:id', needAuth, catchErrors(async (req,res,next)=> {
  req.flash("what the fuck?");
  const event = await Event.findById(req.params.id);
  res.render('event/show', {event: event});
}));

router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  res.render('event/edit', {event: event});
}));


router.post('/:id', needAuth, catchErrors(async (req, res, next) => {
  event = new Event({
    author: req.user.id,
    title: req.body.title,
    location: req.body.location,
    contents: req.body.contents,
    organization: req.body.organization,
    organInfo: req.body.organInfo,
 
  });

  event.start.date = req.body.start_date,
  event.start.time = req.body.start_time,
  event.end.date = req.body.end_date,
  event.end.time = req.body.end_time
  
  await event.save();
  req.flash('success', 'Successfully posted');
  res.redirect(`/event/${req.params.id}`);
}));

router.delete('/:id', needAuth, catchErrors(async (req, res, next) => {
  await Event.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/event');
}));

module.exports = router;
