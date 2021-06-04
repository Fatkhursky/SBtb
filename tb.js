const { Telegraf } = require('telegraf')

const bot = new Telegraf('1776734572:AAG4NmUhQ22nR0CB-0jbKO9oAk5Fwn084zY')
bot.launch()
const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: '<1VH8FrgR9HGJdYE7ByVrgTaKWuIOxWK7Nw72vRAHyeR7wiGhqSVXmF6OHpmhJGL7>',
  APISECRET: '<********>'
})
 
const http = require('http');  

http.createServer(function (req, res) {   
  res.write("I'm alive");   
  res.end(); 
}).listen(8080)


  binance.websockets.bookTickers('SCBTC', (bookTickers) => {
    let {symbol:symbol, bestBid:bestBid, bestBidQty:bestBidQty, bestAsk:bestAsk, bestAskQty:bestAskQty} = bookTickers;

     if (symbol === 'SCBTC' && bestBid === '0.00000010' && bestBidQty <= '500000.00000000') {
      let displayDate = `SC Buy ${Math.round(bestBid*100000000)} Habis`  
      bot.telegram.sendMessage(797951802, displayDate)
    }

      if (symbol === 'SCBTC' && bestBid === '0.00000020' && bestBid * bestBidQty <= '10.00000000') {
      let displayDate = `SC Buy ${Math.round(bestBid*100000000)} < 10 BTC`  
      bot.telegram.sendMessage(797951802, displayDate)
    }
   })

  binance.websockets.bookTickers('TROYBTC', (bookTickers) => {
    let {symbol:symbol, bestBid:bestBid, bestBidQty:bestBidQty, bestAsk:bestAsk, bestAskQty:bestAskQty} = bookTickers;

    //  if (symbol === 'TROYBTC' && bestBid === '0.00000021' && bestBidQty >= '10000000000.00000000') {
    //   let displayDate = `TROY Buy ${Math.round(bestBid*100000000)} Alert`  
    //   bot.telegram.sendMessage(797951802, displayDate)
    // }

      if (symbol === 'TROYBTC' && bestBid === '0.00000025' && bestBid * bestBidQty <= '3.00000000') {
      let displayDate = `TROY Buy ${Math.round(bestBid*100000000)} < 3 BTC`  
      bot.telegram.sendMessage(797951802, displayDate)
    }
  })


  

  binance.websockets.aggTrades(['SCBTC', 'XVGBTC', 'TROYBTC'], (aggTrades) => {
    let {s:symbol, q:quantity, p:price, T:tradeTime} = aggTrades;
    
    if (symbol==="TROYBTC" && quantity>=200000.00000000) {
          
            let displayDate = `Troy | ${(quantity * 1).toLocaleString()} | ${price} TB`;
            console.log(displayDate);
            bot.telegram.sendMessage(797951802, displayDate)
    }

     if (symbol==="SCBTC" && quantity>=200000.00000000) {
          
             let displayDate = `SC | ${(quantity * 1).toLocaleString()} | ${price} TB`;
             console.log(displayDate);
             bot.telegram.sendMessage(797951802, displayDate)
     }
    })


    