const { v4: uuidv4 } = require('uuid');

// Mock database connection
const db = require('./database');

class Product {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.shopifyId = data.shopifyId;
    this.title = data.title;
    this.description = data.description;
    this.vendor = data.vendor;
    this.product_type = data.product_type;
    this.tags = data.tags || [];
    this.productTypeId = data.productTypeId;
    this.handle = data.handle;
    this.status = data.status;
    this.parentProductId = data.parentProductId;
    this.isVariant = data.isVariant || false;
    this.price = data.price;
    this.sku = data.sku;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Model hooks
  async beforeCreate() {
    console.log(`[HOOK] beforeCreate called for product: ${this.title}`);
    // Validate required fields
    if (!this.title) {
      throw new Error('Product title is required');
    }
    if (!this.vendor) {
      throw new Error('Product vendor is required');
    }
    return true;
  }

  async afterCreate() {
    console.log(`[HOOK] afterCreate called for product: ${this.title}`);
    // Log creation
    console.log(`Product created: ${this.id} - ${this.title}`);
    return true;
  }

  async beforeUpdate() {
    console.log(`[HOOK] beforeUpdate called for product: ${this.title}`);
    this.updatedAt = new Date();
    return true;
  }

  async afterUpdate() {
    console.log(`[HOOK] afterUpdate called for product: ${this.title}`);
    return true;
  }

  // Save method that triggers hooks
  async save() {
    if (!this.createdAt) {
      // New product
      await this.beforeCreate();
      const savedProduct = await db.createProduct(this);
      await this.afterCreate();
      return savedProduct;
    } else {
      // Update existing product
      await this.beforeUpdate();
      const updatedProduct = await db.updateProduct(this.id, this);
      await this.afterUpdate();
      return updatedProduct;
    }
  }

  // Static methods
  static async findById(id) {
    return await db.findProduct(id);
  }

  static async findByShopifyId(shopifyId) {
    return await db.findProduct(shopifyId);
  }

  static async create(data) {
    const product = new Product(data);
    return await product.save();
  }

  static async update(id, data) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    
    Object.assign(product, data);
    return await product.save();
  }

  /**
   * Create product category relationship
   */
  async createProductCategoryRelationship(categoryId) {
    try {
      console.log(`[MODEL] Creating product category relationship: ${this.id} -> ${categoryId}`);
      
      // Validate inputs
      if (!this.id) {
        throw new Error('Product ID is required');
      }
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      // Check if relationship already exists
      const existingRelationship = await db.findProductCategoryRelationship(this.id, categoryId);
      if (existingRelationship) {
        console.log(`[MODEL] Relationship already exists: ${this.id} -> ${categoryId}`);
        return existingRelationship;
      }

      // Create new relationship
      const relationship = await db.createProductCategoryRelationship(this.id, categoryId);
      console.log(`[MODEL] Successfully created relationship: ${relationship.id}`);
      
      return relationship;
    } catch (error) {
      console.error(`[MODEL] Error creating product category relationship:`, error);
      throw error;
    }
  }

  /**
   * Create bulk product categories - static method
   */
  static async createBulkProductCategories(productCategoryData) {
    try {
      console.log(`[MODEL] Creating bulk product categories: ${productCategoryData.length} items`);
      
      const results = [];
      const errors = [];

      for (const item of productCategoryData) {
        try {
          const { productId, categoryId } = item;
          
          // Find the product
          const product = await Product.findById(productId);
          if (!product) {
            throw new Error(`Product with id ${productId} not found`);
          }

          // Create relationship using instance method
          const relationship = await product.createProductCategoryRelationship(categoryId);
          results.push(relationship);
        } catch (error) {
          console.error(`[MODEL] Error creating bulk relationship for item:`, item, error);
          errors.push({
            item,
            error: error.message
          });
        }
      }

      console.log(`[MODEL] Bulk category creation completed: ${results.length} successful, ${errors.length} errors`);
      
      return {
        successful: results,
        errors: errors
      };
    } catch (error) {
      console.error(`[MODEL] Error in bulk category creation:`, error);
      throw error;
    }
  }

  /**
   * Get product categories
   */
  async getCategories() {
    try {
      const relationships = await db.getProductCategoryRelationships(this.id);
      const categories = [];
      
      for (const rel of relationships) {
        const category = await db.findCategory({ id: rel.categoryId });
        if (category) {
          categories.push(category);
        }
      }
      
      return categories;
    } catch (error) {
      console.error(`[MODEL] Error getting product categories:`, error);
      throw error;
    }
  }

  /**
   * Get product type
   */
  async getProductType() {
    try {
      if (!this.productTypeId) {
        return null;
      }
      
      return await db.findProductType({ id: this.productTypeId });
    } catch (error) {
      console.error(`[MODEL] Error getting product type:`, error);
      throw error;
    }
  }

  /**
   * Get variants (for main products)
   */
  async getVariants() {
    try {
      if (this.isVariant) {
        return []; // Variants don't have variants
      }
      
      return await db.findProductsByParentId(this.id);
    } catch (error) {
      console.error(`[MODEL] Error getting product variants:`, error);
      throw error;
    }
  }

  /**
   * Get parent product (for variants)
   */
  async getParentProduct() {
    try {
      if (!this.isVariant || !this.parentProductId) {
        return null;
      }
      
      return await Product.findById(this.parentProductId);
    } catch (error) {
      console.error(`[MODEL] Error getting parent product:`, error);
      throw error;
    }
  }

  /**
   * Validate product data
   */
  validate() {
    const errors = [];
    
    if (!this.title) {
      errors.push('Title is required');
    }
    
    if (!this.vendor) {
      errors.push('Vendor is required');
    }
    
    if (this.isVariant && !this.parentProductId) {
      errors.push('Parent product ID is required for variants');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * To JSON representation
   */
  toJSON() {
    return {
      id: this.id,
      shopifyId: this.shopifyId,
      title: this.title,
      description: this.description,
      vendor: this.vendor,
      product_type: this.product_type,
      tags: this.tags,
      productTypeId: this.productTypeId,
      handle: this.handle,
      status: this.status,
      parentProductId: this.parentProductId,
      isVariant: this.isVariant,
      price: this.price,
      sku: this.sku,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Product;