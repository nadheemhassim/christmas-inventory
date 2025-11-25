const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Azure SQL Config
const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    console.log('Testing database connection...');
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT COUNT(*) as productCount FROM Products');
    
    res.json({ 
      success: true,
      message: '✅ Database connected successfully!', 
      productCount: result.recordset[0].productCount,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Database connection failed:', err);
    res.status(500).json({ 
      success: false,
      error: 'Database connection failed: ' + err.message 
    });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT * FROM Products 
      WHERE isActive = 1 
      ORDER BY itemNo
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Products API error:', err);
    res.status(500).json({ error: 'Failed to fetch products: ' + err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'POS Backend',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 POS Backend running on port ${PORT}`);
});