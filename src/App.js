import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎄 Christmas Inventory System</h1>
        <nav style={{ marginBottom: '20px' }}>
          <button onClick={() => setCurrentPage('home')}>Home</button>
          <button onClick={() => setCurrentPage('products')}>Products</button>
          <button onClick={() => setCurrentPage('orders')}>Orders</button>
          <button onClick={() => setCurrentPage('pricing')}>Selling Prices</button>
        </nav>

        {currentPage === 'home' && (
          <div>
            <h2>Welcome!</h2>
            <p>Select a page from the navigation above.</p>
          </div>
        )}

        {currentPage === 'products' && (
          <div>
            <h2>Products Page</h2>
            <p>Product management coming soon...</p>
          </div>
        )}

        {currentPage === 'orders' && (
          <div>
            <h2>Orders Page</h2>
            <p>Order management coming soon...</p>
          </div>
        )}

        {currentPage === 'pricing' && (
          <div>
            <h2>Selling Prices Page</h2>
            <p>Price management coming soon...</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;