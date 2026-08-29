# Shopify Sync Service Enhancement

This project implements a comprehensive Shopify sync service with enhanced dynamic category and type relationship management.

## Features

### 🎯 Dynamic Category Assignment
- Automatically determines appropriate categories based on product data
- Uses product_type, vendor, and tags for intelligent categorization
- Supports category mapping logic with fallback to "General" category
- Creates categories dynamically when needed

### 🔄 Enhanced Model Integration
- Utilizes existing model hooks (beforeCreate, afterCreate)
- Leverages `createProductCategoryRelationship` method
- Implements proper model associations and validations
- Supports bulk operations for efficiency

### 📊 Type Relationship Management
- Creates and finds ProductType records dynamically
- Links products to correct types based on Shopify data
- Handles type inheritance for variants
- Maintains consistent type relationships

### 🛡️ Robust Error Handling
- Comprehensive validation before relationship creation
- Detailed logging for debugging and monitoring
- Graceful fallback mechanisms
- Proper error tracking and reporting

### 👥 Variant Relationship Inheritance
- Ensures subproducts inherit parent category relationships
- Maintains proper parent-child category links
- Handles variant-specific categorization
- Supports complex product hierarchies

## Architecture

### Services
- `services/shopify_sync.js` - Main sync service with enhanced functionality
- Mock database layer for demonstration purposes
- Comprehensive logging and monitoring

### Models
- `models/Product.js` - Enhanced Product model with hooks and relationships
- `models/database.js` - Mock database implementation
- Support for categories, product types, and relationships

### Testing
- `run_tests.js` - Comprehensive test suite
- `tests/shopify_service.test.js` - Detailed unit tests
- Coverage of all major functionality

## Usage

### Installation
```bash
npm install
```

### Running the Demo
```bash
npm run demo:shopify
```

### Running Tests
```bash
npm run test:shopify
```

### Basic Usage
```javascript
const ShopifyService = require('./services/shopify_sync');

const shopifyService = new ShopifyService();

// Sync products from Shopify
const results = await shopifyService.syncProducts(shopifyProductData);
```

## Key Methods

### `determineCategoryFromProduct(productData)`
Intelligently determines the appropriate category for a product based on:
- Product type
- Vendor information
- Product tags

### `createDynamicCategoryRelationship(productData)`
Creates category relationships with enhanced validation and error handling.

### `upsertMainProductOptimized(shopifyProductData)`
Enhanced product upsert with improved category logic and type management.

### `upsertVariantOptimized(parentProduct, shopifyVariantData)`
Improved variant handling with proper relationship inheritance.

### `createBulkProductCategories(productsData)`
Bulk category relationship creation with comprehensive error handling.

### `syncProducts(shopifyProducts)`
Main orchestration method that handles the complete sync process.

## Error Handling

The service includes comprehensive error handling:
- Input validation with detailed error messages
- Graceful handling of missing or invalid data
- Detailed logging for debugging
- Rollback mechanisms for failed operations

## Logging

Enhanced logging throughout the service:
- Operation tracking
- Performance monitoring
- Error reporting
- Debug information

## Category Mapping

The service supports intelligent category mapping:
- Electronics: tech, gadgets, electronics
- Clothing: apparel, fashion, clothing
- Books: books, literature, education
- Home & Garden: home, garden, furniture
- Sports: sports, fitness, outdoor

## Testing

Comprehensive test coverage including:
- Unit tests for all major methods
- Integration tests for complete workflows
- Error handling validation
- Performance testing

## Performance Optimizations

- Efficient bulk operations
- Smart caching of category and type lookups
- Optimized database queries
- Minimal relationship creation overhead

## Future Enhancements

- Real database integration
- Advanced category mapping algorithms
- Performance metrics and monitoring
- Automated relationship cleanup
- Advanced error recovery mechanisms

## API Reference

### ShopifyService Methods

#### `validateRelationshipData(productData, categoryData)`
Validates relationship data before creation.

#### `findOrCreateCategory(categoryName)`
Finds existing category or creates new one.

#### `findOrCreateProductType(productData)`
Finds or creates product type based on product data.

#### `createCategoryMapping(productsData)`
Creates category mappings for bulk operations.

#### `inheritParentCategoryRelationships(parentProduct, variant)`
Handles variant relationship inheritance.

#### `getSyncStats()`
Returns comprehensive sync statistics.

## Database Schema

### Products
- id, shopifyId, title, description, vendor
- product_type, tags, handle, status
- parentProductId, isVariant, price, sku
- timestamps

### Categories
- id, name, slug, description
- timestamps

### ProductTypes
- id, name, slug, description
- timestamps

### ProductCategories (Relationships)
- id, productId, categoryId
- timestamps

## Contributing

1. Follow existing code style and patterns
2. Add comprehensive tests for new functionality
3. Update documentation for API changes
4. Ensure error handling is robust
5. Add appropriate logging

## License

This project is part of a portfolio demonstration.