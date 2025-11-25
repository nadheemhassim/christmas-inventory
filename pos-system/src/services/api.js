import axios from 'axios';

// For development - replace with your Azure URL later
const API_BASE = 'https://your-azure-backend.azurewebsites.net/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Mock data for development
const mockProducts = [
  {
    id: 1,
    itemNo: "AR4-1032T25-R",
    description: "8CM BALL SET, 25PCS/PET TUBE, COLOR: RED",
    unitPrice: 1120.44,
    inventoryQuantity: 102,
    barcode: "123456789012",
    category: "Christmas Balls",
    dimensions: "66 × 44 × 37",
    cartons: 17,
    boxesPerCarton: 6,
    productsPerBox: 102
  },
  {
    id: 2,
    itemNo: "AR13-1254T04-R",
    description: "10CM BALL SET, 4PCS/PAPER TRAY WITH PET COVER, COLOR: RED",
    unitPrice: 416.44,
    inventoryQuantity: 264,
    barcode: "123456789013",
    category: "Christmas Balls",
    dimensions: "62 × 42 × 42",
    cartons: 11,
    boxesPerCarton: 24,
    productsPerBox: 264
  },
  {
    id: 3,
    itemNo: "2FT Christmas Tree",
    description: "2FT Christmas Tree",
    unitPrice: 112.00,
    inventoryQuantity: 3,
    barcode: "TREE001",
    category: "Christmas Trees",
    dimensions: "2 × 2 × 2",
    cartons: 3,
    boxesPerCarton: 1,
    productsPerBox: 3
  }
];

const mockCustomers = [
  { id: 1, name: "John Smith", phone: "+1234567890", company: "ABC Corp" },
  { id: 2, name: "Sarah Johnson", phone: "+1234567891", company: "XYZ Ltd" },
  { id: 3, name: "Walk-in Customer", phone: null, company: null }
];

const mockSalespersons = [
  { id: 1, name: "David Brown" },
  { id: 2, name: "Emma Davis" },
  { id: 3, name: "James Miller" }
];

export const api = {
  // Products
  async getProducts() {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      console.error('API Error - using mock data:', error);
      return mockProducts;
    }
  },

  async searchProducts(searchTerm) {
    try {
      const response = await apiClient.get(`/products/search?searchTerm=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error('Search API Error - using local search:', error);
      const products = await this.getProducts();
      return products.filter(product => 
        product.itemNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  },

  async scanBarcode(barcode) {
    try {
      const response = await apiClient.post('/barcode/scan', { barcode });
      return response.data;
    } catch (error) {
      console.error('Barcode API Error - using local search:', error);
      const products = await this.getProducts();
      return products.find(product => product.barcode === barcode) || null;
    }
  },

  async createProduct(productData) {
    try {
      const response = await apiClient.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Create product error:', error);
      // Mock success for development
      return { ...productData, id: Date.now() };
    }
  },

  async updateProduct(productId, productData) {
    try {
      const response = await apiClient.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      return { ...productData, id: productId };
    }
  },

  // Customers
  async getCustomers() {
    try {
      const response = await apiClient.get('/customers');
      return response.data;
    } catch (error) {
      console.error('Customers API Error - using mock data:', error);
      return mockCustomers;
    }
  },

  // Salespersons
  async getSalespersons() {
    try {
      const response = await apiClient.get('/salespersons');
      return response.data;
    } catch (error) {
      console.error('Salespersons API Error - using mock data:', error);
      return mockSalespersons;
    }
  },

  // Orders
  async createOrder(orderData) {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
      // Mock success for development
      return {
        id: 'ORD-' + Date.now(),
        ...orderData,
        timestamp: new Date().toISOString()
      };
    }
  },

  async getAllOrders() {
    try {
      const response = await apiClient.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Orders API Error:', error);
      return [];
    }
  }
};