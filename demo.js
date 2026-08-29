#!/usr/bin/env node

const ShopifyService = require('./services/shopify_sync');
const Product = require('./models/Product');
const db = require('./models/database');

// Sample Shopify product data
const sampleShopifyData = [
  {
    id: '1',
    title: 'iPhone 14 Pro',
    body_html: 'Latest iPhone with Pro camera system',
    vendor: 'Apple',
    product_type: 'Electronics',
    tags: 'phone,tech,apple',
    handle: 'iphone-14-pro',
    status: 'active',
    variants: [
      {
        id: '1-1',
        title: '128GB Space Black',
        sku: 'IPHONE14PRO-128-BLK',
        price: '999.00'
      },
      {
        id: '1-2',
        title: '256GB Deep Purple',
        sku: 'IPHONE14PRO-256-PUR',
        price: '1099.00'
      }
    ]
  },
  {
    id: '2',
    title: 'Nike Air Max 90',
    body_html: 'Classic Nike running shoes',
    vendor: 'Nike',
    product_type: 'Footwear',
    tags: 'shoes,sports,nike',
    handle: 'nike-air-max-90',
    status: 'active',
    variants: [
      {
        id: '2-1',
        title: 'Size 10 White',
        sku: 'AIRMAX90-10-WHT',
        price: '120.00'
      }
    ]
  },
  {
    id: '3',
    title: 'Programming Book Collection',
    body_html: 'Essential programming books for developers',
    vendor: 'TechBooks',
    product_type: 'Books',
    tags: 'programming,education,tech',
    handle: 'programming-book-collection',
    status: 'active',
    variants: []
  },
  {
    id: '4',
    title: 'Organic Cotton T-Shirt',
    body_html: 'Comfortable organic cotton t-shirt',
    vendor: 'EcoWear',
    product_type: 'Clothing',
    tags: 'organic,fashion,sustainable',
    handle: 'organic-cotton-tshirt',
    status: 'active',
    variants: [
      {
        id: '4-1',
        title: 'Size M Blue',
        sku: 'ORGANIC-TSHIRT-M-BLU',
        price: '25.00'
      },
      {
        id: '4-2',
        title: 'Size L Red',
        sku: 'ORGANIC-TSHIRT-L-RED',
        price: '25.00'
      }
    ]
  }
];

async function demonstrateShopifyService() {
  console.log('='.repeat(80));
  console.log('SHOPIFY SYNC SERVICE DEMONSTRATION');
  console.log('='.repeat(80));
  
  const shopifyService = new ShopifyService();
  
  try {
    // 1. Show initial database state
    console.log('\n1. Initial Database State:');
    const initialStats = await shopifyService.getSyncStats();
    console.log('   Initial Stats:', initialStats);
    
    // 2. Demonstrate category determination
    console.log('\n2. Category Determination Examples:');
    for (const product of sampleShopifyData) {
      const category = await shopifyService.determineCategoryFromProduct(product);
      console.log(`   Product: ${product.title} -> Category: ${category.name}`);
    }
    
    // 3. Demonstrate product type creation
    console.log('\n3. Product Type Creation:');
    for (const product of sampleShopifyData) {
      const productType = await shopifyService.findOrCreateProductType(product);
      console.log(`   Product: ${product.title} -> Type: ${productType.name}`);
    }
    
    // 4. Demonstrate category mapping
    console.log('\n4. Category Mapping:');
    const categoryMapping = await shopifyService.createCategoryMapping(sampleShopifyData);
    console.log('   Category Mappings:');
    for (const [productId, category] of Object.entries(categoryMapping)) {
      console.log(`     Product ${productId} -> ${category.name}`);
    }
    
    // 5. Demonstrate full sync
    console.log('\n5. Full Product Sync:');
    const syncResults = await shopifyService.syncProducts(sampleShopifyData);
    console.log('   Sync Results:');
    console.log(`     Products synced: ${syncResults.products.length}`);
    console.log(`     Variants synced: ${syncResults.variants.length}`);
    console.log(`     Errors: ${syncResults.errors.length}`);
    
    // 6. Show final database state
    console.log('\n6. Final Database State:');
    const finalStats = await shopifyService.getSyncStats();
    console.log('   Final Stats:', finalStats);
    
    // 7. Demonstrate bulk category creation
    console.log('\n7. Bulk Category Creation:');
    const bulkResults = await shopifyService.createBulkProductCategories(
      syncResults.products.map(p => ({ id: p.id, product_type: p.product_type, vendor: p.vendor, tags: p.tags }))
    );
    console.log('   Bulk Results:');
    console.log(`     Successful: ${bulkResults.successful.length}`);
    console.log(`     Errors: ${bulkResults.errors.length}`);
    
    // 8. Show product details with relationships
    console.log('\n8. Product Details with Relationships:');
    for (const product of syncResults.products.slice(0, 2)) {
      console.log(`   Product: ${product.title}`);
      console.log(`     ID: ${product.id}`);
      console.log(`     Vendor: ${product.vendor}`);
      console.log(`     Type: ${product.product_type}`);
      console.log(`     Tags: ${product.tags.join(', ')}`);
      console.log(`     Status: ${product.status}`);
      console.log(`     Created: ${product.createdAt}`);
      
      // Show variants
      const variants = syncResults.variants.filter(v => v.parentProductId === product.id);
      if (variants.length > 0) {
        console.log(`     Variants: ${variants.length}`);
        for (const variant of variants) {
          console.log(`       - ${variant.title} (${variant.sku}): $${variant.price}`);
        }
      }
    }
    
    // 9. Demonstrate error handling
    console.log('\n9. Error Handling Test:');
    const invalidProduct = { title: 'Invalid Product', product_type: 'Test' }; // Missing ID
    try {
      await shopifyService.createDynamicCategoryRelationship(invalidProduct);
    } catch (error) {
      console.log(`   Expected error caught: ${error.message}`);
    }
    
    // 10. Show database export
    console.log('\n10. Database Export (sample):');
    const exportData = await db.exportData();
    console.log(`   Total Categories: ${exportData.categories.length}`);
    console.log(`   Category Names: ${exportData.categories.map(c => c.name).join(', ')}`);
    console.log(`   Total Product Types: ${exportData.productTypes.length}`);
    console.log(`   Product Type Names: ${exportData.productTypes.map(pt => pt.name).join(', ')}`);
    console.log(`   Total Relationships: ${exportData.relationships.length}`);
    
    console.log('\n' + '='.repeat(80));
    console.log('DEMONSTRATION COMPLETED SUCCESSFULLY');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('Error in demonstration:', error);
    process.exit(1);
  }
}

// Run the demonstration
if (require.main === module) {
  demonstrateShopifyService().catch(console.error);
}

module.exports = { demonstrateShopifyService, sampleShopifyData };