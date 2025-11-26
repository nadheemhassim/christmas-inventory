import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎄 Christmas Inventory System</h1>
        <p>✅ React App is Working!</p>
        
        <nav style={{ margin: '20px 0' }}>
          <button 
            onClick={() => setCurrentPage('home')}
            style={{ margin: '5px', padding: '10px 20px' }}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentPage('products')}
            style={{ margin: '5px', padding: '10px 20px' }}
          >
            Products
          </button>
          <button 
            onClick={() => setCurrentPage('orders')}
            style={{ margin: '5px', padding: '10px 20px' }}
          >
            Orders
          </button>
          <button 
            onClick={() => setCurrentPage('pricing')}
            style={{ margin: '5px', padding: '10px 20px' }}
          >
            Selling Prices
          </button>
        </nav>

        {currentPage === 'home' && (
          <div>
            <h2>Welcome to Christmas Inventory!</h2>
            <p>Select a page from the navigation above to get started.</p>
          </div>
        )}

        {currentPage === 'products' && (
          <div>
            <h2>📦 Products Management</h2>
            <p>Product page coming soon...</p>
          </div>
        )}

        {currentPage === 'orders' && (
          <div>
            <h2>🛒 Orders Management</h2>
            <p>Orders page coming soon...</p>
          </div>
        )}

        {currentPage === 'pricing' && (
          <div>
            <h2>💰 Selling Prices Management</h2>
            <p>Pricing page coming soon...</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;