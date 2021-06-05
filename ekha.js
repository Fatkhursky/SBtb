const { Telegraf } = require('telegraf')
const axios = require('axios')

const bot = new Telegraf('1776734572:AAG4NmUhQ22nR0CB-0jbKO9oAk5Fwn084zY')

// bot.telegram.sendMessage(953800119, 'halogess')

const getData_binance = async () => {
  const { data: data_binance } = await axios.get('https://api.binance.com/api/v3/ticker/price')
  const { data: data_bithumb } = await axios.get('https://api.bithumb.com/public/ticker/ALL')
  const { data: data_indodax } = await axios.get('https://indodax.com/api/summaries')
  const { data: data_huobi } = await axios.get('https://api.huobi.pro/market/tickers')

  let SCUSDT, BTCUSDT, XVGETH, ETHBTC, STMXUSDT

  data_binance.forEach((v) => {
    if (v.symbol === 'SCUSDT') return (SCUSDT = v.price)
    if (v.symbol === 'BTCUSDT') return (BTCUSDT = v.price)
    if (v.symbol === 'XVGETH') return (XVGETH = v.price)
    if (v.symbol === 'ETHBTC') return (ETHBTC = v.price)
    if (v.symbol === 'TROYUSDT') return (TROYUSDT = v.price)
    if (v.symbol === 'STMXUSDT') return (STMXUSDT = v.price)
  })

  let AOA = data_bithumb.data.AOA.closing_price
  let BTC = data_bithumb.data.BTC.closing_price
  
  let btc_idr = {
    last: data_indodax.tickers.btc_idr.last,
    buy: data_indodax.tickers.btc_idr.buy,
    sell: data_indodax.tickers.btc_idr.sell,
  }
  let aoa_idr = {
    last: data_indodax.tickers.aoa_idr.last,
    buy: data_indodax.tickers.aoa_idr.buy,
    sell: data_indodax.tickers.aoa_idr.sell,
  }

  let usdt_idr = {
    last: data_indodax.tickers.usdt_idr.last,
    buy: data_indodax.tickers.usdt_idr.buy,
    sell: data_indodax.tickers.usdt_idr.sell,
  }
  let vidy_idr = {
    last: data_indodax.tickers.vidy_idr.last,
    buy: data_indodax.tickers.vidy_idr.buy,
    sell: data_indodax.tickers.vidy_idr.sell,
  }
  
  let VIDYUSDT

  data_huobi.data.forEach((v) => {
    if (v.symbol === 'vidyusdt') return (VIDYUSDT = v.close )
  })
  
  /*let VIDYIDR 
  if (vidy_idr.buy / usdt_idr.last > VIDYUSDT) {
     return (VIDYIDR = `<${vidy_idr.buy / usdt_idr.last}`)
   }
  if (vidy_idr.sell / usdt_idr.last < VIDYUSDT) {
     return (VIDYIDR `>${vidy_idr.sell / usdt_idr.last}`)
  } */  

  return `Binance:
SC/USDT       : ${+SCUSDT}
BTC/USDT     : ${+BTCUSDT}
XVG/ETH       : ${+XVGETH}
ETH/BTC       : ${+ETHBTC}

Result:
SC : ${(SCUSDT / BTCUSDT*100000000).toFixed(2)}   XVG : ${(XVGETH * ETHBTC*100000000).toFixed(2)}   TROY  : ${(TROYUSDT / BTCUSDT*100000000).toFixed(2)}
STMX  : ${(STMXUSDT / BTCUSDT*100000000).toFixed(2)}

Indodax-Bithumb:
AOA/KRW : ${(AOA).replace(".", ",")}
BTC/KRW : ${(BTC).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
AOA/IDR : ${+aoa_idr.buy}     ${+aoa_idr.sell}
BTC/IDR : ${(btc_idr.last).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
USDT/IDR : ${(usdt_idr.last).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
VIDY/IDR : ${+vidy_idr.buy}     ${+vidy_idr.sell}
VIDY/USDT : ${((VIDYUSDT)*1000000).toFixed()}

Result:
VIDY  ${((vidy_idr.buy / usdt_idr.last)*1000000).toFixed()}   ${((vidy_idr.sell / usdt_idr.last)*1000000).toFixed()}    AOA  ${(((((0.3 * BTC * 0.9975) / AOA) * 0.9975 - 80) * aoa_idr.buy * 0.997) / btc_idr.last - 0.0005).toFixed(3)}   ${(((((((250000000 / aoa_idr.sell) * 0.997 - 3000) * AOA * 0.9975) / BTC) * 0.9975 - 0.001) * btc_idr.last) / 1000000).toFixed()}
`
//VIDYIDR : ${+VIDYIDR}

}

bot.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const response_time = new Date() - start
  const chat_from = `${ctx.message.chat.first_name} (id: ${ctx.message.chat.id})`
  console.log(`Chat from ${chat_from} (Response Time: ${response_time})`)
})

bot.hears('p', async (ctx) => {
  if (ctx.message.chat.id == 797951802 || 953800119) {
  ctx.reply('please wait...')
  const binance = await getData_binance()
  ctx.reply(binance)
  loop = setInterval(async function () {
    const binance = await getData_binance()
    ctx.reply(binance)    
  }, 15000)
bot.hears ('s', async (ctx) => {
  if (ctx.message.chat.id == 797951802 || 953800119) {
  clearInterval (loop)
  }
})
}
  else {
    ctx.reply(`You're not registered yet, Contact @Fatkhu to register`)
  } 
})

bot.launch()
