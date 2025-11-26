import React, { useState, useEffect } from 'react';
import './OrderPage.css';

const OrderPage = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [orderDiscount, setOrderDiscount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  // Mock data - replace with API calls later
  useEffect(() => {
    // Sample products
    setProducts([
      { id: 1, name: 'Christmas Tree 6ft', price: 89.99, stock: 15 },
      { id: 2, name: 'LED Christmas Lights', price: 24.99, stock: 50 },
      { id: 3, name: 'Ornament Set', price: 19.99, stock: 30 },
      { id: 4, name: 'Christmas Wreath', price: 34.99, stock: 20 },
      { id: 5, name: 'Santa Claus Figure', price: 45.99, stock: 10 }
    ]);

    // Sample customers
    setCustomers([
      { id: 1, name: 'Walk-in Customer' },
      { id: 2, name: 'John Smith - Retail Store' },
      { id: 3, name: 'Sarah Johnson - Gift Shop' },
      { id: 4, name: 'Mike Wilson - Corporate' }
    ]);
  }, []);

  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, {
        ...product,
        quantity: 1,
        total: product.price
      }]);
    }
  };

  // Update quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
        : item
    ));
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - orderDiscount + deliveryCharge;
  };

  // Process order
//   const processOrder = () => {
//     if (cart.length === 0) {
//       alert('Please add items to cart!');
//       return;
//     }

//     const orderData = {
//       customerId: selectedCustomer,
//       items: cart,
//       subtotal: calculateSubtotal(),
//       discount: orderDiscount,
//       delivery: deliveryCharge,
//       grandTotal: calculateGrandTotal(),
//       timestamp: new Date().toLocaleString()
//     };

//     // For now, just show alert - later we'll save to database
//     alert(`Order processed successfully!\nTotal: $${calculateGrandTotal().toFixed(2)}`);
    
//     // Clear cart
//     setCart([]);
//     setOrderDiscount(0);
//     setDeliveryCharge(0);
//     setSelectedCustomer('');
//   };



// Process order
const processOrder = () => {
  if (cart.length === 0) {
    alert('Please add items to cart!');
    return;
  }

  // For now, just show alert - later we'll save to database
  alert(`Order processed successfully!\nTotal: $${calculateGrandTotal().toFixed(2)}`);
  
  // Clear cart
  setCart([]);
  setOrderDiscount(0);
  setDeliveryCharge(0);
  setSelectedCustomer('');
};

//   return (
//     <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
//       <h2>🛒 Create New Order</h2>
      
//       <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
//         {/* Left Column - Products & Cart */}
//         <div>
//           {/* Customer Selection */}
//           <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
//             <h3>Customer Information</h3>
//             <select 
//               value={selectedCustomer} 
//               onChange={(e) => setSelectedCustomer(e.target.value)}
//               style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
//             >
//               <option value="">Select Customer</option>
//               {customers.map(customer => (
//                 <option key={customer.id} value={customer.id}>{customer.name}</option>
//               ))}
//             </select>
//             {!selectedCustomer && <p style={{ color: '#666', fontSize: '14px' }}>Select "Walk-in Customer" for retail sales</p>}
//           </div>

//           {/* Available Products */}
//           <div style={{ marginBottom: '20px' }}>
//             <h3>Available Products</h3>
//             <div style={{ display: 'grid', gap: '10px' }}>
//               {products.map(product => (
//                 <div key={product.id} style={{ 
//                   border: '1px solid #ddd', 
//                   padding: '15px', 
//                   borderRadius: '4px',
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center'
//                 }}>
//                   <div>
//                     <h4 style={{ margin: '0 0 5px 0' }}>{product.name}</h4>
//                     <p style={{ margin: '0', color: '#666' }}>Stock: {product.stock} | ${product.price}</p>
//                   </div>
//                   <button 
//                     onClick={() => addToCart(product)}
//                     style={{
//                       padding: '8px 16px',
//                       backgroundColor: '#28a745',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '4px',
//                       cursor: 'pointer'
//                     }}
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Shopping Cart */}
//           <div>
//             <h3>Shopping Cart ({cart.length} items)</h3>
//             {cart.length === 0 ? (
//               <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
//                 Cart is empty. Add products from above.
//               </p>
//             ) : (
//               <div style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
//                 {cart.map(item => (
//                   <div key={item.id} style={{ 
//                     padding: '15px', 
//                     borderBottom: '1px solid #eee',
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}>
//                     <div style={{ flex: 1 }}>
//                       <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
//                       <p style={{ margin: '0', color: '#666' }}>${item.price} each</p>
//                     </div>
                    
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                         <button 
//                           onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                           style={{ 
//                             padding: '5px 10px', 
//                             backgroundColor: '#dc3545', 
//                             color: 'white', 
//                             border: 'none', 
//                             borderRadius: '4px',
//                             cursor: 'pointer'
//                           }}
//                         >
//                           -
//                         </button>
//                         <span style={{ padding: '0 10px', minWidth: '30px', textAlign: 'center' }}>
//                           {item.quantity}
//                         </span>
//                         <button 
//                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                           style={{ 
//                             padding: '5px 10px', 
//                             backgroundColor: '#28a745', 
//                             color: 'white', 
//                             border: 'none', 
//                             borderRadius: '4px',
//                             cursor: 'pointer'
//                           }}
//                         >
//                           +
//                         </button>
//                       </div>
                      
