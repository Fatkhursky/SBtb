const { Telegraf } = require('telegraf')
const axios = require('axios')

const bot = new Telegraf('1602364957:AAEqr5kmk-6qZ4RW4zSuvj7iTzJZ7JMDH5Y')

const getData = async () => {
  const { data } = await axios.get('https://api.binance.com/api/v3/ticker/price')

  let SCUSDT, BTCUSDT, XVGETH, ETHBTC, STMXUSDT, TROYUSDT

  data.forEach((v) => {
    if (v.symbol === 'SCUSDT') return (SCUSDT = v.price)
    if (v.symbol === 'BTCUSDT') return (BTCUSDT = v.price)
    if (v.symbol === 'XVGETH') return (XVGETH = v.price)
    if (v.symbol === 'ETHBTC') return (ETHBTC = v.price)
    if (v.symbol === 'STMXUSDT') return (STMXUSDT = v.price)
    if (v.symbol === 'TROYUSDT') return (TROYUSDT = v.price)
  })

  //return //Price:
//SC/USDT       : ${+SCUSDT}
//BTC/USDT     : ${+BTCUSDT}
//XVG/ETH       : ${+XVGETH}
//ETH/BTC       : ${+ETHBTC}
//STMX/USDT : ${+STMXUSDT}

 return `
 XVG: ${(XVGETH * ETHBTC*100000000).toFixed(2)}   SC: ${(SCUSDT / BTCUSDT*100000000).toFixed(2)}
 
 SCUSDT: ${(SCUSDT)}
 BTCUSDT: ${(BTCUSDT)}
 XVGETH: ${(XVGETH)}
 ETHBTC: ${(ETHBTC)}
 STMXUSDT: ${(STMXUSDT)}
 TROYUSDT: ${(TROYUSDT)}
 `

}
//TROY/BTC  : ${(TROYUSDT / BTCUSDT*100000000).toFixed(2)}
//STMX/BTC  : ${(STMXUSDT / BTCUSDT*100000000).toFixed(2)}

bot.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const response_time = new Date() - start
  const chat_from = `${ctx.message.chat.first_name} (id: ${ctx.message.chat.id})`
  console.log(`Chat from ${chat_from} (Response Time: ${response_time})`)
})

bot.hears('p', async (ctx) => {
  console.log (ctx.message)
  ctx.reply('tunggu gess..')
  const data = await getData()
  ctx.reply(data)
  setInterval(async function () {
   const data = await getData()
   ctx.reply(data)
  }, 300000)
})
bot.launch()
