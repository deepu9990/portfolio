const { v4: uuidv4 } = require('uuid');

// Mock database layer for demonstration
class MockDatabase {
  constructor() {
    this.products = [];
    this.categories = [];
    this.productCategories = [];
    this.productTypes = [];
  }

  async findProduct(id) {
    return this.products.find(p => p.id === id);
  }

  async createProduct(data) {
    const product = { id: uuidv4(), ...data, createdAt: new Date() };
    this.products.push(product);
    return product;
  }

  async updateProduct(id, data) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...data, updatedAt: new Date() };
      return this.products[index];
    }
    return null;
  }

  async findCategory(criteria) {
    return this.categories.find(c => 
      Object.keys(criteria).every(key => c[key] === criteria[key])
    );
  }

  async createCategory(data) {
    const category = { id: uuidv4(), ...data, createdAt: new Date() };
    this.categories.push(category);
    return category;
  }

  async findProductType(criteria) {
    return this.productTypes.find(pt => 
      Object.keys(criteria).every(key => pt[key] === criteria[key])
    );
  }

  async createProductType(data) {
    const type = { id: uuidv4(), ...data, createdAt: new Date() };
    this.productTypes.push(type);
    return type;
  }

  async createProductCategoryRelationship(productId, categoryId) {
    const relationship = {
      id: uuidv4(),
      productId,
      categoryId,
      createdAt: new Date()
    };
    this.productCategories.push(relationship);
    return relationship;
  }

  async findProductCategoryRelationship(productId, categoryId) {
    return this.productCategories.find(pc => 
      pc.productId === productId && pc.categoryId === categoryId
    );
  }
}

// Initialize mock database
const db = new MockDatabase();

// Logger utility
const logger = {
  info: (message, data = {}) => console.log(`[INFO] ${message}`, data),
  error: (message, error = {}) => console.error(`[ERROR] ${message}`, error),
  warn: (message, data = {}) => console.warn(`[WARN] ${message}`, data),
  debug: (message, data = {}) => console.debug(`[DEBUG] ${message}`, data)
};

class ShopifyService {
  constructor() {
    this.db = db;
    this.logger = logger;
  }

