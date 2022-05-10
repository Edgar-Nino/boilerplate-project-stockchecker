const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

chai.request(server)
  .delete('/api/stock-prices/')
  .end((err, res) => {
    
  })

suite('Functional Tests', function() {
  test('Viewing one stock: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
      .get('/api/stock-prices/')
      .query({ stock: 'GOOG' })
      .end((err, res) => {
        const body = res.body
        assert.equal(res.status, 200)
        assert.property(body, 'stockData')
        assert.property(body.stockData, 'price')
        assert.isFinite(body.stockData.price)
        assert.property(body.stockData, 'likes')
        assert.isFinite(body.stockData.likes)
        assert.equal(body.stockData.likes, 0)
        assert.property(body.stockData, 'stock')
        assert.equal(body.stockData.stock, 'GOOG')
        done()
      })
  })

  test('Viewing one stock and liking it: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
      .get('/api/stock-prices/')
      .query({ stock: 'GOOG', like: true })
      .end((err, res) => {
        const body = res.body
        assert.equal(res.status, 200)
        assert.property(body, 'stockData')
        assert.property(body.stockData, 'price')
        assert.isFinite(body.stockData.price)
        assert.property(body.stockData, 'likes')
        assert.isFinite(body.stockData.likes)
        assert.equal(body.stockData.likes, 1)
        assert.property(body.stockData, 'stock')
        assert.equal(body.stockData.stock, 'GOOG')
        done()
      })
  })
  
  test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
      .get('/api/stock-prices/')
      .query({ stock: 'GOOG', like: true })
      .end((err, res) => {
        const body = res.body
        assert.equal(res.status, 200)
        assert.property(body, 'stockData')
        assert.property(body.stockData, 'price')
        assert.isFinite(body.stockData.price)
        assert.property(body.stockData, 'likes')
        assert.isFinite(body.stockData.likes)
        assert.equal(body.stockData.likes, 1)
        assert.property(body.stockData, 'stock')
        assert.equal(body.stockData.stock, 'GOOG')
        done()
      })
  })

  test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
      .get('/api/stock-prices/')
      .query({ stock: ['GOOG','MSFT'] })
      .end((err, res) => {
        const body = res.body
        assert.equal(res.status, 200)
        assert.property(body, 'stockData')
        assert.isArray(body.stockData)
        assert.property(body.stockData[0], 'price')
        assert.isFinite(body.stockData[0].price)
        assert.property(body.stockData[0], 'rel_likes')
        assert.isFinite(body.stockData[0].rel_likes)
        assert.equal(body.stockData[0].rel_likes, 1)
        assert.property(body.stockData[0], 'stock')
        assert.equal(body.stockData[0].stock, 'GOOG')
        
        assert.property(body.stockData[1], 'price')
        assert.isFinite(body.stockData[1].price)
        assert.property(body.stockData[1], 'rel_likes')
        assert.isFinite(body.stockData[1].rel_likes)
        assert.equal(body.stockData[1].rel_likes, -1)
        assert.property(body.stockData[1], 'stock')
        assert.equal(body.stockData[1].stock, 'MSFT')
        done()
      })
  })

  test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
      .get('/api/stock-prices/')
      .query({ stock: ['GOOG','MSFT'], like: true })
      .end((err, res) => {
        const body = res.body
        assert.equal(res.status, 200)
        assert.property(body, 'stockData')
        assert.isArray(body.stockData)
        assert.property(body.stockData[0], 'price')
        assert.isFinite(body.stockData[0].price)
        assert.property(body.stockData[0], 'rel_likes')
        assert.isFinite(body.stockData[0].rel_likes)
        assert.equal(body.stockData[0].rel_likes, 0)
        assert.property(body.stockData[0], 'stock')
        assert.equal(body.stockData[0].stock, 'GOOG')
        
        assert.property(body.stockData[1], 'price')
        assert.isFinite(body.stockData[1].price)
        assert.property(body.stockData[1], 'rel_likes')
        assert.isFinite(body.stockData[1].rel_likes)
        assert.equal(body.stockData[1].rel_likes, 0)
        assert.property(body.stockData[1], 'stock')
        assert.equal(body.stockData[1].stock, 'MSFT')
        done()
      })
  })
});


//Viewing one stock: GET request to /api/stock-prices/
//Viewing one stock and liking it: GET request to /api/stock-prices/
//Viewing the same stock and liking it again: GET request to /api/stock-prices/
//Viewing two stocks: GET request to /api/stock-prices/
//Viewing two stocks and liking them: GET request to /api/stock-prices/