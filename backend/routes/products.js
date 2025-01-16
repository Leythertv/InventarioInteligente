import express from 'express'
import { pool } from '../db.js'
import sql from 'mssql'

const router = express.Router()


// Get all products
router.get('/', async (req, res) => {
try {
const result = await pool.request().query('SELECT * FROM Productos')
res.json(result.recordset)
} catch (err) {
res.status(500).json({ message: 'Server error' })
} 
})

router.get('/metrics', async (req, res) => {
  try {
    // Calcular el valor total del inventario
    const totalInventoryResult = await pool.request().query('SELECT SUM(Precio * CantidadStock) AS ValorTotalInventario FROM Productos');
    const valorTotalInventario = totalInventoryResult.recordset[0].ValorTotalInventario;

    // Calcular el promedio de precios de los productos
    const averagePriceResult = await pool.request().query('SELECT AVG(Precio) AS PromedioPrecios FROM Productos');
    const promedioPrecios = averagePriceResult.recordset[0].PromedioPrecios;

    // Crear el objeto de respuesta
    const responseData = {
      valorTotalInventario,
      promedioPrecios,
    };

    // console.log('Enviando datos de productos:', responseData);
    res.json(responseData);
  } catch (err) {
    console.error('Error en /api/products/test:', err);
    res.status(500).send(`<span style="color: red;">Hubo un error al calcular los datos de la sección: Productos</span>`);
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
try {
const result = await pool.request()
  .input('id', sql.Int, req.params.id)
  .query('SELECT * FROM Productos WHERE ID_Producto = @id')

if (result.recordset.length === 0) {
  return res.status(404).json({ message: 'Product not found' })
}

res.json(result.recordset[0])
} catch (err) {
res.status(500).json({ message: 'Server error' })
}
})

// Create new product
router.post('/', async (req, res) => {
const { NombreProducto, Descripcion, Precio, CantidadStock } = req.body

try {
const result = await pool.request()
  .input('NombreProducto', sql.VarChar, NombreProducto)
  .input('Descripcion', sql.Text, Descripcion)
  .input('Precio', sql.Decimal(10, 2), Precio)
  .input('CantidadStock', sql.Int, CantidadStock)
  .query(`
    INSERT INTO Productos (NombreProducto, Descripcion, Precio, CantidadStock)
    VALUES (@NombreProducto, @Descripcion, @Precio, @CantidadStock)
    SELECT SCOPE_IDENTITY() AS ID_Producto
  `)

res.status(201).json({
  ID_Producto: result.recordset[0].ID_Producto,
  message: 'Product created successfully'
})
} catch (err) {
res.status(500).json({ message: 'Server error' })
}
})

// Update product
router.put('/:id', async (req, res) => {
const { NombreProducto, Descripcion, Precio, CantidadStock } = req.body

try {
const result = await pool.request()
  .input('id', sql.Int, req.params.id)
  .input('NombreProducto', sql.VarChar, NombreProducto)
  .input('Descripcion', sql.Text, Descripcion)
  .input('Precio', sql.Decimal(10, 2), Precio)
  .input('CantidadStock', sql.Int, CantidadStock)
  .query(`
    UPDATE Productos SET
      NombreProducto = @NombreProducto,
      Descripcion = @Descripcion,
      Precio = @Precio,
      CantidadStock = @CantidadStock
    WHERE ID_Producto = @id
  `)

if (result.rowsAffected[0] === 0) {
  return res.status(404).json({ message: 'Product not found' })
}

res.json({ message: 'Product updated successfully' })
} catch (err) {
res.status(500).json({ message: 'Server error' })
}
})

// Delete product
router.delete('/:id', async (req, res) => {
try {
const result = await pool.request()
  .input('id', sql.Int, req.params.id)
  .query('DELETE FROM Productos WHERE ID_Producto = @id')

if (result.rowsAffected[0] === 0) {
  return res.status(404).json({ message: 'Product not found' })
}

res.json({ message: 'Product deleted successfully' })
} catch (err) {
res.status(500).json({ message: 'Server error' })
}
})








export default router
