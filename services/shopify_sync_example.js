/**
 * Example usage of the optimized Shopify sync service
 * Demonstrates configuration, usage patterns, and performance monitoring
 */

const { ShopifySyncOptimized } = require('./shopify_sync_optimized');
const { createLogger, LOG_LEVELS } = require('../utils/logger');
const { PerformanceMonitor } = require('../utils/performance');

// Example configuration for different environments
const configs = {
  development: {
    logLevel: LOG_LEVELS.DEBUG,
    batchSize: 100,
    chunkSize: 50,
    maxRetries: 2,
    memoryThreshold: 200 * 1024 * 1024 // 200MB
  },
  production: {
    logLevel: LOG_LEVELS.INFO,
    batchSize: 250,
    chunkSize: 100,
    maxRetries: 3,
    memoryThreshold: 500 * 1024 * 1024 // 500MB
  },
  performance: {
    logLevel: LOG_LEVELS.WARN, // Minimal logging for maximum performance
    batchSize: 500,
    chunkSize: 200,
    maxRetries: 5,
    memoryThreshold: 1024 * 1024 * 1024 // 1GB
  }
};

// Mock database interface (replace with your actual database implementation)
class MockDatabase {
  constructor() {
    this.Product = {
      bulkCreate: async (products, options) => {
        // Simulate database bulk insert
        console.log(`Mock: Bulk creating ${products.length} products`);
        return { insertedCount: products.length };
      }
    };
    
    this.Variant = {
      bulkCreate: async (variants, options) => {
        // Simulate database bulk insert
        console.log(`Mock: Bulk creating ${variants.length} variants`);
        return { insertedCount: variants.length };
      }
    };
  }
}

// Mock Shopify API interface (replace with your actual Shopify API client)
class MockShopifyApi {
  constructor() {
    this.callCount = 0;
  }

