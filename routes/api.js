const router = require('express-promise-router')()
const apiController = require('../controllers/api.js')

router.route('/totalcoins')
  .get(
    apiController.totalcoins)

router.route('/circulating')
  .get(
    apiController.circulating)

module.exports = router
