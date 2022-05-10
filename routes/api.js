'use strict';
const axios = require('axios');
const Stock = require('../models/stock')
const mongoose = require('mongoose')

module.exports = function(app) {
  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

  app.route('/api/stock-prices')
    .get(async function(req, res) {
      const { stock, like } = req.query
      const s = (Array.isArray(stock)) ? [...stock] : [stock]
      try {
        const values = await Promise.all(s.map(async(v,i)=>{
          const response = await axios.get(`http://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${v}/quote`)
          if (response.status !== 200) { res.json({ error: 'connection failed' }); return 'Error'}
          const { data } = response
          if (data == 'Invalid symbol') { res.json({ error: 'invalid symbol' }); return 'Error'}
          const symbol = data.symbol.toLowerCase()
          const ip = req.socket.remoteAddress || req.headers['x-forwarded-for'].split(',').shift()
          const addLike = (like === 'true' || like === true) ? { $addToSet: { ips: ip } } : []
          const result = await Stock.findOneAndUpdate({ name: symbol }, { $set: { name: symbol }, ...addLike }, { upsert: true, new: true }).exec()
          const likeCount = result.ips.length
          return { stock: data.symbol, price: data.latestPrice, likes: likeCount }
        }))

        if(values[0] == 'Error' || values[1] == 'Error')
        {
           return 
        }       
        if(values.length == 1)
        {
          res.json({ stockData: values[0] })
          return
        }else if(s.length == 2)
        {
          res.json({ stockData: [{ stock: values[0].stock, price: values[0].price, rel_likes: values[0].likes - values[1].likes },
                                 { stock: values[1].stock, price: values[1].price, rel_likes: values[1].likes - values[0].likes }]})
          return
        }
        
      } catch (e) {
        console.log(e)
      }

    })
    .delete(async (req,res)=>{
      try{
      await Stock.deleteMany({})
      res.json('delete succesfully')
      }catch(e){
        res.json({error:e})
      }
    });

};
