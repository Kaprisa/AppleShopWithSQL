const sql = require('mssql')

exports.getContacts = (req, res) => {
	res.render('contacts', { name: 'contacts' });
}

exports.getStoreContacts = async (req, res) => {
	const { recordset } = await new sql.Request().query(`SELECT * FROM Stores WHERE ID = ${req.params.id}`)
	res.render('contacts', { name: 'contacts', store: recordset[0] });
}