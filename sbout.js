const { Telegraf } = require('telegraf')

const bot = new Telegraf('1776734572:AAG4NmUhQ22nR0CB-0jbKO9oAk5Fwn084zY')
bot.launch()
const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: '<1VH8FrgR9HGJdYE7ByVrgTaKWuIOxWK7Nw72vRAHyeR7wiGhqSVXmF6OHpmhJGL7>',
  APISECRET: '<********>'
})

  binance.websockets.bookTickers('TROYBTC', (bookTickers) => {
    let {
    symbol:symbol,
    bestBid:bestBid,
    bestBidQty:bestBidQty,
    bestAsk:bestAsk,
    bestAskQty:bestAskQty} = bookTickers;
    if (symbol === 'TROYBTC' && bestBid === '0.00000026') {
      let displayDate = `TROY ${(bestBid*100000000)+ 1} Buy habis`
      bot.telegram.sendMessage(797951802, displayDate)
    }
  })

  binance.websockets.aggTrades(['SCBTC', 'XVGBTC', 'TROYBTC'], (aggTrades) => {
    let {s:symbol, q:quantity, T:tradeTime} = aggTrades;
        
        if (symbol==="TROYBTC" && quantity>=200000.00000000) {
          function formatAMPM(date) { // This is to display 12 hour format like you asked
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            seconds = seconds < 10 ? '0'+seconds : seconds;
            let strTime = hours + ':' + minutes +  ':' + seconds + ' ' + ampm;
            return strTime;
          }
    
            let myDate = new Date(tradeTime);
            let displayDate = symbol+": " +(quantity * 1).toLocaleString()+': '+formatAMPM(myDate);
            console.log(displayDate);
            bot.telegram.sendMessage(797951802, displayDate)
    }
    })

    