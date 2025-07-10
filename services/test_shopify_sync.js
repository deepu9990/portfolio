/**
 * Simple test suite for the optimized Shopify sync service
 * Validates key functionality and performance optimizations
 */

const { ShopifySyncOptimized } = require('./shopify_sync_optimized');
const { createLogger, LOG_LEVELS } = require('../utils/logger');
const { PerformanceMonitor } = require('../utils/performance');

// Test helpers
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('🧪 Running Shopify Sync Service Tests\n');
    
    for (const test of this.tests) {
      try {
        await test.fn();
        console.log(`✅ ${test.name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${test.name}: ${error.message}`);
        this.failed++;
      }
    }

    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
    return this.failed === 0;
  }
}

// Mock implementations for testing
class MockDatabase {
  constructor() {
    this.Product = {
      bulkCreate: async (products, options) => ({ insertedCount: products.length })
    };
    this.Variant = {
      bulkCreate: async (variants, options) => ({ insertedCount: variants.length })
    };
  }
}

class MockShopifyApi {
  async graphql(query, variables = {}) {
    // Return minimal mock data
    return {
      data: {
        products: {
          edges: [
            {
              node: {
                id: 'test_product_1',
                title: 'Test Product',
                description: 'Test Description',
                vendor: 'Test Vendor',
                productType: 'Test Type',
                handle: 'test-product',
                status: 'ACTIVE',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                variants: {
                  edges: [
                    {
                      node: {
                        id: 'test_variant_1',
                        title: 'Default',
                        price: '10.00',
                        sku: 'TEST_SKU',
                        inventoryQuantity: 10,
                        weight: 1.0
                      }
                    }
                  ]
                }
              }
            }
          ],
          pageInfo: { hasNextPage: false }
        }
      },
      headers: { 'x-shopify-shop-api-call-limit': '1/40' }
    };
  }
}

// Test suite
const runner = new TestRunner();

// Test 1: Logger optimization
runner.test('Logger - Configurable log levels', async () => {
  const logger = createLogger({ level: LOG_LEVELS.ERROR, silent: true });
  
  // These should not produce output due to log level
  logger.debug('Debug message');
  logger.info('Info message');
  logger.warn('Warning message');
  
  // This should work but be silent
  logger.error('Error message');
  
  // Test fast logging methods
  logger.fastInfo('Fast info');
  logger.fastError('Fast error');
  
  // Test conditional logging
  let debugCalled = false;
  logger.ifDebug(() => { debugCalled = true; });
  
  if (debugCalled) {
    throw new Error('Debug callback should not have been called');
  }
});

// Test 2: Performance monitoring
runner.test('Performance Monitor - Timer and metrics', async () => {
  const monitor = new PerformanceMonitor();
  
  // Test timer
  monitor.startTimer('test_operation');
  await new Promise(resolve => setTimeout(resolve, 10));
  const result = monitor.endTimer('test_operation');
  
  if (!result || result.duration < 5) {
    throw new Error('Timer should measure at least 5ms');
  }
  
  // Test counter
  monitor.incrementCounter('test_counter', 5);
  if (monitor.getCounter('test_counter') !== 5) {
    throw new Error('Counter should be 5');
  }
  
  // Test memory snapshot
  const snapshot = monitor.takeMemorySnapshot('test_snapshot');
  if (!snapshot || !snapshot.memory) {
    throw new Error('Memory snapshot should be captured');
  }
});

// Test 3: Service initialization
runner.test('Service - Initialization and configuration', async () => {
  const service = new ShopifySyncOptimized({
    shopifyApi: new MockShopifyApi(),
    database: new MockDatabase(),
    logLevel: LOG_LEVELS.WARN,
    batchSize: 100,
    chunkSize: 50
  });
  
  if (service.config.batchSize !== 100) {
    throw new Error('Batch size should be 100');
  }
  
  if (service.config.chunkSize !== 50) {
    throw new Error('Chunk size should be 50');
  }
  
  // Check that caches are initialized as Maps
  if (!(service.productCache instanceof Map)) {
    throw new Error('Product cache should be a Map');
  }
});

// Test 4: Full sync functionality
runner.test('Service - Full sync operation', async () => {
  const service = new ShopifySyncOptimized({
    shopifyApi: new MockShopifyApi(),
    database: new MockDatabase(),
    logLevel: LOG_LEVELS.SILENT // Silent for testing
  });
  
  const result = await service.sync('full');
  
  if (!result || typeof result.products !== 'number') {
    throw new Error('Sync should return valid result with products count');
  }
  
  if (!result.duration || result.duration <= 0) {
    throw new Error('Sync should measure execution time');
  }
  
  if (result.type !== 'full') {
    throw new Error('Sync type should be "full"');
  }
});

