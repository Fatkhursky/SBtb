const { Telegraf } = require('telegraf')
const http = require('http')

const bot = new Telegraf('1680530347:AAFEouWDN7DXH6hwcajZefEVC12wl1yVm_k')
bot.launch()

const Binance = require('node-binance-api')
const binance = new Binance().options({
  APIKEY: '<1VH8FrgR9HGJdYE7ByVrgTaKWuIOxWK7Nw72vRAHyeR7wiGhqSVXmF6OHpmhJGL7>',
  APISECRET: '<********>',
})

http
  .createServer(function (req, res) {
    res.write("I'm alive")
    res.end()
  })
  .listen(8080)

// duduk tb
// /target SCBTC rumus1|buy.99|<.5
// /target SCBTC rumus2|buy.99|<.5

// const tes = [
//   'rumus1',
//   {
//     condition: 'buy',
//     target: 0.00000099,
//   },
//   {
//     condition: '<',
//     target: '5btc',
//   },
// ]

const dummyDataTarget = ['rumus99', { condition: 'buy', target: 0 }, { condition: '<', target: 0 }]
const dummyDataTb = 9999999999999999

let chat_id_telegram
let target_SCBTC = dummyDataTarget
let target_TROYBTC = dummyDataTarget
let tb_SCBTC = dummyDataTb
let tb_XVGBTC = dummyDataTb
let tb_TROYBTC = dummyDataTb

const chatMe = (message) => {
  bot.telegram.sendMessage(chat_id_telegram, message)
}

bot.command('target', (ctx) => {
  chat_id_telegram = ctx.update.message.chat.id
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
  }
  if (symbol === 'TROYBTC') {
    target_TROYBTC = tartget_obj
  }
})

bot.command('tb', (ctx) => {
  console.log(234324)
  chat_id_telegram = ctx.update.message.chat.id
  // parsing data
  let message = ctx.message.text.split(' ')
  const symbol = message[1]
  const target = message[2].split('.')[1] * 1e5
  console.log(target, 3333)

  //
  if (symbol === 'SCBTC') {
    tb_SCBTC = target
  } else if (symbol === 'TROYBTC') {
    tb_TROYBTC = target
  } else if (symbol === 'XVGBTC') {
    tb_XVGBTC = target
  }
})

bot.command('stop', (ctx) => {
  let message = ctx.message.text.split(' ')
  if (message[1] === 'target:SCBTC') {
    target_SCBTC = dummyDataTarget
  } else if (message[1] === 'target:TROYBTC') {
    target_TROYBTC = dummyDataTarget
  }

  if (message[1] === 'tb:SCBTC') {
    tb_SCBTC = dummyDataTb
  } else if (message[1] === 'tb:TROYBTC') {
    tb_TROYBTC = dummyDataTb
  } else if (message[1] === 'tb:XVGBTC') {
    tb_XVGBTC = dummyDataTb
  }
})

bot.command('check', (ctx) => {
  let message = ctx.message.text.split(' ')
  if (message[1] === 'target:SCBTC') {
    ctx.reply(`SC: ${target_SCBTC !== dummyDataTarget ? 'Aktif' : 'Mati'}`)
  } else if (message[1] === 'target:TROYBTC') {
    ctx.reply(`TROY: ${target_TROYBTC !== dummyDataTarget ? 'Aktif' : 'Mati'}`)
  }

  if (message[1] === 'tb:SCBTC') {
    ctx.reply(`SC: ${tb_SCBTC !== dummyDataTb ? 'Aktif' : 'Mati'}`)
  } else if (message[1] === 'tb:TROYBTC') {
    ctx.reply(`TROY: ${tb_TROYBTC !== dummyDataTb ? 'Aktif' : 'Mati'}`)
  } else if (message[1] === 'tb:XVGBTC') {
    ctx.reply(`TROY: ${tb_XVGBTC !== dummyDataTb ? 'Aktif' : 'Mati'}`)
  }
})

// duduk tb
binance.websockets.bookTickers('SCBTC', (bookTickers) => {
  let { symbol, bestBid, bestBidQty, bestAsk, bestAskQty } = bookTickers

  const equation = target_SCBTC[0]
  const position = target_SCBTC[1].condition
  const targetBuyorSell = target_SCBTC[1].target / 1e8
  const targetBTCorJT = +target_SCBTC[2].target
  console.log(equation, position, targetBuyorSell, targetBTCorJT)

  // BUY RUMUS 1
  if (position === 'buy') {
    if (equation === 'rumus1') {
      console.log(+bestBid === targetBuyorSell, +bestBid, '===', targetBuyorSell)
      console.log(bestBid * bestBidQty <= targetBTCorJT, bestBid * bestBidQty, '<=', targetBTCorJT)
    }
    if (
      equation === 'rumus1' &&
      +bestBid === targetBuyorSell &&
      bestBid * bestBidQty <= targetBTCorJT
    ) {
      let displayDate = `SC Buy ${Math.round(bestBid * 100000000)} < 10 BTC`
      bot.telegram.sendMessage(chat_id_telegram, displayDate)
    }

    // BUY RUMUS 2
    if (equation === 'rumus2') {
      console.log(+bestBid === targetBuyorSell, +bestBid, '===', targetBuyorSell)
      console.log(+bestBidQty <= targetBTCorJT * 1e6, +bestBidQty, '<=', targetBTCorJT * 1e6)
    }
    if (
      equation === 'rumus2' &&
      +bestBid === targetBuyorSell &&
      +bestBidQty <= targetBTCorJT * 1e6
    ) {
      let displayDate = `SC Buy ${Math.round(bestBid * 100000000)} Habis`
      bot.telegram.sendMessage(chat_id_telegram, displayDate)
    }
  }

  if (position === 'sell') {
    // SELL RUMUS 1
    if (equation === 'rumus1') {
      console.log(+bestAsk === targetBuyorSell, +bestAsk, '===', targetBuyorSell)
      console.log(bestBid * bestAskQty <= targetBTCorJT, bestAsk * bestAskQty, '<=', targetBTCorJT)
    }
    if (
      equation === 'rumus1' &&
      +bestAsk === targetBuyorSell &&
      bestAsk * bestAskQty <= targetBTCorJT
    ) {
      let displayDate = `SC Buy ${Math.round(bestAsk * 100000000)} < 10 BTC`
      bot.telegram.sendMessage(chat_id_telegram, displayDate)
    }

    // SELL RUMUS 2
    if (equation === 'rumus2') {
      console.log(+bestAsk === targetBuyorSell, +bestAsk, '===', targetBuyorSell)
      console.log(+bestAskQty <= targetBTCorJT * 1e6, +bestAskQty, '<=', targetBTCorJT * 1e6)
    }
    if (
      equation === 'rumus2' &&
      +bestAsk === targetBuyorSell &&
      +bestAskQty <= targetBTCorJT * 1e6
    ) {
      let displayDate = `SC Buy ${Math.round(bestAsk * 100000000)} Habis`
      bot.telegram.sendMessage(chat_id_telegram, displayDate)
    }
  }
})

