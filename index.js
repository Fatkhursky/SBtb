const express = require('express')
const axios = require('axios')
const app = express()

app.get('/', async (req, res) => {
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

  res.send({
    price: {
      'SC/USDT': +SCUSDT,
      'BTC/USDT': +BTCUSDT,
      'XVG/ETH': +XVGETH,
      'ETH/BTC': +ETHBTC,
      'STMX/USDT': +STMXUSDT,
      'TROY/USDT': +TROYUSDT,
    },
    result: {
      'SC/BTC': (SCUSDT / BTCUSDT * 100000000).toFixed(2),
      'XVG/BTC': (XVGETH * ETHBTC * 100000000).toFixed(2),
      'TROY/BTC': (TROYUSDT / BTCUSDT * 100000000).toFixed(2),
      'STMX/BTC': (STMXUSDT / BTCUSDT * 100000000).toFixed(2),
    },
  })
})

app.listen(3000, () => console.log('Hellox World app berjalan di http://localhost:3000'))
