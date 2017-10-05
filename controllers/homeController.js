const sql = require('mssql')

exports.getHome = async (req, res) => {
	const { recordset: products } = await new sql.Request().query(`SELECT TOP 6 * FROM ProductCardsView`)
	res.render('index', { name: 'index', products });
}