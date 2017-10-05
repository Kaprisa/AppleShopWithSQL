const multer = require('multer')
const jimp = require('jimp')
const uuid = require('uuid')
const sql = require('mssql')

const cardQuery =
	`SELECT Count(*) AS count, SUM(P.Price) AS price FROM ShoppingCards S
	 JOIN Products P
	 ON P.ID = S.ProductID
	 WHERE UserID =`

const multerOptions = {
	storage: multer.memoryStorage(),
	fileFilter(req, file, next) {
		const isPhoto = file.mimetype.startsWith('image/')
		if (isPhoto) {
			next(null, true)
		} else {
			next({message: 'That file type Isn\'t allowed!'}, false)
		}
	}
}

exports.upload = multer(multerOptions).single('photo')

exports.resize = async (req, res, next) => {
	if (!req.file) {
		next()
		return
	}
	const extention = req.file.mimetype.split('/')[1]
	req.body.photo = `${uuid.v4()}.${extention}`
	const photo = await jimp.read(req.file.buffer)
	await photo.resize(259, jimp.AUTO)
	await photo.write(`./public/uploads/${req.body.photo}`)
	next()
}

exports.fileUpload = (req, res) => {
	res.send(req.body.photo)
}

exports.searchProducts = async (req, res) => {
	const query = 
		`SELECT TOP 5 ID, Name FROM ProductCardsView
		 WHERE Name LIKE '%${req.query.q}%'
		`
	const { recordset: products } = await new sql.Request().query(query)
  res.json(products)
}

exports.likeProduct = async (req, res) => {
	await new sql.Request().query(`EXEC LikeProduct @UserID = ${req.user.ID}, @ProductID = ${req.params.id}`)
	res.send('Операция выполнена успешно!')
}

exports.addToCart = async (req, res) => {
	await new sql.Request().query(`EXEC AddToCard @UserID = ${req.user.ID}, @ProductID = ${req.params.id}, @ProductCount = ${req.body.count || 1}`)
	const { recordset: [ { count, price } ] } = await new sql.Request().query(cardQuery + req.user.ID)
	res.send(`Товаров ${count} ( ${price} руб. )`)
}

exports.removeFromCart = async (req, res) => {
	const query = `DELETE ShoppingCards WHERE UserID = ${req.user.ID} AND ProductID = ${req.params.id}`
	await new sql.Request().query(query)
	const { recordset: [ { count, price } ] } = await new sql.Request().query(cardQuery + req.user.ID)
	res.send(`Товаров ${count} ( ${price || 0} руб. )`)
}

exports.addMoney = async (req, res) => {
	const { ID } = req.user
	const { money } = req.body
	const query = 
		`IF EXISTS (SELECT UserID FROM UsersBuyInfo WHERE UserID = ${ID})
		 	UPDATE UsersBuyInfo
		 	SET Balance = Balance + ${money}
		 ELSE
			 INSERT UsersBuyInfo (UserID, Balance)
			 VALUES (${ID}, ${money})
		 SELECT Balance FROM UsersBuyInfo WHERE UserID = ${ID}
		`
	const { recordset: [ { Balance: balance } ] } = await new sql.Request().query(query)
	res.send({ msg: 'Счет успешно пополнен!', balance })
}

