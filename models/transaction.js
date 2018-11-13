const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

const transactionSchema = new mongoose.Schema({
  date: Date,
  sender : {
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant'
  },
    name:{
      type: String
    }
},
  receiver: {
    merchantId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
    store: {
      type: String
    }
},
  amount: {
    type: Number,
    required: true
  }
});

transactionSchema.statics.lookup = function(userId, merchantId) {
  return this.findOne({
    'user._id': userId,
    'merchant._id': merchantId,
    'amount': amount
  });
}

const Transaction = mongoose.model('Transaction', transactionSchema);

function validateTransaction(transaction) {
  const schema = {
    userId: Joi.objectId().required(),
    merchantId: Joi.objectId().required(),
    amount:Joi.number().required()
  };

  return Joi.validate(transaction, schema);
}

exports.Transaction = Transaction; 
exports.validate = validateTransaction;