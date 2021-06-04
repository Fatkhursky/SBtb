const { Telegraf } = require('telegraf')
const bot = new Telegraf('1776734572:AAG4NmUhQ22nR0CB-0jbKO9oAk5Fwn084zY')

const WebSocket = require('ws')
const url = 'wss://stream.binance.com:9443/ws'
const connection = new WebSocket(url)

// app.get('/', async (req, res) => {})

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`)
}
const msg = {
  method: 'SUBSCRIBE',
  params: ['troybtc@bookTicker', 'troybtc@aggTrade'],
  id: 1,
}

connection.onopen = () => {
  connection.send(JSON.stringify(msg))
}

connection.onmessage = (book) => {
  //console.log(JSON.parse(e.data).B, JSON.parse(e.data).B > '11500000.00000000')
  if (JSON.parse(book.data).b === '0.00000027' && JSON.parse(book.data).B < '1000000.00000000') {
    bot.telegram.sendMessage(797951802, `TROY ${(JSON.parse(book.data).b)*100000000} Buy Out`)
    console.log((JSON.parse(book.data).b)*100000000, 'Buy Out')
  }
}

connection.onmessage = (agg) => {
  console.log(JSON.parse(agg.data).q, JSON.parse(agg.data).q > '511111.00000000')
  if (JSON.parse(agg.data).q > '511111.00000000') {
    bot.telegram.sendMessage(797951802, `TROY ${JSON.parse(agg.data).q} TB`)
    console.log(JSON.parse(agg.data).q, JSON.parse(agg.data).q > '511111.00000000')
  }
}

// app.listen(3000, () => console.log('Hellox World app berjalan di http://localhost:3000'))


    