// Test 5: Memory management
runner.test('Service - Memory management and caching', async () => {
  const service = new ShopifySyncOptimized({
    shopifyApi: new MockShopifyApi(),
    database: new MockDatabase(),
    logLevel: LOG_LEVELS.SILENT,
    memoryThreshold: 100 // Very low threshold for testing
  });
  
  // Add some data to caches
  service.productCache.set('test1', { id: 'test1' });
  service.variantCache.set('test2', { id: 'test2' });
  service.costCache.set('test3', { cost: 10.0 });
  
  if (service.productCache.size === 0) {
    throw new Error('Cache should contain test data');
  }
  
  // Clear caches
  service._clearCaches();
  
  if (service.productCache.size !== 0 || service.variantCache.size !== 0) {
    throw new Error('Caches should be cleared');
  }
});

// Test 6: Rate limiting
runner.test('Service - Rate limiting functionality', async () => {
  const service = new ShopifySyncOptimized({
    shopifyApi: new MockShopifyApi(),
    database: new MockDatabase(),
    logLevel: LOG_LEVELS.SILENT
  });
  
  // Test rate limit state initialization
  if (!service.rateLimitState || typeof service.rateLimitState.remaining !== 'number') {
    throw new Error('Rate limit state should be initialized');
  }
  
  // Test rate limit header update
  service._updateRateLimitFromHeaders({
    'x-shopify-shop-api-call-limit': '35/40',
    'retry-after': '2'
  });
  
  if (service.rateLimitState.remaining !== 5) {
    throw new Error('Rate limit remaining should be updated to 5');
  }
});

// Test 7: Error handling and retry logic
runner.test('Service - Error handling and retry logic', async () => {
  let callCount = 0;
  const failingApi = {
    graphql: async () => {
      callCount++;
      if (callCount < 3) {
        throw new Error('Temporary failure');
      }
      return new MockShopifyApi().graphql();
    }
  };
  
  const service = new ShopifySyncOptimized({
    shopifyApi: failingApi,
    database: new MockDatabase(),
    logLevel: LOG_LEVELS.SILENT,
    maxRetries: 3,
    baseDelayMs: 10 // Fast retry for testing
  });
  
  // This should succeed after retries
  const query = service._buildProductQuery();
  const result = await service._executeGraphQLWithRetry(query);
  
  if (!result || !result.data) {
    throw new Error('Request should succeed after retries');
  }
  
  if (callCount !== 3) {
    throw new Error(`Expected 3 API calls, got ${callCount}`);
  }
});

// Test 8: Performance metrics collection
runner.test('Service - Performance metrics collection', async () => {
  const service = new ShopifySyncOptimized({
    shopifyApi: new MockShopifyApi(),
    database: new MockDatabase(),
    logLevel: LOG_LEVELS.SILENT
  });
  
  // Run a sync to generate metrics
  await service.sync('full');
  
  const metrics = service.getMetrics();
  
  if (!metrics || typeof metrics.apiCalls !== 'number') {
    throw new Error('Metrics should include API calls count');
  }
  
  if (typeof metrics.dbQueries !== 'number') {
    throw new Error('Metrics should include database queries count');
  }
  
  if (metrics.apiCalls < 1) {
    throw new Error('Should have made at least 1 API call');
  }
  
  if (metrics.dbQueries < 1) {
    throw new Error('Should have made at least 1 database query');
  }
});

// Test 9: Bulk operations optimization
runner.test('Service - Bulk database operations', async () => {
  let bulkCreateCalls = 0;
  const trackingDatabase = {
    Product: {
      bulkCreate: async (products, options) => {
        bulkCreateCalls++;
        if (!options.updateOnDuplicate) {
          throw new Error('Should use updateOnDuplicate option');
        }
        if (options.returning !== false) {
          throw new Error('Should set returning to false for performance');
        }
        if (options.logging !== false) {
          throw new Error('Should disable logging for performance');
        }
        return { insertedCount: products.length };
      }
    },
    Variant: {
      bulkCreate: async (variants, options) => {
        bulkCreateCalls++;
        return { insertedCount: variants.length };
      }
    }
  };
  
  const service = new ShopifySyncOptimized({
    shopifyApi: new MockShopifyApi(),
    database: trackingDatabase,
    logLevel: LOG_LEVELS.SILENT
  });
  
  await service.sync('full');
  
  if (bulkCreateCalls < 2) {
    throw new Error('Should have made bulk create calls for products and variants');
  }
});

// Test 10: Chunking for memory efficiency
runner.test('Service - Memory-efficient chunking', async () => {
  const service = new ShopifySyncOptimized({
    shopifyApi: new MockShopifyApi(),
    database: new MockDatabase(),
    logLevel: LOG_LEVELS.SILENT,
    chunkSize: 2 // Small chunk size for testing
  });
  
  // Test array chunking utility
  const testArray = [1, 2, 3, 4, 5, 6, 7];
  const chunks = service._chunkArray(testArray, 3);
  
  if (chunks.length !== 3) {
    throw new Error('Should create 3 chunks');
  }
  
  if (chunks[0].length !== 3 || chunks[1].length !== 3 || chunks[2].length !== 1) {
    throw new Error('Chunks should have correct sizes');
  }
});

// Run all tests
if (require.main === module) {
  runner.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { TestRunner, MockDatabase, MockShopifyApi };