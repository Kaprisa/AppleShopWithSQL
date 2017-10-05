const sql = require('mssql')

const storeQuery = 
	`SELECT * FROM Stores
	 WHERE ID=`

exports.getStoreEditor = (req, res) => {
	res.render('admin/editStore', { name: 'admin' })
}

exports.deleteStore = async (req, res) => {
	await new sql.Request().query(`DELETE Stores WHERE ID = ${req.params.id}`)
	res.send('Магазин успешно удалён')
}

exports.getUpdateStoreEditor = async (req, res) => {
	const { recordset } = await new sql.Request().query(storeQuery + req.params.id)
	res.render('admin/editStore', { name: 'admin', store: recordset[0] })
}

exports.getStore = async (req, res) => {
	const { recordset } = await new sql.Request().query(storeQuery + req.params.id)
	res.render('store', { name: 'store', store: recordset[0] })
}

exports.addStore = async (req, res) => {
	const { name, phone, description, businessHours, address, lat, lng, businessWeekday, businessWeekend, photo } = req.body
	const query =
		`INSERT Stores (Name, Address, Photo, Description, BussinessWeekend, BussinessWeekday, Phone, Lat, Lng)
		 VALUES ('${name}', '${address}', '${photo}', '${description}', '${businessWeekend}', '${businessWeekday}', '${phone}', ${lat}, ${lng})
		`
	await new sql.Request().query(query)
	res.send('Данные успешно загружены!')
}

exports.updateStore = async (req, res) => {
	const { name, phone, description, businessHours, address, lat, lng, businessWeekday, businessWeekend, photo } = req.body
	const query =
		`UPDATE Stores
		 SET Name = '${name}', Address = '${address}', Photo = '${photo}', Description = '${description}', BussinessWeekend = '${businessWeekend}', BussinessWeekday = '${businessWeekday}', Phone = '${phone}', Lat = ${lat}, Lng = ${lng}
		`
	await new sql.Request().query(query)
	res.send('Магазин успешно обновлён!')
}

exports.mapStores = async (req, res) => {
	const [ lng, lat ] = [ req.query.lng, req.query.lat ].map(parseFloat)
	const query =
		`SELECT * FROM Stores
		 WHERE (ABS(Lat - ${lat}) <= 10) AND (ABS(Lng - ${lng}) <= 10)`
	const { recordset: stores } = new sql.Request().query(query)
	res.send(stores)
}