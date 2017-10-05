const sql = require('mssql')

exports.order = async (req, res) => {
	const { address, phone, delivery } = req.body
	const { price } = res.locals.card
	const { ID } = req.user
	const query = 
		`IF (SELECT Balance FROM UsersBuyInfo WHERE UserID = ${ID}) > ${price}
			BEGIN
				INSERT Orders (UserID, Address, Phone, Delivery, Total)
				VALUES (${ID}, '${address}', '${phone}', ${delivery ? 1 : 0}, ${price})
				SELECT 'Ваш заказ успешно оплачен!' AS msg, 'success' AS action
			END
		 ELSE
		 	SELECT 'На вашем счету недостаточно денег' AS msg, 'error' AS action
		`
	const { recordset: [ { msg, action } ] } = await new sql.Request().query(query)
	res.send({ msg, action })
}

exports.getOrders = async (req, res) => {
	const query =
		`SELECT Created, Total
		 FROM Orders
		 WHERE UserID = ${req.user.ID}
		`//Сделать статус заказа
	const { recordset: orders } = await new sql.Request().query(query)
	if (req.query.axs) {
		return res.render('profile-tabs/orders', { page:  'orders', orders }, (err, html) => {
			if (err) {
				console.error(err)
				throw Error(err)
			}
			res.send(html)
		})
	}
	res.render('profile', { name: 'profile', page: 'orders', orders })
}