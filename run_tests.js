const ShopifyService = require('./services/shopify_sync');
const Product = require('./models/Product');
const db = require('./models/database');

async function runBasicTests() {
  console.log('Running Basic Shopify Service Tests...\n');
  
  let passedTests = 0;
  let failedTests = 0;
  
  function test(name, testFn) {
    console.log(`Testing: ${name}`);
    try {
      testFn();
      console.log(`  ✓ PASSED`);
      passedTests++;
    } catch (error) {
      console.log(`  ✗ FAILED: ${error.message}`);
      failedTests++;
    }
  }
  
  async function asyncTest(name, testFn) {
    console.log(`Testing: ${name}`);
    try {
      await testFn();
      console.log(`  ✓ PASSED`);
      passedTests++;
    } catch (error) {
      console.log(`  ✗ FAILED: ${error.message}`);
      failedTests++;
    }
  }
  
  // Reset database
  await db.reset();
  
  const shopifyService = new ShopifyService();
  
  // Test 1: Service instantiation
  test('ShopifyService instantiation', () => {
    if (!shopifyService) {
      throw new Error('ShopifyService should be instantiated');
    }
  });
  
  // Test 2: Required methods exist
  test('Required methods exist', () => {
    const requiredMethods = [
      'determineCategoryFromProduct',
      'findOrCreateProductType',
      'validateRelationshipData',
      'createDynamicCategoryRelationship',
      'createCategoryMapping',
      'createBulkProductCategories',
      'upsertMainProductOptimized',
      'upsertVariantOptimized',
      'syncProducts',
      'getSyncStats'
    ];
    
    for (const method of requiredMethods) {
      if (typeof shopifyService[method] !== 'function') {
        throw new Error(`Method ${method} should exist`);
      }
    }
  });
  
  // Test 3: Category determination from product_type
  await asyncTest('Category determination from product_type', async () => {
    const productData = {
      id: '123',
      product_type: 'Electronics',
      vendor: 'Apple',
      tags: []
    };
    
    const category = await shopifyService.determineCategoryFromProduct(productData);
    if (category.name !== 'Electronics') {
      throw new Error(`Expected Electronics, got ${category.name}`);
    }
  });
  
  // Test 4: Category determination from vendor
  await asyncTest('Category determination from vendor', async () => {
    const productData = {
      id: '123',
      product_type: 'Unknown',
      vendor: 'Nike Sports',
      tags: []
    };
    
    const category = await shopifyService.determineCategoryFromProduct(productData);
    if (category.name !== 'Sports') {
      throw new Error(`Expected Sports, got ${category.name}`);
    }
  });
  
  // Test 5: Product type creation
  await asyncTest('Product type creation', async () => {
    const productData = {
      product_type: 'Custom Type'
    };
    
    const type = await shopifyService.findOrCreateProductType(productData);
    if (type.name !== 'Custom Type') {
      throw new Error(`Expected Custom Type, got ${type.name}`);
    }
    if (type.slug !== 'custom-type') {
      throw new Error(`Expected custom-type slug, got ${type.slug}`);
    }
  });
  
  // Test 6: Validation
  test('Relationship data validation', () => {
    const productData = { id: '123' };
    const categoryData = { id: '456' };
    
    const result = shopifyService.validateRelationshipData(productData, categoryData);
    if (!result.isValid) {
      throw new Error('Valid data should pass validation');
    }
    if (result.errors.length !== 0) {
      throw new Error('Valid data should have no errors');
    }
  });
  
  // Test 7: Invalid validation
  test('Invalid relationship data validation', () => {
    const productData = {};
    const categoryData = {};
    
    const result = shopifyService.validateRelationshipData(productData, categoryData);
    if (result.isValid) {
      throw new Error('Invalid data should fail validation');
    }
    if (result.errors.length !== 2) {
      throw new Error(`Expected 2 errors, got ${result.errors.length}`);
    }
  });
  
  // Test 8: Category relationship creation
  await asyncTest('Category relationship creation', async () => {
    const productData = {
      id: '123',
      title: 'Test Product',
      product_type: 'Electronics',
      vendor: 'Apple',
      tags: []
    };
    
    const relationship = await shopifyService.createDynamicCategoryRelationship(productData);
    if (relationship.productId !== '123') {
      throw new Error(`Expected product ID 123, got ${relationship.productId}`);
    }
    if (!relationship.categoryId) {
      throw new Error('Category ID should be set');
    }
  });
  
  // Test 9: Main product upsert
  await asyncTest('Main product upsert', async () => {
    const shopifyProductData = {
      id: '456',
      title: 'Test Product',
      body_html: 'Test description',
      vendor: 'Test Vendor',
      product_type: 'Electronics',
      tags: 'tag1,tag2',
      handle: 'test-product',
      status: 'active'
    };
    
    const product = await shopifyService.upsertMainProductOptimized(shopifyProductData);
    if (product.title !== 'Test Product') {
      throw new Error(`Expected Test Product, got ${product.title}`);
    }
    if (product.vendor !== 'Test Vendor') {
      throw new Error(`Expected Test Vendor, got ${product.vendor}`);
    }
    if (product.tags.length !== 2) {
      throw new Error(`Expected 2 tags, got ${product.tags.length}`);
    }
  });
  
  // Test 10: Variant upsert
  await asyncTest('Variant upsert', async () => {
    const parentProduct = {
      id: '789',
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
    if (variant.title !== 'Parent Product - Variant 1') {
      throw new Error(`Expected Parent Product - Variant 1, got ${variant.title}`);
    }
    if (variant.parentProductId !== '789') {
      throw new Error(`Expected parent ID 789, got ${variant.parentProductId}`);
    }
    if (!variant.isVariant) {
      throw new Error('Variant should be marked as variant');
    }
  });
  
  // Test 11: Sync statistics
  await asyncTest('Sync statistics', async () => {
    const stats = await shopifyService.getSyncStats();
    if (typeof stats.totalProducts !== 'number') {
      throw new Error('totalProducts should be a number');
    }
    if (typeof stats.totalCategories !== 'number') {
      throw new Error('totalCategories should be a number');
    }
    if (typeof stats.totalProductTypes !== 'number') {
      throw new Error('totalProductTypes should be a number');
    }
    if (typeof stats.totalRelationships !== 'number') {
      throw new Error('totalRelationships should be a number');
    }
  });
  
  // Test results
  console.log('\n' + '='.repeat(50));
  console.log('TEST RESULTS:');
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Total: ${passedTests + failedTests}`);
  console.log('='.repeat(50));
  
  if (failedTests === 0) {
    console.log('🎉 ALL TESTS PASSED!');
  } else {
    console.log(`❌ ${failedTests} tests failed`);
  }
  
  return failedTests === 0;
}

// Run the tests
if (require.main === module) {
  runBasicTests().catch(console.error);
}

module.exports = { runBasicTests };