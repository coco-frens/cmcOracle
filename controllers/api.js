const ethers = require('ethers')
const provider = new ethers.JsonRpcProvider(process.env.NODE_URL)
const abi = require('./abi.json')
const coco = '0xe6dbeadd1823b0bcfeb27792500b71e510af55b3'
const deadAddress = '0x000000000000000000000000000000000000dEaD'
const cocoContract = new ethers.Contract(coco, abi, provider)

const { d } = require('./decimals.js')
const decimals = 18


module.exports = {

  // total supply
  totalcoins: async (req, res) => {
    const supply = await cocoContract.totalSupply()
    const totalSupply = d(supply.toString(), decimals)
    res.status(200).send(totalSupply)
  },

  // total supply minus burned
  circulating: async (req, res) => {
    const supply = await cocoContract.totalSupply()
    const burned = await cocoContract.balanceOf(deadAddress)
    const remaining = supply - burned
    const format = d(remaining.toString(), decimals)
    res.status(200).send(format)
  }
}