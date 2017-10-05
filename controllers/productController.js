const sql = require('mssql')

const productQuery = 
	`SELECT P.ID, P.Price, P.Photo, M.Name AS Model, Stock.ProductCount AS Count, T.Name AS Type, C.Name AS Color, V.Volume AS Memory, OS.Name AS OS, H.WorkingTime, H.MainCamera, H.FrontCamera, H.Width, H.Height, H.ScreenDiagonal, H.Weight
	 FROM Products P
	 JOIN ProductModels M ON P.ModelID = M.ID
	 JOIN ProductTypes T ON M.TypeID = T.ID
	 JOIN Stock ON Stock.ProductID = P.ID
	 LEFT JOIN ProductModelCharacteristics H ON P.ModelID = H.ProductModelID
	 LEFT JOIN OS ON OS.ID = H.OSID
	 LEFT JOIN Colors C ON P.ColorID = C.ID
	 LEFT JOIN Memories V ON P.MemoryID = V.ID
	 WHERE P.ID = `

exports.getProduct = async (req, res) => {
	const { id } = req.params
	const reviewsQuery = 
		`SELECT R.Text, R.Rating, R.Created, U.Email, CONCAT(P.FirstName, ' ',P.LastName) AS Name, U.ID AS UserID FROM Reviews R
		 JOIN Users U ON U.ID = R.UserID
		 LEFT JOIN UsersProfiles P ON P.UserID = U.ID
		 WHERE R.ProductID = ${id}
		`
	const ratingQuery = 
	`SELECT AVG(Rating) AS Rating FROM Reviews
	 WHERE ProductID = ${id}
	`
	const productPromise = new sql.Request().query(productQuery + id)
	const reviewsPromise = new sql.Request().query(reviewsQuery)
	const ratingPromise = new sql.Request().query(ratingQuery)
	const [{ recordset: products }, { recordset: reviews }, { recordset: rating }] = await Promise.all([ productPromise, reviewsPromise, ratingPromise ])
	const product = products[0]
	if (!product) return res.redirect('back')
	const recomendationsQuery =
		`SELECT TOP 3 * FROM ProductCardsView
		 WHERE Name LIKE '${product.Model}%' AND NOT ID = ${id}
		`
	const { recordset: recomendations } = await new sql.Request().query(recomendationsQuery)
	const data = { name: 'product', product, reviews, rating: rating[0].Rating || 0, recomendations }
	if (req.user) {
		const { recordset: likes } = new sql.Request().query(`SELECT * FROM ProductLikes WHERE UserID = ${req.user.ID} AND ProductID = ${id}`)
		data['like'] = (likes && likes.length ? true : false)
	}
	res.render('product', data)
} 

exports.deleteProduct = async (req, res) => {
	const query = 
		`DELETE Products
		 WHERE ID = ${req.params.id}
		`
	await new sql.Request.query(query)
	res.send('Товар успешно удалён')
}

exports.getProductEditor = (req, res) => {
	res.render('admin/editProduct', {name: 'admin'})
}

exports.getUpdateProductEditor = async (req, res) => {
	const { recordset } = await new sql.Request().query(productQuery + req.params.id)
	const product = recordset.length ? recordset[0] : {}
	res.render('admin/editProduct', { name: 'admin', product })
}

exports.addModel = async (req, res) => {
	const { modelName, type, os, workingTime, mainCamera, frontCamera, width, height, screenDiagonal, weight, processor } = req.body
	const query =
		`EXEC AddModel
		 @Type = '${type}',
		 @Name = '${modelName}',
		 @OS = '${os || ''}',
		 @Processor = '${processor || ''}',
		 @WorkingTime = ${workingTime},
		 @MainCamera = ${mainCamera || 0},
		 @FrontCamera = ${frontCamera || 0},
		 @Width = ${width || 0},
		 @Height = ${height || 0},
		 @Weight = ${weight || 0},
		 @ScreenDiagonal = '${screenDiagonal || '0*0'}'
		`
	await new sql.Request().query(query)
	res.send('Модель успешно добавлена!')
}

exports.addProduct = async (req, res) => {
	const { type, model, price, photo, color, memory, count } = req.body
	const query =
		`EXEC AddProduct
		 @Type = '${type}',
		 @Model = '${model}',
		 @Price = ${price},
		 @Photo = '${photo}',
		 @Color = '${color}',
		 @Memory = ${Number(memory)},
		 @Count = ${count}
		`
	await new sql.Request().query(query)
	res.send('Продукт успешно добавлен!')
}

exports.updateProduct = async (req, res) => {
	const { price, photo } = req.body
	const query =
		`UPDATE Products SET Price = ${price}, Photo = ${photo} WHERE ID = ${req.params.id}`
	await new sql.Request().query(query)
	res.send('Продукт успешно обновлен!')
}

exports.heartedProducts = async (req, res) => {
	const query = 
		`SELECT P.* FROM ProductLikes L
		 JOIN ProductCardsView P ON P.ID = L.ProductID
		 WHERE L.UserID = ${req.user.ID}
		`
	const { recordset: products } = await new sql.Request().query(query)
	res.render('catalog', { name: 'catalog', products, hearted: true })
}

exports.getShoppingCart = async (req, res) => {
	const query = 
		`SELECT P.ID, P.Name, P.Price, P.Photo, S.ProductCount AS Count  FROM ShoppingCards S
		 JOIN ProductCardsView P ON S.ProductID = P.ID 
		 WHERE S.UserID = ${req.user.ID}
		`
	const { recordset: products } = await new sql.Request().query(query)
	if (req.query.axs) {
		return res.render(`order-steps/1`, { step: 1, products }, (err, html) => {
			if (err) {
				console.error(err)
				throw Error(err)
			}
			res.send(html)
		})
	}
	res.render('order', { name: 'order', step: 1, products })
}

exports.deleteModel = async (req, res) => {
	const query =
		`DELETE ProductModels
		 WHERE Name = ${req.params.name}
		`
	await new sql.Request().query(query)
	res.send('Модель успешно удалена.')
}