const sql = require('mssql')

exports.getCatalog = async (req, res) => {
	res.redirect('/catalog/Mac/page/1')
}

exports.getCatalogPages = async (req, res) => {
	const { sort = 'ID' } = req.query
	const { type = 'Mac', model = '', page = 1 } = req.params
	const limit = 6
	const skip = ( page * limit ) - limit
	const query = 
		`EXECUTE Pagination 
			@Page = ${page},
			@Limit = ${limit},
			@SortColumn = '${sort}',
			@Type = '${type}',
			@Model = '${model}'
		`
	const productsPromise = new sql.Request().query(query)
	const modelsQuery = 
		`SELECT ProductModels.Name AS Name FROM ProductModels
		 JOIN ProductTypes ON ProductModels.TypeID = ProductTypes.ID
		 WHERE ProductTypes.Name = '${type}' AND ProductModels.ID IN (SELECT ModelID FROM Products)
		`//пока так, но это не эффективно тк в продуктах слишком много записей, поэтому нужно удалять в бд наверное
	const countQuery = 
		`SELECT COUNT (*) AS Count FROM Products
		 JOIN ProductModels ON ProductModels.ID = Products.ModelID
		 JOIN ProductTypes ON ProductModels.TypeID = ProductTypes.ID
		 WHERE ProductTypes.Name = '${type}' ${model !== '' ? `AND ProductModels.Name LIKE '${model}%'` : ''}
		`
	const modelsPromise = new sql.Request().query(modelsQuery)
	const countPromise = new sql.Request().query(countQuery)
	const [ { recordset: products = [] }, { recordset: models = [] }, { recordset: { Count: count = 0 } } ] = await Promise.all([productsPromise, modelsPromise, countPromise])
	const pages = Math.ceil( count / limit )
	if (req.query.axs) {
		if (!products.length && skip) return
		res.render('partials/productsList', { name: 'catalog', products, page, pages, count, type, models, model, sort }, function(err, html) {
			res.send(html)
		})
	} else{
		if (!products.length && skip) {
			res.redirect(`/catalog/${type}/page/${pages}`)
			return
		}
		res.render('catalog', { name: 'catalog', products, page, pages, count, type, models, model, sort })
	}	
}
