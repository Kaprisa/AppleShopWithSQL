const passport = require('passport')
const crypto = require('crypto')
const promisify = require('es6-promisify')
const mail = require('../handlers/mail')
const sql = require('mssql')

exports.login = passport.authenticate('local')

exports.afterLogin = (req, res) =>  {
  res.render('components/user', {user: req.user}, function(err, html){
    res.send(html)
  })
}

exports.logout = (req, res) => {
	req.logout()
	req.session.destroy()
	res.redirect('/')
}

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		next()
	} else {
		if (req.method === 'POST') {
			return res.send({ action: 'error', msg: 'Пожалуйста, авторизируйтесь или зарегистрируйтесь' })
		}
		res.redirect('/')
	}
}

exports.forgot = async (req, res) => {
	const query = 
		`SELECT ID, Email FROM Users 
		 WHERE Email = '${req.body.email}'
		`
	const result = await new sql.Request().query(query)
	const { ID, Email: email } = result.recordset[0]
	if (!ID) {
		res.send('Не существует аккаунта с таким E-Mail')
		return
	}
	const resetPasswordToken = crypto.randomBytes(20).toString('hex')
	const resetPasswordExpires = Date.now() + 3600000
	const updateQuery = 
		`UPDATE Users
		 SET ResetPasswordToken = '${resetPasswordToken}', ResetPasswordExpires = ${resetPasswordExpires}
		 WHERE ID = ${ID}
		`
	await new sql.Request().query(updateQuery)
	const resetURL = `http://${req.headers.host}/account/reset/${resetPasswordToken}`
	await mail.send({
		email,
		subject: 'Восстановление пароля',
		resetURL,
		filename: 'reset-password'
	})
		res.send('Вам отправлена инструкция восстановления аккаунта')
}

exports.reset = async (req, res) => {
	const query = 
		`SELECT ID FROM Users
		 WHERE ResetPasswordToken = '${req.params.token}' AND ResetPasswordExpires > ${Date.now()}
		`
	const { recordset: [ { ID } ] } = await new sql.Request().query(query)
	if (!ID) {
		res.send('Сброс пароля не валиден или истёк')
		return
	}
	res.render('reset/reset')
}

exports.confirmedPassword = (req, res, next) => {
	if (req.body.password === req.body['confirmPassword']) {
		return next()
	} 
	res.send('Пароли не совпадают!')
	res.redirect('back')
}

exports.update = async (req, res) => {
	const query = 
		`SELECT ID FROM Users
		 WHERE ResetPasswordToken = '${req.params.token}' AND ResetPasswordExpires > ${Date.now()}
		`
	const { recordset: [ { ID } ] } = await new sql.Request().query(query)	
	if (!ID) {
		res.send('Сброс пароля не валиден или истёк')
		return
	}
	const setPasswordQuery = 
		`UPDATE Users 
		 SET Password = HASHBYTES('SHA2_512', '${req.body.password}'), ResetPasswordToken = NULL, ResetPasswordExpires = NULL
		 WHERE ID = ${ ID }`
	await new sql.Request().query(query)
	req.login(ID, (err) => {
		if (err) {
			console.error(err)
		}
	})
	res.redirect('/')
}

exports.changePassword = async (req, res) => {
	const { oldPassword, password } = req.body
	const query =
		`UPDATE Users
		 SET Password = HASHBYTES('SHA2_512', '${password}')
		 WHERE ID = ${req.user.ID} AND Password = HASHBYTES('SHA2_512', '${oldPassword}')
		`
	const { rowsAffected } = await new sql.Request().query(query)
	const msg = rowsAffected[0] === 0 ? 'Вы ввели неверный старый пароль' : 'Пароль успешно обновлен!'
	res.send(msg)
}