const ethers = require('ethers')
const provider = new ethers.JsonRpcProvider(process.env.NODE_URL)
const abi = require('./abi.json')
const coco = '0xe6dbeadd1823b0bcfeb27792500b71e510af55b3'
const deadAddress = '0x000000000000000000000000000000000000dEaD'
const cocoContract = new ethers.Contract(coco, abi, provider)
const dbRedis = require('../db/redis.js')

const { d } = require('./decimals.js')
const decimals = 18

module.exports = {

  // total supply
  totalcoins: async (req, res) => {
    try {
      const key = 'totalCoins'
      let cache = await dbRedis.get(key)
      if (cache) {
        const totalSupply = JSON.parse(cache)
        res.status(200).send(totalSupply.toString())
        return
      }
      const supply = await cocoContract.totalSupply()
      const totalSupply = d(supply.toString(), decimals)
      if (supply > 0) {
        await dbRedis.set(key, totalSupply.toString(), 60 * 60) // only refresh once per hour
      }
      res.status(200).send(totalSupply)
    } catch (error) {
      console.log(error)
      res.status(500).send('Application Error')
    }
  },

  // total supply minus burned
  circulating: async (req, res) => {
    try {
      const key = 'circulating'
      let cache = await dbRedis.get(key)
      if (cache) {
        res.status(200).send(cache.toString())
        return
      }
      const supply = await cocoContract.totalSupply()
      const burned = await cocoContract.balanceOf(deadAddress)
      const remaining = supply - burned
      const format = d(remaining.toString(), decimals)
      if (format > 0) {
        console.log(format)
        await dbRedis.set(key, format.toString(), 60 * 60) // only refresh once per hour
      }
      res.status(200).send(format)
    } catch (error) {
      console.log(error)
      res.status(500).send('Application Error')
    }
  }
}