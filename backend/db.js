import sql from 'mssql'
    import dotenv from 'dotenv'

    dotenv.config()

    const config = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_SERVER,
      database: process.env.DB_DATABASE,
      options: {
        encrypt: true,
        trustServerCertificate: true
      }
    }

export const pool = new sql.ConnectionPool(config)
pool.on('error', err => {
  console.error('Database connection error:', err)
})

export const connectDB = async () => {
  try {
    console.log('Connecting to database...')
    await pool.connect()
    console.log('Successfully connected to SQL Server')
    
    // Test connection with a simple query
    const testResult = await pool.request().query('SELECT 1 AS test')
    console.log('Connection test result:', testResult.recordset)
  } catch (err) {
    console.error('Database connection failed:', err)
    throw err // Re-throw to prevent server from starting
  }
}
