const promisify = require('es6-promisify')
const sql = require('mssql')

exports.validateRegister = (req, res, next) => {
	req.checkBody('email', 'Указанный E-Mail не валиден').isEmail()
	req.sanitizeBody('email').normalizeEmail({
		remove_dots: false,
		remove_extention: false,
		gmail_remove_subaddress: false
	})
	req.checkBody('username', 'Имя пользователя не должно быть пустым').notEmpty
	req.checkBody('password', 'Пароль не может быть пустым').notEmpty
	req.checkBody('confirmPassword', 'Подтвердите пароль').notEmpty
	req.checkBody('confirmPassword', 'Пароли не совпадают').equals(req.body.password)
	const errors = req.validationErrors()
	if (errors) {
		res.json({ errors: errors.map(err => err.msg) })
		return
	}
	next()
}

exports.register = async (req, res, next) => {
	const { username, password, email } = req.body
	const query = 
		` INSERT Users (UserName, Email, [Password]) 
		  VALUES ('${username}' ,'${email}', HASHBYTES('SHA2_512', '${password}'))
		  SELECT SCOPE_IDENTITY() AS ID
	  `
	const result = await new sql.Request().query(query)
	const user_id = result.recordset[0]
	req.login(user_id, (err) => {
		if (err) {
			console.error(err)
		}
	})
	next()
}

exports.isAdmin = (req, res, next) => {
	if (req.user && req.user.role === 'Admin') {
		next()
	} else {
		res.redirect('/')
	}
}

exports.getStep = (req, res) => {
	const step = Number(req.params.step)
	if (req.query.axs) {
		return res.render(`order-steps/${step}`, { step }, (err, html) => {
			if (err) {
				console.error(err)
				throw Error(err)
			}
			res.send(html)
		})
	}
	res.render('order', { name: 'order', step })
}

exports.getProfile = (req, res) => {
	const { page } = req.params
	if (req.query.axs) {
		return res.render(`profile-tabs/${page}`, { page }, (err, html) => {
			if (err) {
				console.error(err)
				throw Error(err)
			}
			res.send(html)
		})
	}
	res.render('profile', { name: 'profile', page })
}

exports.updateProfile = async (req, res) => {
	const { name, lastName, phone, address } = req.body
	const { ID } = req.user
	const query = 
		`IF EXISTS (SELECT ID FROM UsersProfiles WHERE UserID = ${ID})
			UPDATE UsersProfiles
			SET UserID = ${ID}, FirstName = '${name}', LastName = '${lastName}', Address = '${address}', Phone = '${phone}'
		 ELSE
		  INSERT UsersProfiles (UserID, FirstName, LastName, Address, Phone)
		  VALUES (${ID}, '${name}', '${lastName}', '${address}', '${phone}')
		`
	await new sql.Request().query(query)
	res.send('Профиль успешно обновлен!')
}

exports.updatePassportData = async (req, res) => {
	const { seria, number } = req.body
	const { ID } = req.user
	const query = 
		`IF EXISTS (SELECT UserID FROM UsersPassportInfo WHERE UserID = ${ID})
			UPDATE UsersPassportInfo
			SET UserID = ${ID}, Seria = '${seria}', Number = '${number}'
		 ELSE
		  INSERT UsersPassportInfo (UserID, Seria, Number)
		  VALUES (${ID}, '${seria}', '${number}')
		`
	await new sql.Request().query(query)
	res.send('Паспортные данные успешно обновлены!')
}

exports.getPurse = async (req, res) => {
	const { recordset } = await new sql.Request().query(`SELECT Balance FROM UsersBuyInfo WHERE UserID = ${req.user.ID}`)
	const balance = recordset.length ? recordset[0].Balance : 0
	if (req.query.axs) {
		return res.render(`profile-tabs/purse`, { page: 'purse', balance }, (err, html) => {
			if (err) {
				console.error(err)
				throw Error(err)
			}
			res.send(html)
		})
	}
	res.render('profile', { name: 'profile', page: 'purse', balance })
}

exports.getBonus = async (req, res) => {
	const { ID } = req.user
	const query =
		`SELECT T.Discount, T.Name, B.WastedMoney FROM UsersBuyInfo B
		 JOIN BonusCardsTypes T
		 ON T.ID = B.BonusCardID
		 WHERE B.UserID = ${ID}
		 SELECT Min(MinWastedMoney) AS NextBonus FROM BonusCardsTypes
		 WHERE MinWastedMoney > (SELECT T.MinWastedMoney FROM UsersBuyInfo B JOIN BonusCardsTypes T ON B.BonusCardID = T.ID WHERE B.UserID = ${ID})`
	//const { recordsets: [ [ { Discount, Name, WastedMoney } ], [ { NextBonus } ] ] } = await new sql.Request().query(query)
	const { recordsets: [ recordset, [ { NextBonus } ] ] } = await new sql.Request().query(query)
	if (!recordset || !recordset.length) return (req.query.axs ? res.send() : res.redirect('back'))
	const { Discount, Name, WastedMoney } = recordset[0]
	const data = {
		name: 'profile',
		page: 'bonus',
		percent: Math.round((WastedMoney / NextBonus) * 100),
		discount: Discount,
		BonusCard: Name
	}
	if (req.query.axs) {
		return res.render(`profile-tabs/bonus`, data, (err, html) => {
			if (err) {
				console.error(err)
				throw Error(err)
			}
			res.send(html)
		})
	}
	res.render('profile', data)
}