  /**
   * Validate relationship data before creation
   */
  validateRelationshipData(productData, categoryData) {
    const errors = [];
    
    if (!productData || !productData.id) {
      errors.push('Product data is required with valid ID');
    }
    
    if (!categoryData || !categoryData.id) {
      errors.push('Category data is required with valid ID');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Determine appropriate category based on product data
   */
  async determineCategoryFromProduct(productData) {
    try {
      const { product_type, vendor, tags = [] } = productData;
      
      // Category mapping logic based on product data
      const categoryMappings = {
        'Electronics': ['electronics', 'tech', 'gadgets'],
        'Clothing': ['apparel', 'fashion', 'clothing'],
        'Books': ['books', 'literature', 'education'],
        'Home & Garden': ['home', 'garden', 'furniture'],
        'Sports': ['sports', 'fitness', 'outdoor']
      };

      // Check product_type first
      if (product_type) {
        for (const [categoryName, keywords] of Object.entries(categoryMappings)) {
          if (keywords.some(keyword => 
            product_type.toLowerCase().includes(keyword.toLowerCase())
          )) {
            return await this.findOrCreateCategory(categoryName);
          }
        }
      }

      // Check vendor
      if (vendor) {
        for (const [categoryName, keywords] of Object.entries(categoryMappings)) {
          if (keywords.some(keyword => 
            vendor.toLowerCase().includes(keyword.toLowerCase())
          )) {
            return await this.findOrCreateCategory(categoryName);
          }
        }
      }

      // Check tags
      for (const tag of tags) {
        for (const [categoryName, keywords] of Object.entries(categoryMappings)) {
          if (keywords.some(keyword => 
            tag.toLowerCase().includes(keyword.toLowerCase())
          )) {
            return await this.findOrCreateCategory(categoryName);
          }
        }
      }

      // Default category
      return await this.findOrCreateCategory('General');
    } catch (error) {
      this.logger.error('Error determining category from product', error);
      return await this.findOrCreateCategory('General');
    }
  }

  /**
   * Find or create category
   */
  async findOrCreateCategory(categoryName) {
    try {
      let category = await this.db.findCategory({ name: categoryName });
      
      if (!category) {
        category = await this.db.createCategory({
          name: categoryName,
          slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
          description: `Category for ${categoryName} products`
        });
        this.logger.info(`Created new category: ${categoryName}`);
      }
      
      return category;
    } catch (error) {
      this.logger.error(`Error finding/creating category: ${categoryName}`, error);
      throw error;
    }
  }

  /**
   * Find or create product type
   */
  async findOrCreateProductType(productData) {
    try {
      const { product_type } = productData;
      
      if (!product_type) {
        return await this.findOrCreateProductTypeByName('General');
      }

      let type = await this.db.findProductType({ name: product_type });
      
      if (!type) {
        type = await this.db.createProductType({
          name: product_type,
          slug: product_type.toLowerCase().replace(/\s+/g, '-'),
          description: `Product type for ${product_type}`
        });
        this.logger.info(`Created new product type: ${product_type}`);
      }
      
      return type;
    } catch (error) {
      this.logger.error('Error finding/creating product type', error);
      throw error;
    }
  }

  async findOrCreateProductTypeByName(typeName) {
    try {
      let type = await this.db.findProductType({ name: typeName });
      
      if (!type) {
        type = await this.db.createProductType({
          name: typeName,
          slug: typeName.toLowerCase().replace(/\s+/g, '-'),
          description: `Product type for ${typeName}`
        });
        this.logger.info(`Created new product type: ${typeName}`);
      }
      
      return type;
    } catch (error) {
      this.logger.error(`Error finding/creating product type: ${typeName}`, error);
      throw error;
    }
  }

  /**
   * Create dynamic category relationship with enhanced logic
   */
  async createDynamicCategoryRelationship(productData) {
    try {
      this.logger.info('Creating dynamic category relationship', { productId: productData.id });
      
      // Validate input data
      const validation = this.validateRelationshipData(productData, { id: 'temp' });
      if (!validation.isValid) {
        this.logger.error('Invalid relationship data', validation.errors);
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Determine appropriate category
      const category = await this.determineCategoryFromProduct(productData);
      
      // Check if relationship already exists
      const existingRelationship = await this.db.findProductCategoryRelationship(
        productData.id, 
        category.id
      );
      
      if (existingRelationship) {
        this.logger.info('Category relationship already exists', {
          productId: productData.id,
          categoryId: category.id
        });
        return existingRelationship;
      }

      // Create new relationship
      const relationship = await this.db.createProductCategoryRelationship(
        productData.id,
        category.id
      );
      
      this.logger.info('Successfully created category relationship', {
        productId: productData.id,
        categoryId: category.id,
        categoryName: category.name
      });
      
      return relationship;
    } catch (error) {
      this.logger.error('Error creating dynamic category relationship', error);
      throw error;
    }
  }

  /**
   * Create category mapping for bulk operations
   */
  async createCategoryMapping(productsData) {
    try {
      this.logger.info('Creating category mapping for bulk products', { count: productsData.length });
      
      const mappings = {};
      
      for (const productData of productsData) {
        try {
          const category = await this.determineCategoryFromProduct(productData);
          mappings[productData.id] = category;
        } catch (error) {
          this.logger.error(`Error mapping category for product ${productData.id}`, error);
          // Continue with other products
        }
      }
      
      this.logger.info('Category mapping completed', { mappedCount: Object.keys(mappings).length });
      return mappings;
    } catch (error) {
      this.logger.error('Error creating category mapping', error);
      throw error;
    }
  }

  /**
   * Create bulk product categories using existing model method
   */
  async createBulkProductCategories(productsData) {
    try {
      this.logger.info('Creating bulk product categories', { count: productsData.length });
      
      const results = [];
      const errors = [];
      
      for (const productData of productsData) {
        try {
          const relationship = await this.createDynamicCategoryRelationship(productData);
          results.push(relationship);
        } catch (error) {
          this.logger.error(`Error creating category relationship for product ${productData.id}`, error);
          errors.push({
            productId: productData.id,
            error: error.message
          });
        }
      }
      
      this.logger.info('Bulk category creation completed', {
        successful: results.length,
        errors: errors.length
      });
      
      return {
        successful: results,
        errors: errors
      };
    } catch (error) {
      this.logger.error('Error in bulk category creation', error);
      throw error;
    }
  }

  /**
   * Enhanced main product upsert with better category logic
   */
  async upsertMainProductOptimized(shopifyProductData) {
    try {
      this.logger.info('Upserting main product', { shopifyId: shopifyProductData.id });
      
      // Find existing product
      let product = await this.db.findProduct(shopifyProductData.id);
      
      // Determine product type
      const productType = await this.findOrCreateProductType(shopifyProductData);
      
      const productData = {
        shopifyId: shopifyProductData.id,
        title: shopifyProductData.title,
        description: shopifyProductData.body_html,
        vendor: shopifyProductData.vendor,
        product_type: shopifyProductData.product_type,
        tags: shopifyProductData.tags ? shopifyProductData.tags.split(',').map(tag => tag.trim()) : [],
        productTypeId: productType.id,
        handle: shopifyProductData.handle,
        status: shopifyProductData.status
      };
      
      if (product) {
        // Update existing product
        product = await this.db.updateProduct(product.id, productData);
        this.logger.info('Updated existing product', { productId: product.id });
      } else {
        // Create new product
        product = await this.db.createProduct(productData);
        this.logger.info('Created new product', { productId: product.id });
      }
      
      // Create category relationship
      await this.createDynamicCategoryRelationship(product);
      
      return product;
    } catch (error) {
      this.logger.error('Error upserting main product', error);
      throw error;
    }
  }

  /**
   * Enhanced variant upsert with relationship inheritance
   */
  async upsertVariantOptimized(parentProduct, shopifyVariantData) {
    try {
      this.logger.info('Upserting variant', { 
        parentId: parentProduct.id, 
        variantId: shopifyVariantData.id 
      });
      
      // Find existing variant
      let variant = await this.db.findProduct(shopifyVariantData.id);
      
      const variantData = {
        shopifyId: shopifyVariantData.id,
        title: `${parentProduct.title} - ${shopifyVariantData.title}`,
        sku: shopifyVariantData.sku,
        price: shopifyVariantData.price,
        parentProductId: parentProduct.id,
        productTypeId: parentProduct.productTypeId, // Inherit parent's type
        vendor: parentProduct.vendor, // Inherit parent's vendor
        product_type: parentProduct.product_type, // Inherit parent's type
        tags: parentProduct.tags, // Inherit parent's tags
        isVariant: true
      };
      
      if (variant) {
        // Update existing variant
        variant = await this.db.updateProduct(variant.id, variantData);
        this.logger.info('Updated existing variant', { variantId: variant.id });
      } else {
        // Create new variant
        variant = await this.db.createProduct(variantData);
        this.logger.info('Created new variant', { variantId: variant.id });
      }
      
      // Inherit parent's category relationships
      await this.inheritParentCategoryRelationships(parentProduct, variant);
      
      return variant;
    } catch (error) {
      this.logger.error('Error upserting variant', error);
      throw error;
    }
  }

  /**
   * Inherit parent category relationships for variants
   */
  async inheritParentCategoryRelationships(parentProduct, variant) {
    try {
      this.logger.info('Inheriting parent category relationships', {
        parentId: parentProduct.id,
        variantId: variant.id
      });
      
      // For this demo, we'll create the same category relationship as parent
      await this.createDynamicCategoryRelationship(variant);
      
      this.logger.info('Successfully inherited category relationships');
    } catch (error) {
      this.logger.error('Error inheriting parent category relationships', error);
      throw error;
    }
  }

  /**
   * Main sync method orchestrating the entire process
   */
  async syncProducts(shopifyProducts) {
    try {
      this.logger.info('Starting product sync', { count: shopifyProducts.length });
      
      const results = {
        products: [],
        variants: [],
        errors: []
      };
      
      for (const shopifyProduct of shopifyProducts) {
        try {
          // Upsert main product
          const product = await this.upsertMainProductOptimized(shopifyProduct);
          results.products.push(product);
          
          // Upsert variants if they exist
          if (shopifyProduct.variants && shopifyProduct.variants.length > 0) {
            for (const shopifyVariant of shopifyProduct.variants) {
              try {
                const variant = await this.upsertVariantOptimized(product, shopifyVariant);
                results.variants.push(variant);
              } catch (error) {
                this.logger.error(`Error syncing variant ${shopifyVariant.id}`, error);
                results.errors.push({
                  type: 'variant',
                  id: shopifyVariant.id,
                  error: error.message
                });
              }
            }
          }
        } catch (error) {
          this.logger.error(`Error syncing product ${shopifyProduct.id}`, error);
          results.errors.push({
            type: 'product',
            id: shopifyProduct.id,
            error: error.message
          });
        }
      }
      
      this.logger.info('Product sync completed', {
        products: results.products.length,
        variants: results.variants.length,
        errors: results.errors.length
      });
      
      return results;
    } catch (error) {
      this.logger.error('Error in product sync', error);
      throw error;
    }
  }

  /**
   * Get sync statistics
   */
  async getSyncStats() {
    return {
      totalProducts: this.db.products.length,
      totalCategories: this.db.categories.length,
      totalProductTypes: this.db.productTypes.length,
      totalRelationships: this.db.productCategories.length
    };
  }
}

module.exports = ShopifyService;