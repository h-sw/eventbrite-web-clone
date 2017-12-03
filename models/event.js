const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {type: String, trim: true, required: true},
  location: {type: String, trim: true, required: true},
  start: {
    date:{type:String, required:true, trim: true},
    time:{type:String, required:true, trim: true},
  },
  end: {
    date:{type:String, required:true, trim: true},
    time:{type:String, required:true, trim: true},
  },
  contents:{type:String, required:true, trim: true},
  organization: {type: String, trim: true, required: true},
  organInfo: {type: String, trim: true, required: true},
  numLikes: {type: Number, default: 0},
  numAnswers: {type: Number, default: 0},
  numReads: {type: Number, default: 0},
  price: {type:Number, default: 0},
  createdAt: {type: Date, default: Date.now},
  type: {type: String, required: true},
  topic: {type: String, required: true}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);
var Event = mongoose.model('Event', schema);

module.exports = Event;