binance.websockets.bookTickers('TROYBTC', (bookTickers) => {
  let { symbol, bestBid, bestBidQty, bestAsk, bestAskQty } = bookTickers

  const equation = target_TROYBTC[0]
  const position = target_TROYBTC[1].condition
  const targetBuyorSell = target_TROYBTC[1].target / 1e8
  const targetTROYorJT = +target_TROYBTC[2].target
  console.log(equation, position, targetBuyorSell, targetTROYorJT)

  // BUY RUMUS 1
  if (position === 'buy') {
    if (equation === 'rumus1') {
      console.log(+bestBid === targetBuyorSell, +bestBid, '===', targetBuyorSell)
      console.log(
        bestBid * bestBidQty <= targetTROYorJT,
        bestBid * bestBidQty,
        '<=',
        targetTROYorJT
      )
    }
    if (
      equation === 'rumus1' &&
      +bestBid === targetBuyorSell &&
      bestBid * bestBidQty <= targetTROYorJT
    ) {
      let displayDate = `TROY Buy ${Math.round(bestBid * 100000000)} < 10 BTC`
      bot.telegram.sendMessage(chat_id_telegram, displayDate)
    }

    // BUY RUMUS 2
    if (equation === 'rumus2') {
      console.log(+bestBid === targetBuyorSell, +bestBid, '===', targetBuyorSell)
      console.log(+bestBidQty <= targetTROYorJT * 1e6, +bestBidQty, '<=', targetTROYorJT * 1e6)
    }
    if (
      equation === 'rumus2' &&
      +bestBid === targetBuyorSell &&
      +bestBidQty <= targetTROYorJT * 1e6
    ) {
      let displayDate = `TROY Buy ${Math.round(bestBid * 100000000)} Habis`
      bot.telegram.sendMessage(chat_id_telegram, displayDate)
    }
  }

  if (position === 'sell') {
    // SELL RUMUS 1
    if (equation === 'rumus1') {
      console.log(+bestAsk === targetBuyorSell, +bestAsk, '===', targetBuyorSell)
      console.log(
        bestBid * bestAskQty <= targetTROYorJT,
        bestAsk * bestAskQty,
        '<=',
        targetTROYorJT
      )
    }
    if (
      equation === 'rumus1' &&
      +bestAsk === targetBuyorSell &&
      bestAsk * bestAskQty <= targetTROYorJT
    ) {
      let displayDate = `TROY Buy ${Math.round(bestAsk * 100000000)} < 10 BTC`
      bot.telegram.sendMessage(chat_id_telegram, displayDate)
    }

    // SELL RUMUS 2
    if (equation === 'rumus2') {
      console.log(+bestAsk === targetBuyorSell, +bestAsk, '===', targetBuyorSell)
      console.log(+bestAskQty <= targetTROYorJT * 1e6, +bestAskQty, '<=', targetTROYorJT * 1e6)
    }
    if (
      equation === 'rumus2' &&
      +bestAsk === targetBuyorSell &&
      +bestAskQty <= targetTROYorJT * 1e6
    ) {
      let displayDate = `TROY Buy ${Math.round(bestAsk * 100000000)} Habis`
      bot.telegram.sendMessage(chat_id_telegram, displayDate)
    }
  }
})

// tb
// /tb SCBTC >.3
binance.websockets.aggTrades(['SCBTC', 'XVGBTC', 'TROYBTC'], (aggTrades) => {
  let { s: symbol, q: quantity, p: price, T: tradeTime } = aggTrades
  const text = `${(quantity * 1).toLocaleString()} | ${price} TB`

  if (symbol === 'TROYBTC' && quantity >= tb_TROYBTC) {
    let displayDate = `Troy | ` + text
    chatMe(displayDate)
  } else if (symbol === 'SCBTC' && quantity >= tb_SCBTC) {
    let displayDate = `SC | ` + text
    chatMe(displayDate)
  } else if (symbol === 'XVGBTC' && quantity >= tb_XVGBTC) {
    let displayDate = `XVG | ` + text
    chatMe(displayDate)
  }
})
