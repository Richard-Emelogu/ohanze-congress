class Order {
  constructor(data) {
    this.id = Date.now().toString();
    this.customerName = data.customerName;
    this.email = data.email;
    this.phone = data.phone;
    this.items = data.items;
    this.totalAmount = data.totalAmount;
    this.status = data.status || 'pending';
    this.paymentStatus = data.paymentStatus || 'pending';
    this.shippingAddress = data.shippingAddress;
    this.createdAt = new Date();
  }

  static findAll() {
    const db = global.db.read();
    return db.orders;
  }

  static findById(id) {
    const db = global.db.read();
    return db.orders.find(o => o.id === id);
  }

  static updateById(id, updates) {
    const db = global.db.read();
    const index = db.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      db.orders[index] = { ...db.orders[index], ...updates };
      global.db.write(db);
      return db.orders[index];
    }
    return null;
  }

  static deleteById(id) {
    const db = global.db.read();
    db.orders = db.orders.filter(o => o.id !== id);
    global.db.write(db);
  }

  static getStats() {
    const db = global.db.read();
    const orders = db.orders;
    
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      totalRevenue: orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.totalAmount, 0)
    };
  }

  save() {
    const db = global.db.read();
    db.orders.push(this);
    global.db.write(db);
    return this;
  }
}

module.exports = Order;