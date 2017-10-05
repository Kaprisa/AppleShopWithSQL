const passport = require('passport')
const LocalStrategy = require('passport-local')
const sql = require('mssql')

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
  async (username, password, done) => {
  	const query = 
			`SELECT Users.ID, Users.Email, Roles.Name AS role FROM Users 
			 JOIN Roles ON Users.Role = Roles.ID
			 WHERE Users.UserName = '${username}' AND Users.Password = HASHBYTES('SHA2_512', '${password}')
			`
		try {
			const result = await new sql.Request().query(query)
			const user = result.recordset[0]
			if (!user) return done(null, false)
			return done(null, user)
		} catch (e) {
			console.error(e)
			return done(e)
		}
  }
));