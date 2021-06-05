const { Telegraf } = require('telegraf')
const http = require('http')

const bot = new Telegraf('1680530347:AAFEouWDN7DXH6hwcajZefEVC12wl1yVm_k')
bot.launch()

const Binance = require('node-binance-api')
const binance = new Binance().options({
  APIKEY: '<1VH8FrgR9HGJdYE7ByVrgTaKWuIOxWK7Nw72vRAHyeR7wiGhqSVXmF6OHpmhJGL7>',
  APISECRET: '<********>',
})

// http
//   .createServer(function (req, res) {
//     res.write("I'm alive")
//     res.end()
//   })
//   .listen(8081)

// duduk tb
// /target SCBTC rumus1|buy.99|<.5
// /target SCBTC rumus2|buy.99|<.5

const dummyDataTarget = [
  'rumus99',
  {
    condition: 'buy',
    target: 0,
  },
  {
    condition: '<',
    target: 0,
  },
]
const dummyDataTb = 9999999999999999

let chat_id_telegram
let target_SCBTC = dummyDataTarget
let target_TROYBTC = dummyDataTarget
let tb_SCBTC = dummyDataTb
let tb_XVGBTC = dummyDataTb
let tb_TROYBTC = dummyDataTb

let rumus_target_SCBTC = dummyDataTarget
let rumus_target_TROYBTC = dummyDataTarget
let rumus_tb_SCBTC = dummyDataTb
let rumus_tb_XVGBTC = dummyDataTb
let rumus_tb_TROYBTC = dummyDataTb

const chatMe = (message) => {
  bot.telegram.sendMessage(chat_id_telegram, message)
}

// middleware bot telegram
bot.use(async (ctx, next) => {
  chat_id_telegram = ctx.update.message.chat.id
  await next()
})

bot.command('target', (ctx) => {
  // parsing data
  let message = ctx.message.text.split(' ')
  const symbol = message[1]
  const target = message[2].split('|')
  const tartget_obj = target.map((val, i) => {
    if (i === 0) {
      return val
    } else {
      return {
        condition: val.split('.')[0],
        target: val.split('.')[1],
      }
    }
  })

  //
  if (symbol === 'SCBTC') {
    target_SCBTC = tartget_obj
    rumus_target_SCBTC = ctx.message.text
  }
  if (symbol === 'TROYBTC') {
    target_TROYBTC = tartget_obj
    rumus_target_TROYBTC = ctx.message.text
  }
})

bot.command('tb', (ctx) => {
  // parsing data
  let message = ctx.message.text.split(' ')
  const symbol = message[1]
  const target = message[2].split('.')[1] * 1e5

  //
  if (symbol === 'SCBTC') {
    tb_SCBTC = target
    rumus_tb_SCBTC = ctx.message.text
  }

  if (symbol === 'TROYBTC') {
    tb_TROYBTC = target
    rumus_tb_TROYBTC = ctx.message.text
  }

  if (symbol === 'XVGBTC') {
    tb_XVGBTC = target
    rumus_tb_XVGBTC = ctx.message.text
  }
})

bot.command('stop', (ctx) => {
  let message = ctx.message.text.split(' ')
  if (message[1] === 'target:SCBTC') target_SCBTC = dummyDataTarget
  if (message[1] === 'target:TROYBTC') target_TROYBTC = dummyDataTarget
  if (message[1] === 'tb:SCBTC') tb_SCBTC = dummyDataTb
  if (message[1] === 'tb:TROYBTC') tb_TROYBTC = dummyDataTb
  if (message[1] === 'tb:XVGBTC') tb_XVGBTC = dummyDataTb
})

bot.command('check', (ctx) => {
  const message = `
== Target ==
SC: ${target_SCBTC !== dummyDataTarget ? `Aktif - ${rumus_target_SCBTC}` : 'Mati'}
TROY: ${target_TROYBTC !== dummyDataTarget ? `Aktif - ${rumus_target_TROYBTC}` : 'Mati'}

== Tb ==
SC: ${tb_SCBTC !== dummyDataTb ? `Aktif - ${rumus_tb_SCBTC}` : 'Mati'}
TROY: ${tb_TROYBTC !== dummyDataTb ? `Aktif - ${rumus_tb_TROYBTC}` : 'Mati'}
XVG: ${tb_XVGBTC !== dummyDataTb ? `Aktif - ${rumus_tb_XVGBTC}` : 'Mati'}
  `
  chatMe(message)
})

const rumusTarget = ({ symbol, bestBid, bestBidQty, bestAsk, bestAskQty }) => {
  let target = dummyDataTarget
  if (symbol === 'SCBTC') target = target_SCBTC
  if (symbol === 'TROYBTC') target = target_TROYBTC

  const equation = target[0]
  const position = target[1].condition
  const targetBuyorSell = target[1].target / 1e8
  const targetBTCorJT = +target[2].target

  const displayDate_rumus1 = `Target: ${symbol} ${position} ${Math.round(targetBuyorSell * 1e8)} < ${targetBTCorJT} BTC`
  const displayDate_rumus2 = `Target: ${symbol} ${position} ${Math.round(targetBuyorSell * 1e8)} Habis`

  let bestBidOrAsk = position === 'buy' ? +bestBid : +bestAsk
  let bestBidOrAskQty = position === 'buy' ? +bestBidQty : +bestAskQty

  let displayDate = null

  if (equation === 'rumus1' && bestBidOrAsk === targetBuyorSell && bestBidOrAsk * bestBidOrAskQty <= targetBTCorJT) {
    displayDate = displayDate_rumus1
  }
  if (equation === 'rumus2' && bestBidOrAsk === targetBuyorSell && bestBidOrAskQty <= targetBTCorJT * 1e6) {
    displayDate = displayDate_rumus2
  }

  return displayDate
}

// duduk tb
binance.websockets.bookTickers('SCBTC', (bookTickers) => {
  const displayDate = rumusTarget(bookTickers)
  if (displayDate) chatMe(displayDate)
})

binance.websockets.bookTickers('TROYBTC', (bookTickers) => {
  const displayDate = rumusTarget(bookTickers)
  if (displayDate) chatMe(displayDate)
})

// tb
// /tb SCBTC >.3
binance.websockets.aggTrades(['SCBTC', 'XVGBTC', 'TROYBTC'], (aggTrades) => {
  let { s: symbol, q: quantity, p: price, T: tradeTime } = aggTrades
  const displayDate = `TB: ${symbol} | ${(quantity * 1).toLocaleString()} | ${price} TB`

  if (symbol === 'TROYBTC' && quantity >= tb_TROYBTC) chatMe(displayDate)
  if (symbol === 'SCBTC' && quantity >= tb_SCBTC) chatMe(displayDate)
  if (symbol === 'XVGBTC' && quantity >= tb_XVGBTC) chatMe(displayDate)
})