  async graphql(query, variables = {}) {
    this.callCount++;
    
    // Simulate API response time
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));

    // Mock response for different query types
    if (query.includes('getProducts')) {
      return this._mockProductsResponse();
    } else if (query.includes('getVariantsBatch')) {
      return this._mockVariantsResponse();
    } else if (query.includes('getCostData')) {
      return this._mockCostDataResponse();
    }

    return { data: {} };
  }

  _mockProductsResponse() {
    const products = [];
    for (let i = 1; i <= 10; i++) {
      products.push({
        node: {
          id: `product_${i}`,
          title: `Product ${i}`,
          description: `Description for product ${i}`,
          vendor: 'Test Vendor',
          productType: 'Test Type',
          handle: `product-${i}`,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        cursor: `cursor_${i}`
      });
    }

    return {
      data: {
        products: {
          edges: products,
          pageInfo: {
            hasNextPage: false
          }
        }
      },
      headers: {
        'x-shopify-shop-api-call-limit': `${this.callCount}/40`
      }
    };
  }

  _mockVariantsResponse() {
    const products = [];
    for (let i = 1; i <= 5; i++) {
      const variants = [];
      for (let j = 1; j <= 3; j++) {
        variants.push({
          node: {
            id: `variant_${i}_${j}`,
            title: `Variant ${j}`,
            price: (Math.random() * 100 + 10).toFixed(2),
            compareAtPrice: (Math.random() * 120 + 15).toFixed(2),
            sku: `SKU_${i}_${j}`,
            inventoryQuantity: Math.floor(Math.random() * 100),
            weight: Math.random() * 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        });
      }

      products.push({
        node: {
          id: `product_${i}`,
          variants: {
            edges: variants
          }
        }
      });
    }

    return {
      data: {
        products: {
          edges: products
        }
      },
      headers: {
        'x-shopify-shop-api-call-limit': `${this.callCount}/40`
      }
    };
  }

  _mockCostDataResponse() {
    return {
      data: {
        products: {
          edges: [
            {
              node: {
                id: 'product_1',
                variants: {
                  edges: [
                    {
                      node: {
                        id: 'variant_1_1',
                        inventoryItem: {
                          unitCost: {
                            amount: '25.50'
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    };
  }
}

// Example usage functions
class ShopifySyncExample {
  constructor(environment = 'development') {
    this.config = configs[environment];
    this.database = new MockDatabase();
    this.shopifyApi = new MockShopifyApi();
    this.performance = new PerformanceMonitor();
    
    this.syncService = new ShopifySyncOptimized({
      shopifyApi: this.shopifyApi,
      database: this.database,
      ...this.config
    });
  }

  /**
   * Example: Full sync with performance monitoring
   */
  async runFullSyncExample() {
    console.log('\n=== Full Sync Example ===');
    
    try {
      const result = await this.syncService.sync('full');
      
      console.log('Sync completed:', {
        products: result.products,
        variants: result.variants,
        duration: `${result.duration?.toFixed(2)}ms`,
        apiCalls: result.metrics.apiCalls,
        dbQueries: result.metrics.dbQueries
      });

      // Generate performance report
      const report = this.syncService.generatePerformanceReport();
      console.log('Performance Summary:', {
        totalOperations: report.summary.totalOperations,
        memoryUsage: report.summary.memoryUsage,
        cacheHitRate: `${report.cacheEfficiency.hitRate.toFixed(1)}%`
      });

    } catch (error) {
      console.error('Full sync failed:', error.message);
    }
  }

  /**
   * Example: Partial sync for incremental updates
   */
  async runPartialSyncExample() {
    console.log('\n=== Partial Sync Example ===');
    
    try {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Last 24 hours
      const result = await this.syncService.sync('partial', { since, limit: 100 });
      
      console.log('Partial sync completed:', {
        products: result.products,
        variants: result.variants,
        duration: `${result.duration?.toFixed(2)}ms`
      });

    } catch (error) {
      console.error('Partial sync failed:', error.message);
    }
  }

  /**
   * Example: Single product sync
   */
  async runSingleProductSyncExample() {
    console.log('\n=== Single Product Sync Example ===');
    
    try {
      const result = await this.syncService.sync('single', { productId: 'product_123' });
      
      console.log('Single product sync completed:', {
        products: result.products,
        variants: result.variants,
        duration: `${result.duration?.toFixed(2)}ms`
      });

    } catch (error) {
      console.error('Single product sync failed:', error.message);
    }
  }

  /**
   * Example: Performance benchmarking
   */
  async runPerformanceBenchmark() {
    console.log('\n=== Performance Benchmark ===');
    
    const iterations = 3;
    const benchmark = await this.performance.benchmarkAsync(
      'full_sync_benchmark',
      () => this.syncService.sync('full'),
      iterations
    );

    console.log('Benchmark Results:', {
      iterations: benchmark.iterations,
      averageDuration: `${benchmark.averageDuration.toFixed(2)}ms`,
      minDuration: `${benchmark.minDuration.toFixed(2)}ms`,
      maxDuration: `${benchmark.maxDuration.toFixed(2)}ms`,
      totalDuration: `${benchmark.totalDuration.toFixed(2)}ms`
    });
  }

  /**
   * Example: Memory usage monitoring
   */
  async runMemoryMonitoringExample() {
    console.log('\n=== Memory Monitoring Example ===');
    
    // Take initial memory snapshot
    this.performance.takeMemorySnapshot('before_sync');
    
    const initialMemory = process.memoryUsage();
    console.log('Initial memory usage:', {
      heapUsed: `${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      rss: `${(initialMemory.rss / 1024 / 1024).toFixed(2)}MB`
    });

    // Run sync
    await this.syncService.sync('full');
    
    // Take final memory snapshot
    this.performance.takeMemorySnapshot('after_sync');
    
    const finalMemory = process.memoryUsage();
    const memoryDelta = finalMemory.heapUsed - initialMemory.heapUsed;
    
    console.log('Final memory usage:', {
      heapUsed: `${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      memoryDelta: `${(memoryDelta / 1024 / 1024).toFixed(2)}MB`
    });
  }

  /**
   * Example: Error handling and retry logic
   */
  async runErrorHandlingExample() {
    console.log('\n=== Error Handling Example ===');
    
    // Create a service that will fail
    const failingApi = {
      graphql: async () => {
        throw new Error('API temporarily unavailable');
      }
    };

    const failingService = new ShopifySyncOptimized({
      shopifyApi: failingApi,
      database: this.database,
      maxRetries: 2,
      baseDelayMs: 100
    });

    try {
      await failingService.sync('full');
    } catch (error) {
      console.log('Expected error caught:', error.message);
      
      const metrics = failingService.getMetrics();
      console.log('Error metrics:', {
        errors: metrics.errors,
        apiCalls: metrics.apiCalls
      });
    }
  }

  /**
   * Run all examples
   */
  async runAllExamples() {
    console.log('🚀 Shopify Sync Service Examples\n');
    
    await this.runFullSyncExample();
    await this.runPartialSyncExample();
    await this.runSingleProductSyncExample();
    await this.runPerformanceBenchmark();
    await this.runMemoryMonitoringExample();
    await this.runErrorHandlingExample();
    
    console.log('\n✅ All examples completed!');
    
    // Final performance report
    const finalReport = this.performance.generateReport();
    console.log('\n📊 Final Performance Report:', {
      totalOperations: finalReport.summary.totalOperations,
      memoryUsage: finalReport.summary.memoryUsage,
      activeTimers: finalReport.summary.activeTimers
    });
  }
}

// Export for use in other files
module.exports = {
  ShopifySyncExample,
  configs,
  MockDatabase,
  MockShopifyApi
};

// Run examples if this file is executed directly
if (require.main === module) {
  const example = new ShopifySyncExample('development');
  example.runAllExamples().catch(console.error);
}