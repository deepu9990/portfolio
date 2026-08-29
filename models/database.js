const { v4: uuidv4 } = require('uuid');

// Mock database implementation
class MockDatabase {
  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.productCategories = new Map();
    this.productTypes = new Map();
    
    // Initialize with some default data
    this.initializeDefaultData();
  }

  initializeDefaultData() {
    // Create default categories
    const defaultCategories = [
      { name: 'General', slug: 'general', description: 'General products' },
      { name: 'Electronics', slug: 'electronics', description: 'Electronic products' },
      { name: 'Clothing', slug: 'clothing', description: 'Clothing and apparel' },
      { name: 'Books', slug: 'books', description: 'Books and literature' },
      { name: 'Home & Garden', slug: 'home-garden', description: 'Home and garden products' },
      { name: 'Sports', slug: 'sports', description: 'Sports and fitness products' }
    ];

    for (const categoryData of defaultCategories) {
      const category = { 
        id: uuidv4(), 
        ...categoryData, 
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.categories.set(category.id, category);
    }

    // Create default product types
    const defaultProductTypes = [
      { name: 'General', slug: 'general', description: 'General product type' },
      { name: 'Physical', slug: 'physical', description: 'Physical products' },
      { name: 'Digital', slug: 'digital', description: 'Digital products' },
      { name: 'Service', slug: 'service', description: 'Service products' }
    ];

    for (const typeData of defaultProductTypes) {
      const type = { 
        id: uuidv4(), 
        ...typeData, 
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.productTypes.set(type.id, type);
    }

    console.log(`[DB] Initialized with ${this.categories.size} categories and ${this.productTypes.size} product types`);
  }

  // Product operations
  async findProduct(id) {
    return this.products.get(id) || null;
  }

  async findProductsByParentId(parentId) {
    return Array.from(this.products.values()).filter(product => 
      product.parentProductId === parentId
    );
  }

  async createProduct(data) {
    const product = { 
      id: data.id || uuidv4(), 
      ...data, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.set(product.id, product);
    console.log(`[DB] Created product: ${product.id} - ${product.title}`);
    return product;
  }

  async updateProduct(id, data) {
    const existing = this.products.get(id);
    if (!existing) {
      return null;
    }
    
    const updated = { 
      ...existing, 
      ...data, 
      id: existing.id, // Don't allow ID changes
      updatedAt: new Date()
    };
    this.products.set(id, updated);
    console.log(`[DB] Updated product: ${id} - ${updated.title}`);
    return updated;
  }

  async deleteProduct(id) {
    const deleted = this.products.delete(id);
    if (deleted) {
      console.log(`[DB] Deleted product: ${id}`);
    }
    return deleted;
  }

  // Category operations
  async findCategory(criteria) {
    return Array.from(this.categories.values()).find(category => 
      Object.keys(criteria).every(key => category[key] === criteria[key])
    ) || null;
  }

  async findCategoryByName(name) {
    return this.findCategory({ name });
  }

  async createCategory(data) {
    const category = { 
      id: data.id || uuidv4(), 
      ...data, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.categories.set(category.id, category);
    console.log(`[DB] Created category: ${category.id} - ${category.name}`);
    return category;
  }

  async updateCategory(id, data) {
    const existing = this.categories.get(id);
    if (!existing) {
      return null;
    }
    
    const updated = { 
      ...existing, 
      ...data, 
      id: existing.id,
      updatedAt: new Date()
    };
    this.categories.set(id, updated);
    console.log(`[DB] Updated category: ${id} - ${updated.name}`);
    return updated;
  }

  async getAllCategories() {
    return Array.from(this.categories.values());
  }

  // Product Type operations
  async findProductType(criteria) {
    return Array.from(this.productTypes.values()).find(type => 
      Object.keys(criteria).every(key => type[key] === criteria[key])
    ) || null;
  }

  async createProductType(data) {
    const type = { 
      id: data.id || uuidv4(), 
      ...data, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.productTypes.set(type.id, type);
    console.log(`[DB] Created product type: ${type.id} - ${type.name}`);
    return type;
  }

  async updateProductType(id, data) {
    const existing = this.productTypes.get(id);
    if (!existing) {
      return null;
    }
    
    const updated = { 
      ...existing, 
      ...data, 
      id: existing.id,
      updatedAt: new Date()
    };
    this.productTypes.set(id, updated);
    console.log(`[DB] Updated product type: ${id} - ${updated.name}`);
    return updated;
  }

  async getAllProductTypes() {
    return Array.from(this.productTypes.values());
  }

  // Product-Category relationship operations
  async findProductCategoryRelationship(productId, categoryId) {
    const key = `${productId}-${categoryId}`;
    return this.productCategories.get(key) || null;
  }

  async createProductCategoryRelationship(productId, categoryId) {
    const key = `${productId}-${categoryId}`;
    const relationship = {
      id: uuidv4(),
      productId,
      categoryId,
      createdAt: new Date()
    };
    this.productCategories.set(key, relationship);
    console.log(`[DB] Created product-category relationship: ${productId} -> ${categoryId}`);
    return relationship;
  }

  async getProductCategoryRelationships(productId) {
    return Array.from(this.productCategories.values()).filter(rel => 
      rel.productId === productId
    );
  }

  async getCategoryProductRelationships(categoryId) {
    return Array.from(this.productCategories.values()).filter(rel => 
      rel.categoryId === categoryId
    );
  }

  async deleteProductCategoryRelationship(productId, categoryId) {
    const key = `${productId}-${categoryId}`;
    const deleted = this.productCategories.delete(key);
    if (deleted) {
      console.log(`[DB] Deleted product-category relationship: ${productId} -> ${categoryId}`);
    }
    return deleted;
  }

  // Database statistics
  async getStats() {
    return {
      products: this.products.size,
      categories: this.categories.size,
      productTypes: this.productTypes.size,
      relationships: this.productCategories.size
    };
  }

  // Reset database (useful for testing)
  async reset() {
    this.products.clear();
    this.categories.clear();
    this.productCategories.clear();
    this.productTypes.clear();
    this.initializeDefaultData();
    console.log('[DB] Database reset completed');
  }

  // Export data (useful for debugging)
  async exportData() {
    return {
      products: Array.from(this.products.values()),
      categories: Array.from(this.categories.values()),
      productTypes: Array.from(this.productTypes.values()),
      relationships: Array.from(this.productCategories.values())
    };
  }
}

// Create singleton instance
const db = new MockDatabase();

module.exports = db;