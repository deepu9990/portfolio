const ShopifyService = require('../services/shopify_sync');
const Product = require('../models/Product');
const db = require('../models/database');

describe('ShopifyService', () => {
  let shopifyService;

  beforeEach(async () => {
    shopifyService = new ShopifyService();
    await db.reset(); // Reset database before each test
  });

  describe('determineCategoryFromProduct', () => {
    test('should determine category from product_type', async () => {
      const productData = {
        id: '123',
        product_type: 'Electronics',
        vendor: 'Apple',
        tags: []
      };

      const category = await shopifyService.determineCategoryFromProduct(productData);
      expect(category.name).toBe('Electronics');
    });

    test('should determine category from vendor', async () => {
      const productData = {
        id: '123',
        product_type: 'Unknown',
        vendor: 'Nike Sports',
        tags: []
      };

      const category = await shopifyService.determineCategoryFromProduct(productData);
      expect(category.name).toBe('Sports');
    });

    test('should determine category from tags', async () => {
      const productData = {
        id: '123',
        product_type: 'Unknown',
        vendor: 'Generic',
        tags: ['clothing', 'fashion']
      };

      const category = await shopifyService.determineCategoryFromProduct(productData);
      expect(category.name).toBe('Clothing');
    });

    test('should return General category for unknown product', async () => {
      const productData = {
        id: '123',
        product_type: 'Unknown',
        vendor: 'Unknown',
        tags: []
      };

      const category = await shopifyService.determineCategoryFromProduct(productData);
      expect(category.name).toBe('General');
    });
  });

  describe('findOrCreateProductType', () => {
    test('should create new product type if not exists', async () => {
      const productData = {
        product_type: 'Custom Type'
      };

      const type = await shopifyService.findOrCreateProductType(productData);
      expect(type.name).toBe('Custom Type');
      expect(type.slug).toBe('custom-type');
    });

    test('should return existing product type', async () => {
      const productData = {
        product_type: 'General'
      };

      const type = await shopifyService.findOrCreateProductType(productData);
      expect(type.name).toBe('General');
    });

    test('should return General type for empty product_type', async () => {
      const productData = {};

      const type = await shopifyService.findOrCreateProductType(productData);
      expect(type.name).toBe('General');
    });
  });

  describe('validateRelationshipData', () => {
    test('should validate correct relationship data', () => {
      const productData = { id: '123' };
      const categoryData = { id: '456' };

      const result = shopifyService.validateRelationshipData(productData, categoryData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should return errors for invalid data', () => {
      const productData = {};
      const categoryData = {};

      const result = shopifyService.validateRelationshipData(productData, categoryData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });

  describe('createDynamicCategoryRelationship', () => {
    test('should create new category relationship', async () => {
      const productData = {
        id: '123',
        title: 'Test Product',
        product_type: 'Electronics',
        vendor: 'Apple',
        tags: []
      };

      const relationship = await shopifyService.createDynamicCategoryRelationship(productData);
      expect(relationship.productId).toBe('123');
      expect(relationship.categoryId).toBeDefined();
    });

    test('should return existing relationship if already exists', async () => {
      const productData = {
        id: '123',
        title: 'Test Product',
        product_type: 'Electronics',
        vendor: 'Apple',
        tags: []
      };

      const relationship1 = await shopifyService.createDynamicCategoryRelationship(productData);
      const relationship2 = await shopifyService.createDynamicCategoryRelationship(productData);
      
      expect(relationship1.id).toBe(relationship2.id);
    });

    test('should throw error for invalid product data', async () => {
      const productData = {
        title: 'Test Product',
        // Missing ID
        product_type: 'Electronics'
      };

      await expect(shopifyService.createDynamicCategoryRelationship(productData))
        .rejects.toThrow('Validation failed');
    });
  });

  describe('createCategoryMapping', () => {
    test('should create category mapping for multiple products', async () => {
      const productsData = [
        { id: '1', product_type: 'Electronics' },
        { id: '2', product_type: 'Clothing' },
        { id: '3', product_type: 'Books' }
      ];

      const mappings = await shopifyService.createCategoryMapping(productsData);
      expect(Object.keys(mappings)).toHaveLength(3);
      expect(mappings['1'].name).toBe('Electronics');
      expect(mappings['2'].name).toBe('Clothing');
      expect(mappings['3'].name).toBe('Books');
    });

    test('should handle empty products array', async () => {
      const productsData = [];

      const mappings = await shopifyService.createCategoryMapping(productsData);
      expect(Object.keys(mappings)).toHaveLength(0);
    });
  });

  describe('createBulkProductCategories', () => {
    test('should create bulk category relationships', async () => {
      const productsData = [
        { id: '1', product_type: 'Electronics' },
        { id: '2', product_type: 'Clothing' }
      ];

      const result = await shopifyService.createBulkProductCategories(productsData);
      expect(result.successful).toHaveLength(2);
      expect(result.errors).toHaveLength(0);
    });

    test('should handle some failures gracefully', async () => {
      const productsData = [
        { id: '1', product_type: 'Electronics' },
        { product_type: 'Clothing' }, // Missing ID
        { id: '3', product_type: 'Books' }
      ];

      const result = await shopifyService.createBulkProductCategories(productsData);
      expect(result.successful).toHaveLength(2);
      expect(result.errors).toHaveLength(1);
    });
  });

  describe('upsertMainProductOptimized', () => {
    test('should create new product', async () => {
      const shopifyProductData = {
        id: '123',
        title: 'Test Product',
        body_html: 'Test description',
        vendor: 'Test Vendor',
        product_type: 'Electronics',
        tags: 'tag1,tag2',
        handle: 'test-product',
        status: 'active'
      };

      const product = await shopifyService.upsertMainProductOptimized(shopifyProductData);
      expect(product.title).toBe('Test Product');
      expect(product.vendor).toBe('Test Vendor');
      expect(product.tags).toEqual(['tag1', 'tag2']);
    });

    test('should update existing product', async () => {
      const shopifyProductData = {
        id: '123',
        title: 'Test Product',
        body_html: 'Test description',
        vendor: 'Test Vendor',
        product_type: 'Electronics',
        tags: 'tag1,tag2',
        handle: 'test-product',
        status: 'active'
      };

      // Create first time
      const product1 = await shopifyService.upsertMainProductOptimized(shopifyProductData);
      
      // Update with new data
      shopifyProductData.title = 'Updated Product';
      const product2 = await shopifyService.upsertMainProductOptimized(shopifyProductData);
      
      expect(product1.id).toBe(product2.id);
      expect(product2.title).toBe('Updated Product');
    });
  });

  describe('upsertVariantOptimized', () => {
    test('should create variant with inherited properties', async () => {
      const parentProduct = {
        id: '123',
        title: 'Parent Product',
        vendor: 'Test Vendor',
        product_type: 'Electronics',
        tags: ['tag1', 'tag2'],
        productTypeId: 'type-123'
      };

      const shopifyVariantData = {
        id: '456',
        title: 'Variant 1',
        sku: 'SKU-001',
        price: '19.99'
      };

      const variant = await shopifyService.upsertVariantOptimized(parentProduct, shopifyVariantData);
      expect(variant.title).toBe('Parent Product - Variant 1');
      expect(variant.parentProductId).toBe('123');
      expect(variant.vendor).toBe('Test Vendor');
      expect(variant.product_type).toBe('Electronics');
      expect(variant.tags).toEqual(['tag1', 'tag2']);
      expect(variant.isVariant).toBe(true);
    });
  });

  describe('syncProducts', () => {
    test('should sync products and variants', async () => {
      const shopifyProducts = [
        {
          id: '1',
          title: 'Product 1',
          body_html: 'Description 1',
          vendor: 'Vendor 1',
          product_type: 'Electronics',
          tags: 'tag1,tag2',
          handle: 'product-1',
          status: 'active',
          variants: [
            {
              id: '1-1',
              title: 'Variant 1',
              sku: 'SKU-1-1',
              price: '19.99'
            }
          ]
        },
        {
          id: '2',
          title: 'Product 2',
          body_html: 'Description 2',
          vendor: 'Vendor 2',
          product_type: 'Clothing',
          tags: 'tag3,tag4',
          handle: 'product-2',
          status: 'active',
          variants: []
        }
      ];

      const results = await shopifyService.syncProducts(shopifyProducts);
      expect(results.products).toHaveLength(2);
      expect(results.variants).toHaveLength(1);
      expect(results.errors).toHaveLength(0);
    });

    test('should handle sync errors gracefully', async () => {
      const shopifyProducts = [
        {
          id: '1',
          title: 'Product 1',
          body_html: 'Description 1',
          vendor: 'Vendor 1',
          product_type: 'Electronics',
          tags: 'tag1,tag2',
          handle: 'product-1',
          status: 'active',
          variants: []
        },
        {
          // Missing required fields
          id: '2',
          body_html: 'Description 2',
          handle: 'product-2',
          status: 'active'
        }
      ];

      const results = await shopifyService.syncProducts(shopifyProducts);
      expect(results.products).toHaveLength(1);
      expect(results.errors).toHaveLength(1);
    });
  });

  describe('getSyncStats', () => {
    test('should return sync statistics', async () => {
      const stats = await shopifyService.getSyncStats();
      expect(stats).toHaveProperty('totalProducts');
      expect(stats).toHaveProperty('totalCategories');
      expect(stats).toHaveProperty('totalProductTypes');
      expect(stats).toHaveProperty('totalRelationships');
    });
  });
});

// Test runner for Node.js environment
function runTests() {
  console.log('Running Shopify Service Tests...\n');
  
  // Simple test runner implementation
  const describe = (name, fn) => {
    console.log(`\n${name}:`);
    fn();
  };

  const test = (name, fn) => {
    try {
      fn();
      console.log(`  ✓ ${name}`);
    } catch (error) {
      console.log(`  ✗ ${name}`);
      console.log(`    Error: ${error.message}`);
    }
  };

  const expect = (actual) => ({
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toEqual: (expected) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toHaveLength: (expected) => {
      if (actual.length !== expected) {
        throw new Error(`Expected length ${expected}, got ${actual.length}`);
      }
    },
    toHaveProperty: (prop) => {
      if (!(prop in actual)) {
        throw new Error(`Expected object to have property ${prop}`);
      }
    },
    toBeDefined: () => {
      if (actual === undefined) {
        throw new Error('Expected value to be defined');
      }
    },
    rejects: {
      toThrow: async (message) => {
        try {
          await actual;
          throw new Error('Expected promise to reject');
        } catch (error) {
          if (message && !error.message.includes(message)) {
            throw new Error(`Expected error message to contain "${message}", got "${error.message}"`);
          }
        }
      }
    }
  });

  global.describe = describe;
  global.test = test;
  global.expect = expect;
  global.beforeEach = (fn) => {}; // Mock for this simple runner

  // Run basic functionality tests
  describe('Basic ShopifyService Tests', () => {
    test('should create ShopifyService instance', () => {
      const service = new ShopifyService();
      expect(service).toBeDefined();
    });

    test('should have required methods', () => {
      const service = new ShopifyService();
      expect(service.determineCategoryFromProduct).toBeDefined();
      expect(service.findOrCreateProductType).toBeDefined();
      expect(service.validateRelationshipData).toBeDefined();
      expect(service.createDynamicCategoryRelationship).toBeDefined();
      expect(service.createCategoryMapping).toBeDefined();
      expect(service.createBulkProductCategories).toBeDefined();
      expect(service.upsertMainProductOptimized).toBeDefined();
      expect(service.upsertVariantOptimized).toBeDefined();
      expect(service.syncProducts).toBeDefined();
      expect(service.getSyncStats).toBeDefined();
    });
  });
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests };
}

// Auto-run if this file is executed directly
if (require.main === module) {
  runTests();
}