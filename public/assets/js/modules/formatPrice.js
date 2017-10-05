export default (price) => {
	return Number.prototype.toFixed.call(parseFloat(price) || 0, 2)
  	.replace(/(\D)/g, ",")
  	.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
}