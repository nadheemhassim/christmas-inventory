import React, { useState } from 'react';
// import ProductPage from './components/ProductPage';
import OrderPage from './components/OrderPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('orders'); // Default to orders page

  const renderPage = () => {
    switch(currentPage) {
      case 'products':
        // return <ProductPage />;
      case 'orders':
        return <OrderPage />;
      case 'pricing':
        return (
          <div style={{ padding: '20px' }}>
            <h2>💰 Selling Prices Management</h2>
            <p>Pricing page coming soon...</p>
          </div>
        );
      default:
        return <OrderPage />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎄 Christmas Inventory System</h1>
        
        {/* Navigation */}
        <nav style={{ margin: '20px 0', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            onClick={() => setCurrentPage('products')}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: currentPage === 'products' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            📦 Products
          </button>
          <button 
            onClick={() => setCurrentPage('orders')}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: currentPage === 'orders' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🛒 Orders
          </button>
          <button 
            onClick={() => setCurrentPage('pricing')}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: currentPage === 'pricing' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            💰 Selling Prices
          </button>
        </nav>

        {/* Page Content */}
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          {renderPage()}
        </div>
      </header>
    </div>
  );
}

export default App;