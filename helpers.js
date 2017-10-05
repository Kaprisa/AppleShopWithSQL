const md5 = require('md5')

exports.moment = require('moment')

exports.dump = (obj) => JSON.stringify(obj, null, 2)

exports.siteName = 'AppleShop'

exports.formatPrice = (price) => {
	return Number.prototype.toFixed.call(parseFloat(price) || 0, 2)
  	.replace(/(\D)/g, ",")
  	.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
}

exports.getGravatar = (email, size = 40) => {
	return `https://s.gravatar.com/avatar/${md5(email)}?s=${size}`
}

