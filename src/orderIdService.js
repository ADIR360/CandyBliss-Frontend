// Order ID Service for Candy Bliss
// This service manages sequential order IDs starting from 01

class OrderIdService {
  constructor() {
    // Get the last order number from localStorage or start from 0
    this.lastOrderNumber = parseInt(localStorage.getItem('candybliss_last_order_number') || '0');
  }

  // Generate the next sequential order ID
  generateOrderId() {
    this.lastOrderNumber += 1;
    
    // Save the new order number to localStorage
    localStorage.setItem('candybliss_last_order_number', this.lastOrderNumber.toString());
    
    // Format order ID as CB_001, CB_002, etc.
    const formattedNumber = this.lastOrderNumber.toString().padStart(3, '0');
    return `CB_${formattedNumber}`;
  }

  // Get the current order number (for display purposes)
  getCurrentOrderNumber() {
    return this.lastOrderNumber;
  }

  // Reset order numbers (use with caution)
  resetOrderNumbers() {
    this.lastOrderNumber = 0;
    localStorage.setItem('candybliss_last_order_number', '0');
  }
}

// Create and export a singleton instance
const orderIdService = new OrderIdService();
export default orderIdService; 