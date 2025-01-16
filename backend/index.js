    import express from 'express'
    import cors from 'cors'
    import { connectDB } from './db.js'
    import authRoutes from './routes/auth.js'
    import userRoutes from './routes/users.js'
    import clientRoutes from './routes/clients.js'
    import productRoutes from './routes/products.js'
    import orderRoutes from './routes/orders.js'
    import detailsorders from './routes/detailsorders.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/detailsorders', detailsorders)


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ error: true, message: 'Internal server error' })
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log('Available routes:')
    console.log('  - POST /api/auth/login')
    console.log('  - GET /api/products')
    console.log('  - GET /api/products/metrics')
  })
});
