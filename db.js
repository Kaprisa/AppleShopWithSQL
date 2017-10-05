const sql = require('mssql')

const config = {
  user: 'sa',
  port: '49170',
  password: '55555',
  server: 'localhost', 
  database: 'AppleShop2',

  options: {
      encrypt: true // Use this if you're on Windows Azure
  }
}

sql.connect(config)

module.exports = config
