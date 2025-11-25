import React, { useEffect, useState, useRef } from "react";
// import { api } from '../services/api';
import {api} from "../services/api";
import html2pdf from 'html2pdf.js';
// import './../styles/OrderPage.css';
import "../styles/OrderPage.css";

const OrderPage = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salespersons, setSalespersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState(null);
  const [orderDiscount, setOrderDiscount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const barcodeInputRef = useRef(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Auto-focus on barcode input when scanner is active
  useEffect(() => {
    if (scannerActive && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [scannerActive]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [productsData, customersData, salespersonsData] = await Promise.all([
        api.getProducts(),
        api.getCustomers(),
        api.getSalespersons()
      ]);
      setProducts(productsData);
      setCustomers(customersData);
      setSalespersons(salespersonsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      alert("Failed to load initial data");
    } finally {
      setLoading(false);
    }
  };

  // Barcode scanning functionality
  const handleBarcodeScan = async () => {
    if (!barcodeInput.trim()) return;

    setLoading(true);
    try {
      const product = await api.scanBarcode(barcodeInput.trim());
      if (product) {
        addProductToCart(product, 1);
        setBarcodeInput("");
        setScannerActive(false);
      } else {
        alert("Product not found! Try searching by item number.");
      }
    } catch (error) {
      console.error("Barcode scan failed:", error);
      alert("Scan failed!");
    } finally {
      setLoading(false);
    }
  };

  // Automatic barcode scanning
  useEffect(() => {
    if (barcodeInput.trim() && scannerActive) {
      const timer = setTimeout(() => {
        handleBarcodeScan();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [barcodeInput, scannerActive]);

  // Product search functionality
  const handleProductSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setLoading(true);
    try {
      const results = await api.searchProducts(searchTerm);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed!");
    } finally {
      setLoading(false);
    }
  };

  // Add product to cart
  const addProductToCart = (product, quantity = 1, customPrice = null) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    const finalPrice = customPrice !== null ? customPrice : product.unitPrice;
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { 
              ...item, 
              quantity: item.quantity + quantity,
              unitPrice: finalPrice,
              totalPrice: finalPrice * (item.quantity + quantity)
            }
          : item
      ));
    } else {
      const newItem = {
        product,
        quantity,
        unitPrice: finalPrice,
        totalPrice: finalPrice * quantity
      };
      setCart([...cart, newItem]);
    }
    setShowSearchResults(false);
    setSearchTerm("");
  };

  // Update cart item quantity
  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item =>
      item.product.id === productId
        ? {
            ...item,
            quantity: newQuantity,
            totalPrice: item.unitPrice * newQuantity
          }
        : item
    ));
  };

  // Update cart item price
  const updateCartItemPrice = (productId, newPrice) => {
    setCart(cart.map(item =>
      item.product.id === productId
        ? {
            ...item,
            unitPrice: newPrice,
            totalPrice: newPrice * item.quantity
          }
        : item
    ));
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - orderDiscount + deliveryCharge;
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setSelectedSalesperson(null);
    setOrderDiscount(0);
    setDeliveryCharge(0);
    setSearchTerm("");
    setBarcodeInput("");
    setShowSearchResults(false);
  };

  // Process sale (create order)
  const processSale = async () => {
    if (cart.length === 0) {
      alert("Please add items to cart!");
      return;
    }

    if (!selectedCustomer) {
      alert("Please select a customer!");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerId: selectedCustomer.id,
        salespersonId: selectedSalesperson?.id || null,
        orderDiscount: orderDiscount,
        deliveryCharge: deliveryCharge,
        status: "CONFIRMED",
        orderItems: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      };

      const response = await api.createOrder(orderData);
      alert(`Order ${response.id} created successfully!`);
      
      generateReceipt(response);
      clearCart();
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to create order: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate professional receipt
  const generateReceipt = (order) => {
    const orderId = order?.id || "N/A";
    const orderDate = new Date().toLocaleString();
    const customerName = selectedCustomer?.name || "Walk-in Customer";
    const salespersonName = selectedSalesperson?.name || "N/A";
    const subtotal = calculateSubtotal();
    const discount = orderDiscount || 0;
    const delivery = deliveryCharge || 0;
    const grandTotal = calculateGrandTotal();

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice #${orderId}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          padding: 20px;
          margin: 0;
        }
        .invoice-container { 
          max-width: 800px; 
          margin: 0 auto; 
          border: 2px solid #000; 
          padding: 30px;
        }
        .header { 
          text-align: center; 
          border-bottom: 3px solid #000; 
          padding-bottom: 20px; 
          margin-bottom: 30px; 
        }
        .company-name { 
          font-size: 28px; 
          font-weight: bold; 
          margin-bottom: 10px;
        }
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
          margin: 10px 0;
        }
        .info-section { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 30px; 
          margin-bottom: 30px; 
        }
        .info-card { 
          padding: 20px; 
          border: 2px solid #000; 
          background: #f9f9f9;
        }
        .info-card h3 {
          margin: 0 0 15px 0;
          font-size: 18px;
          border-bottom: 1px solid #000;
          padding-bottom: 5px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 30px 0; 
        }
        th { 
          background: #000; 
          color: white; 
          padding: 15px; 
          border: 2px solid #000; 
          font-weight: bold;
        }
        td { 
          padding: 12px; 
          border: 1px solid #000; 
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .summary-section { 
          border: 2px solid #000; 
          padding: 25px; 
          margin-top: 30px; 
          background: #f9f9f9;
        }
        .summary-row { 
          display: flex; 
          justify-content: space-between; 
          padding: 10px 0; 
          font-size: 16px;
        }
        .summary-row:last-child { 
          font-weight: bold; 
          border-top: 2px solid #000; 
          padding-top: 15px;
          font-size: 18px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #000;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="company-name">🎄 Christmas Inventory Store</div>
          <div>123 Holiday Street, Christmas City</div>
          <div>Phone: (555) 123-4567</div>
          <div class="invoice-title">TAX INVOICE #${orderId}</div>
        </div>
        
        <div class="info-section">
          <div class="info-card">
            <h3>Bill To</h3>
            <p><strong>${customerName}</strong></p>
            ${selectedCustomer?.phone ? `<p>Tel: ${selectedCustomer.phone}</p>` : ""}
            ${selectedCustomer?.company ? `<p>${selectedCustomer.company}</p>` : ""}
          </div>
          <div class="info-card">
            <h3>Invoice Details</h3>
            <p><strong>Date:</strong> ${orderDate}</p>
            <p><strong>Salesperson:</strong> ${salespersonName}</p>
            <p><strong>Payment Method:</strong> Cash</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40%">Item Description</th>
              <th style="width: 15%">Item Code</th>
              <th style="width: 10%">Qty</th>
              <th style="width: 15%">Unit Price ($)</th>
              <th style="width: 20%">Total ($)</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map(item => `
              <tr>
                <td>${item.product.description}</td>
                <td class="text-center">${item.product.itemNo}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">${item.unitPrice.toFixed(2)}</td>
                <td class="text-right">${item.totalPrice.toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="summary-section">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          ${discount > 0 ? `
          <div class="summary-row">
            <span>Discount:</span>
            <span>- $${discount.toFixed(2)}</span>
          </div>
          ` : ""}
          ${delivery > 0 ? `
          <div class="summary-row">
            <span>Delivery Charge:</span>
            <span>$${delivery.toFixed(2)}</span>
          </div>
          ` : ""}
          <div class="summary-row">
            <span>GRAND TOTAL:</span>
            <span>$${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          Thank you for your business! 🎅<br>
          <small>This is a computer-generated receipt</small>
        </div>
      </div>
    </body>
    </html>
    `;

    const element = document.createElement("div");
    element.innerHTML = htmlContent;

    html2pdf()
      .set({
        margin: 10,
        filename: `invoice-${orderId}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .from(element)
      .save();
  };

  // Fetch all orders
  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const orders = await api.getAllOrders();
      setAllOrders(orders);
      setShowAllOrders(true);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Quick actions
  const quickAddQuantity = (productId, amount) => {
    const item = cart.find(item => item.product.id === productId);
    if (item) {
      updateCartItemQuantity(productId, item.quantity + amount);
    }
  };

  return (
    <div className="pos-system">
      {/* Header */}
      <div className="pos-header">
        <div className="header-main">
          <h1>🎄 Christmas Inventory POS</h1>
          <div className="header-controls">
            <button onClick={clearCart} className="btn-clear" disabled={loading}>
              🗑️ Clear Cart
            </button>
            <button 
              onClick={() => setScannerActive(!scannerActive)} 
              className={`btn-scan ${scannerActive ? 'active' : ''}`}
              disabled={loading}
            >
              {scannerActive ? '🟢 Scanning...' : '📷 Scan Barcode'}
            </button>
            <button onClick={fetchAllOrders} className="btn-orders" disabled={loading}>
              📋 Order History
            </button>
          </div>
        </div>
        
        {/* Cart Summary */}
        <div className="cart-summary">
          <span className="cart-count">Items in Cart: {cart.length}</span>
          <span className="cart-total">Total: ${calculateGrandTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Processing...</div>
        </div>
      )}

      {/* All Orders Modal */}
      {showAllOrders && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Order History</h2>
              <button onClick={() => setShowAllOrders(false)} className="btn-close" disabled={loading}>
                ✕
              </button>
            </div>
            <div className="orders-list">
              {allOrders.length === 0 ? (
                <div className="no-orders">No orders found</div>
              ) : (
                allOrders.map(order => (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <strong>Order #{order.id}</strong>
                      <span className={`status ${order.status?.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-details">
                      <div><strong>Customer:</strong> {order.customer?.name || 'N/A'}</div>
                      <div><strong>Salesperson:</strong> {order.salesperson?.name || 'N/A'}</div>
                      <div><strong>Total:</strong> $${order.totalAmount?.toFixed(2) || '0.00'}</div>
                      <div><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="pos-layout">
        {/* Left Panel - Product Search & Cart */}
        <div className="left-panel">
          {/* Barcode Scanner */}
          {scannerActive && (
            <div className="scanner-section">
              <h3>📷 Barcode Scanner</h3>
              <div className="scanner-input">
                <input
                  ref={barcodeInputRef}
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBarcodeScan()}
                  placeholder="Scan barcode or enter manually..."
                  disabled={loading}
                  autoFocus
                />
                <button onClick={handleBarcodeScan} disabled={loading}>
                  🔍 Scan
                </button>
              </div>
              <div className="scanner-note">
                💡 Just scan barcode - product will be automatically added to cart!
              </div>
            </div>
          )}

          {/* Product Search */}
          <div className="search-section">
            <h3>🔍 Product Search</h3>
            <div className="search-input">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleProductSearch()}
                placeholder="Search by item number or description..."
                disabled={loading}
              />
              <button onClick={handleProductSearch} disabled={loading}>
                Search
              </button>
            </div>

            {/* Search Results */}
            {showSearchResults && (
              <div className="search-results">
                <h4>Search Results ({searchResults.length})</h4>
                {searchResults.length === 0 ? (
                  <div className="no-results">No products found</div>
                ) : (
                  searchResults.map(product => (
                    <div key={product.id} className="search-result-item">
                      <div className="product-info">
                        <strong>{product.itemNo}</strong>
                        <span className="product-desc">{product.description}</span>
                        <div className="product-meta">
                          <span className="price">$${product.unitPrice.toFixed(2)}</span>
                          <span className="stock">{product.inventoryQuantity} in stock</span>
                          <span className="category">{product.category}</span>
                        </div>
                      </div>
                      <div className="product-actions">
                        <button 
                          onClick={() => addProductToCart(product, 1)}
                          className="btn-add"
                          disabled={loading || product.inventoryQuantity <= 0}
                        >
                          {product.inventoryQuantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Shopping Cart */}
          <div className="cart-section">
            <h3>🛒 Shopping Cart ({cart.length} items)</h3>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <p className="empty-cart-hint">
                  Scan barcodes or search products to add items
                </p>
              </div>
            ) : (
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.product.id} className="cart-item">
                    <div className="item-info">
                      <strong>{item.product.itemNo}</strong>
                      <span className="item-desc">{item.product.description}</span>
                    </div>
                    
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => quickAddQuantity(item.product.id, -1)}
                          disabled={loading}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateCartItemQuantity(item.product.id, parseInt(e.target.value) || 1)}
                          min="1"
                          disabled={loading}
                        />
                        <button 
                          onClick={() => quickAddQuantity(item.product.id, 1)}
                          disabled={loading}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="price-controls">
                        <span className="price-label">Price: $</span>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateCartItemPrice(item.product.id, parseFloat(e.target.value) || 0)}
                          step="0.01"
                          min="0"
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="item-total">
                        $<strong>{item.totalPrice.toFixed(2)}</strong>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="btn-remove"
                        disabled={loading}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Checkout */}
        <div className="right-panel">
          <div className="checkout-section">
            <h3>💰 Checkout</h3>
            
            {/* Customer Selection */}
            <div className="form-group">
              <label>Customer:</label>
              <select
                value={selectedCustomer?.id || ''}
                onChange={(e) => {
                  const customer = customers.find(c => c.id == e.target.value);
                  setSelectedCustomer(customer);
                }}
                disabled={loading}
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.company ? `- ${customer.company}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Salesperson Selection */}
            <div className="form-group">
              <label>Salesperson:</label>
              <select
                value={selectedSalesperson?.id || ''}
                onChange={(e) => {
                  const salesperson = salespersons.find(s => s.id == e.target.value);
                  setSelectedSalesperson(salesperson);
                }}
                disabled={loading}
              >
                <option value="">Select Salesperson</option>
                {salespersons.map(salesperson => (
                  <option key={salesperson.id} value={salesperson.id}>
                    {salesperson.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Order Totals */}
            <div className="order-totals">
              <h4>Order Summary</h4>
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              
              <div className="total-row">
                <span>Discount:</span>
                <div className="discount-input">
                  <span>$</span>
                  <input
                    type="number"
                    value={orderDiscount}
                    onChange={(e) => setOrderDiscount(parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="total-row">
                <span>Delivery Charge:</span>
                <div className="delivery-input">
                  <span>$</span>
                  <input
                    type="number"
                    value={deliveryCharge}
                    onChange={(e) => setDeliveryCharge(parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="total-row grand-total">
                <span>GRAND TOTAL:</span>
                <span>${calculateGrandTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Buttons */}
            <div className="checkout-buttons">
              <button 
                onClick={processSale}
                disabled={cart.length === 0 || !selectedCustomer || loading}
                className="btn-checkout"
              >
                {loading ? '🔄 Processing...' : '💳 PROCESS SALE'}
              </button>
              
              <button 
                onClick={() => {
                  const mockOrder = { 
                    id: `TEMP-${Date.now()}`, 
                    orderDate: new Date().toISOString() 
                  };
                  generateReceipt(mockOrder);
                }}
                disabled={cart.length === 0 || loading}
                className="btn-receipt"
              >
                🧾 PRINT RECEIPT
              </button>
            </div>
          </div>

          {/* Quick Products */}
          <div className="quick-products">
            <h4>⚡ Quick Add Products</h4>
            <div className="quick-product-grid">
              {products.slice(0, 6).map(product => (
                <button
                  key={product.id}
                  onClick={() => addProductToCart(product)}
                  className="quick-product-btn"
                  disabled={product.inventoryQuantity <= 0 || loading}
                >
                  <div className="product-name">{product.itemNo}</div>
                  <div className="product-price">${product.unitPrice.toFixed(2)}</div>
                  <div className="product-stock">{product.inventoryQuantity} in stock</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;