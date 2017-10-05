const sql = require('mssql')

exports.getProfile = async (req, res) => {
	const { user } = req
	if (!user || user.role !== 'Employee') {
		return res.redirect('back')
	}
	const query =
		`	SELECT E.ID, CONCAT(E.FirstName, ' ', E.LastName) AS Name, E.Salary, P.Name AS Position FROM Employees E
			JOIN EmployeesPositions P ON P.ID = E.PositionID
		 	WHERE UserID = ${E.UserID}
		`
	const { recordset: [ employee ] } = await new sql.Request().query(query)
	const achivementsQuery = 
		`	SELECT A.Name, A.Icon, A.Description FROM EmployeesAchivements EA
			JOIN Achivements A ON A.ID = EA.AchivementID
			WHERE EA.EmployeeID = ${employee.ID}
		`
	const { recordset: achivements } = await new sql.Request().query(achivementsQuery)	
	res.render('employee', { name: 'employee', employee, achivements })
}

exports.getEmployeesManager = (req, res) => {
	const { page = 'employeesEditor' } = req.params
	if (req.query.axs) {
		return res.render(`admin/employeesManagerPages/${page}`, { page }, (err, html) => {
			if (err) {
				console.error(err)
				throw Error(err)
			}
			res.send(html)
		})
	}
	res.render('admin/employeesManager', { name: 'admin', page })
}

exports.editEmployee = async (req, res) => {
	const { email, name, lastName, position, phone, salary, experience } = req.body
	const query = 
		` EXEC AddEmployee
			@Email = '${email}',
			@FirstName = '${name}',
			@LastName = '${lastName}',
			@Position = '${position}',
			@Phone = '${phone}',
			@Salary = ${salary},
			@Experience = ${experience}
		`
	await new sql.Request().query(query)
	res.send('Сотрудник успешно сохранен!')
}

exports.editAchivement = async (req, res) => {
	const { name, description, icon } = req.body
	const query = 
		` IF EXISTS (SELECT ID FROM Achivements WHERE Name = '${name}')
				UPDATE Achivements
				SET Name = '${name}', Description = '${description}', Icon = '${icon}'
				WHERE Name = '${name}'
			ELSE
				INSERT Achivements (Name, Description, Icon)
				VALUES ('${name}', '${description}', '${icon}')
			SELECT * FROM Achivements
		`
	const { recordset: achivements } = await new sql.Request().query(query)
	return res.render('components/achivements-list', { achivements }, (err, html) => {
		if (err) {
			console.error(err)
			throw Error(err)
		}
		res.send(html)
	})
}

exports.getAchivements = async (req, res) => {
	const { recordset: achivements } = await new sql.Request().query('SELECT * FROM Achivements')
	if (req.query.axs) {
		return res.render('admin/employeesManagerPages/achivementsEditor', { page: 'achivementsEditor', achivements }, (err, html) => {
			if (err) {
				console.error(err)
				throw Error(err)
			}
			res.send(html)
		})
	}
	res.render('admin/employeesManager', { name: 'admin', page: 'achivementsEditor', achivements })
}

exports.getEmployeesList = async (req, res) => {
	const query =
		`	SELECT E.ID, CONCAT(E.FirstName, ' ', E.LastName) AS Name, U.Email, P.Name AS Position FROM Employees E
			JOIN Users U ON U.ID = E.UserID
			JOIN EmployeesPositions P ON P.ID = E.PositionID
		`
	const { recordset: employees } = await new sql.Request().query(query)
	if (req.query.axs) {
		return res.render('admin/employeesManagerPages/employeesList', { page: 'employeesList', employees }, (err, html) => {
			if (err) {
				console.error(err)
				throw Error(err)
			}
			res.send(html)
		})
	}
	res.render('admin/employeesManager', { name: 'admin', page: 'employeesList', employees })
}

exports.getEditEmployee = async (req, res) => {
	const query = 
		`	SELECT E.ID, E.FirstName, E.LastName, E.Salary, E.Experience, E.Phone, U.Email, P.Name AS Position FROM Employees E
			JOIN Users U ON U.ID = E.UserID
			JOIN EmployeesPositions P ON P.ID = E.PositionID
			WHERE E.ID = ${req.params.id}`
	const { recordset: [ employee ] } = await new sql.Request().query(query)
	if (req.query.axs) {
		return res.render('admin/employeesManagerPages/employeesEditor', { page: 'employeesList', employee }, (err, html) => {
			if (err) {
				console.error(err)
				throw Error(err)
			}
			res.send(html)
		})
	}
	res.render('admin/employeesManager', { name: 'admin', page: 'employeesEditor', employee })
}

exports.achivementsSearch = async (req, res) => {
	const query = 
		`SELECT TOP 5 ID, Name FROM Achivements
		 WHERE Name LIKE '%${req.query.q}%'
		`
	const { recordset: achivements } = await new sql.Request().query(query)
  res.json(achivements)
}

exports.employeeAddAchivement = async (req, res) => {
	const query = 
		`INSERT EmployeesAchivements (EmployeeID, AchivementID)
		 VALUES (${Number(req.params.id)}, (SELECT ID FROM Achivements WHERE NAME = '${req.body.name}'))
		`
	await new sql.Request().query(query)
  res.send('Достижение успешно добавлено!')
}