const {Transaction, validate} = require('../models/transaction'); 
const {User} = require('../models/user');
const {Merchant} = require ('../models/merchant');
const auth = require('../middleware/auth');
const decoder = require('jwt-decode');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/test', async (req,res)=>{
  res.send({message: 'Success'})
})

router.get('/mytransaction', auth, async (req,res)=>{
  const userId = req.body.userId;
  const merchantId = req.body.merchantId;
  const history = Transaction.lookup(userId,merchantId);
  res.send(history);

})

router.get('/', auth, async (req, res) => {
  const token = req.header('x-auth-token');
  const userId = decoder(token);
  const transactions = await Transaction.find({'sender.userId':{userId, type: String}})
  .sort(_id);
  res.send(transactions);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send('Invalid user.');

  const merchant = await Merchant.findById(req.body.merchantId);
  if (!merchant) return res.status(400).send('Invalid merchant.');

  const amount = req.body.amount;

  if (user.point < amount) return res.status(400).send('Invalid Balance');

  let transaction = new Transaction({
    date:  Date(),
    sender: {
      userId: user._id,
      name: user.name
    },
    receiver: {
      merchantId: merchant._id,
      store: merchant.store_name
    },
    amount: amount
  });

  try {
    new Fawn.Task()
      .save('transactions', transaction)
      .update('users', {_id:user._id},{
        $inc: { point: - amount}
      })
      .update('merchants', {_id:merchant._id}, {
        $inc: {point: + amount}
      })
      .run();
  
    res.send(transaction);
  }
  catch(ex) {
    res.status(500).send('Something failed --- OMG!.');
  }
});

router.get('/:id', async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) return res.status(404).send('The transaction not found.');

  res.send(transaction);
});

module.exports = router; 