//                       <span style={{ fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>
//                         ${item.total.toFixed(2)}
//                       </span>
                      
//                       <button 
//                         onClick={() => removeFromCart(item.id)}
//                         style={{ 
//                           padding: '5px 10px', 
//                           backgroundColor: '#ffc107', 
//                           color: 'black', 
//                           border: 'none', 
//                           borderRadius: '4px',
//                           cursor: 'pointer'
//                         }}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Column - Order Summary */}
//         <div>
//           <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
//             <h3>Order Summary</h3>
            
//             <div style={{ marginBottom: '15px' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//                 <span>Subtotal:</span>
//                 <span>${calculateSubtotal().toFixed(2)}</span>
//               </div>
              
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
//                 <span>Discount:</span>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                   <span>$</span>
//                   <input 
//                     type="number" 
//                     value={orderDiscount} 
//                     onChange={(e) => setOrderDiscount(parseFloat(e.target.value) || 0)}
//                     style={{ width: '80px', padding: '5px' }}
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>
//               </div>
              
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
//                 <span>Delivery:</span>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//                   <span>$</span>
//                   <input 
//                     type="number" 
//                     value={deliveryCharge} 
//                     onChange={(e) => setDeliveryCharge(parseFloat(e.target.value) || 0)}
//                     style={{ width: '80px', padding: '5px' }}
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>
//               </div>
              
//               <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', borderTop: '2px solid #ddd', paddingTop: '10px' }}>
//                 <span>Grand Total:</span>
//                 <span>${calculateGrandTotal().toFixed(2)}</span>
//               </div>
//             </div>

//             <button 
//               onClick={processOrder}
//               disabled={cart.length === 0}
//               style={{
//                 width: '100%',
//                 padding: '12px',
//                 backgroundColor: cart.length === 0 ? '#6c757d' : '#007bff',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 fontSize: '16px',
//                 cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
//               }}
//             >
//               {cart.length === 0 ? 'Add Items to Cart' : '💳 PROCESS ORDER'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

return (
  <div className="order-page">
    <h2>🛒 Create New Order</h2>
    
    <div className="order-layout">
      
      {/* Left Column - Products & Cart */}
      <div>
        {/* Customer Selection */}
        <div className="customer-section">
          <h3>Customer Information</h3>
          <select 
            value={selectedCustomer} 
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="customer-select"
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
          {!selectedCustomer && <p className="customer-note">Select "Walk-in Customer" for retail sales</p>}
        </div>

        {/* Available Products */}
        <div className="products-section">
          <h3>Available Products</h3>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="product-meta">Stock: {product.stock} | ${product.price}</p>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="cart-section">
          <h3>Shopping Cart ({cart.length} items)</h3>
          {cart.length === 0 ? (
            <div className="empty-cart">
              Cart is empty. Add products from above.
            </div>
          ) : (
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">${item.price} each</p>
                  </div>
                  
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn quantity-decrease"
                      >
                        -
                      </button>
                      <span className="quantity-display">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn quantity-increase"
                      >
                        +
                      </button>
                    </div>
                    
                    <span className="item-total">
                      ${item.total.toFixed(2)}
                    </span>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div>
        <div className="order-summary">
          <h3>Order Summary</h3>
          
          <div className="summary-content">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Discount:</span>
              <div className="summary-input">
                <span>$</span>
                <input 
                  type="number" 
                  value={orderDiscount} 
                  onChange={(e) => setOrderDiscount(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="summary-row">
              <span>Delivery:</span>
              <div className="summary-input">
                <span>$</span>
                <input 
                  type="number" 
                  value={deliveryCharge} 
                  onChange={(e) => setDeliveryCharge(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="summary-row grand-total">
              <span>Grand Total:</span>
              <span>${calculateGrandTotal().toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={processOrder}
            disabled={cart.length === 0}
            className="process-order-btn"
          >
            {cart.length === 0 ? 'Add Items to Cart' : '💳 PROCESS ORDER'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

};

export default OrderPage;