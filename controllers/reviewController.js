const sql = require('mssql')

exports.addReview = async (req, res) => {
	const { text, rating } = req.body
	const query = 
		`INSERT Reviews (ProductID, UserID, Rating, Text)
		 VALUES (${req.params.id}, ${req.user.ID}, ${rating}, '${text}')
		`
	await new sql.Request().query(query)
	res.send('Отзыв успешно сохранен!');
}

exports.moreReviews = async (req, res) => {
	const query = 
		`SELECT TOP 3 R.Text, R.Rating, R.Created, U.Email, CONCAT(P.FirstName, ' ',P.LastName) AS Name, U.ID AS UserID FROM Reviews R
		 JOIN Users U ON U.ID = R.UserID
		 LEFT JOIN UsersProfiles P ON P.UserID = U.ID
		 WHERE R.ProductID = ${Number(req.query.id)}
		`

	const { recordset: reviews } = await new sql.Request().query(query)
	res.render('components/reviews', { reviews }, (err, html) => {
		res.send(html)
	})
}