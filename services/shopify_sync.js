/**
 * =============================================================================
 * SHOPIFY SYNC SERVICE - ENHANCED CATEGORY AND TYPE RELATIONSHIPS
 * =============================================================================
 * File: services/shopify_sync.js
 * Updated: 2025-07-08 17:04:15 UTC
 * Author: deepu9990
 * Purpose: Enhanced category and type relationships using Product model methods
 * =============================================================================
 */

/* global Models, Util, Config */

const axios = require("axios");
const Sequelize = require("sequelize");

class ShopifyService {
  /**
   * Enhanced category mapping based on product data
   */
  static getCategoryMapping(productData) {
    const categoryMappings = {
      // Clothing categories
      'apparel': 'clothing',
      'fashion': 'clothing',
      'clothing': 'clothing',
      't-shirts': 'clothing',
      'shirts': 'clothing',
      'dresses': 'clothing',
      'pants': 'clothing',
      'jeans': 'clothing',
      
      // Electronics categories
      'electronics': 'electronics',
      'computers': 'electronics',
      'phones': 'electronics',
      'tablets': 'electronics',
      'accessories': 'electronics',
      
      // Home categories
      'home': 'home-garden',
      'furniture': 'home-garden',
      'decor': 'home-garden',
      'kitchen': 'home-garden',
      'garden': 'home-garden',
      
      // Beauty categories
      'beauty': 'beauty-health',
      'cosmetics': 'beauty-health',
      'skincare': 'beauty-health',
      'health': 'beauty-health',
      
      // Sports categories
      'sports': 'sports-outdoors',
      'fitness': 'sports-outdoors',
      'outdoor': 'sports-outdoors',
      'recreation': 'sports-outdoors',
      
      // Books categories
      'books': 'books-media',
      'media': 'books-media',
      'entertainment': 'books-media',
      
      // Default category
      'default': 'general'
    };

    // Try to match product type first
    const productType = productData.product_type?.toLowerCase() || '';
    if (categoryMappings[productType]) {
      return categoryMappings[productType];
    }

    // Try to match vendor name
    const vendorName = productData.vendor_name?.toLowerCase() || '';
    for (const [key, value] of Object.entries(categoryMappings)) {
      if (vendorName.includes(key)) {
        return value;
      }
    }

    // Try to match product name
    const productName = productData.name?.toLowerCase() || '';
    for (const [key, value] of Object.entries(categoryMappings)) {
      if (productName.includes(key)) {
        return value;
      }
    }

    // Default category
    return categoryMappings['default'];
  }

  /**
   * Find or create product type dynamically
   */
  static async findOrCreateProductType(productData) {
    try {
      const productType = productData.product_type || 'General';
      
      const [type, created] = await Models.ProductType.findOrCreate({
        where: { name: productType },
        defaults: {
          name: productType,
          description: `Auto-generated type for ${productType} products`,
          is_active: true,
          created_by: "da1c3170-e647-11ec-9e7a-3b37506735e7",
          updated_by: "da1c3170-e647-11ec-9e7a-3b37506735e7",
          client_id: productData.client_id || null
        }
      });

      if (created) {
        console.log(`Created new product type: ${productType}`);
      }

      return type;
    } catch (error) {
      console.error('Error finding or creating product type:', error);
      throw error;
    }
  }

  /**
   * Create category relationships dynamically
   */
  static async createDynamicCategoryRelationship(productId, productData, isVariant = false) {
    try {
      // Get category mapping
      const categorySlug = this.getCategoryMapping(productData);
      
      // Find or create category
      const [category, categoryCreated] = await Models.Category.findOrCreate({
        where: { slug: categorySlug },
        defaults: {
          name: categorySlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          slug: categorySlug,
          description: `Auto-generated category for ${categorySlug} products`,
          is_active: true,
          sort_order: 1,
          created_by: "da1c3170-e647-11ec-9e7a-3b37506735e7",
          updated_by: "da1c3170-e647-11ec-9e7a-3b37506735e7",
          client_id: productData.client_id || null
        }
      });

      if (categoryCreated) {
        console.log(`Created new category: ${category.name}`);
      }

      // Create product-category relationship
      await Models.Product.createBulkProductCategories([{
        product_id: productId,
        category_id: category.id,
        is_primary: true,
        created_by: "da1c3170-e647-11ec-9e7a-3b37506735e7"
      }]);

      console.log(`Created category relationship for product ${productId} with category ${category.name}`);
      return category;
    } catch (error) {
      console.error('Error creating dynamic category relationship:', error);
      throw error;
    }
  }

  /**
   * Enhanced main product upsert with dynamic relationships
   */
  static async upsertMainProductOptimized(productData) {
    try {
      const result = await Models.Product.findOrCreate({
        where: { shopify_product_id: productData.shopify_product_id },
        defaults: {
          name: productData.name,
          description: productData.description,
          plain_description: productData.plain_description,
          price: productData.price,
          shopify_product_id: productData.shopify_product_id,
          is_variant: false,
          vendor_name: productData.vendor_name,
          external_source: "shopify",
          is_imported: true,
          sync_status: "synced",
          last_synced_at: new Date(),
          is_approved: true,
          is_active: productData.is_active,
          is_hidden: false,
          created_by: "da1c3170-e647-11ec-9e7a-3b37506735e7",
          updated_by: "da1c3170-e647-11ec-9e7a-3b37506735e7",
          client_id: productData.client_id,
          all_images: productData.all_images,
          all_colors: productData.all_colors,
          all_sizes: productData.all_sizes,
          product_type: productData.product_type,
          external_handle: productData.external_handle,
          shopify_data: productData.shopify_data,
        },
      });

      const product = result[0];
      const created = result[1];

      if (!created) {
        await product.update({
          name: productData.name,
          description: productData.description,
          plain_description: productData.plain_description,
          price: productData.price,
          all_images: productData.all_images,
          all_colors: productData.all_colors,
          all_sizes: productData.all_sizes,
          vendor_name: productData.vendor_name,
          product_type: productData.product_type,
          external_handle: productData.external_handle,
          sync_status: "synced",
          last_synced_at: new Date(),
          updated_by: "da1c3170-e647-11ec-9e7a-3b37506735e7",
          shopify_data: productData.shopify_data,
        });
      }

      // Enhanced relationship creation for both new and updated products
      try {
        // Create or update product type relationship
        const productType = await this.findOrCreateProductType(productData);
        await product.update({ product_type_id: productType.id });

        // Create dynamic category relationships
        await this.createDynamicCategoryRelationship(product.id, productData, false);

        console.log(`Successfully created/updated product relationships for: ${product.name}`);
      } catch (relationshipError) {
        console.error(
          `Product relationship creation failed for product ${product.id} (non-fatal):`,
          relationshipError.message
        );
      }

      return { id: product.id, created: created };
    } catch (error) {
      console.error("Failed to upsert main product:", error);
      throw error;
    }
  }

  /**
   * Enhanced variant upsert with parent relationship inheritance
   */
  static async upsertVariantOptimized(variantData, parentProductId) {
    try {
      const result = await Models.Product.findOrCreate({
        where: { shopify_product_id: variantData.shopify_product_id },
        defaults: {
          name: variantData.name,
          description: variantData.description,
          plain_description: variantData.plain_description,
          price: variantData.price,
          shopify_product_id: variantData.shopify_product_id,
          is_variant: true,
          parent_product_id: parentProductId,
          vendor_name: variantData.vendor_name,
          external_source: "shopify",
          is_imported: true,
          sync_status: "synced",
          last_synced_at: new Date(),
          is_approved: true,
          is_active: variantData.is_active,
          is_hidden: false,
          created_by: "da1c3170-e647-11ec-9e7a-3b37506735e7",
          updated_by: "da1c3170-e647-11ec-9e7a-3b37506735e7",
          client_id: variantData.client_id,
          all_images: variantData.all_images,
          all_colors: variantData.all_colors,
          all_sizes: variantData.all_sizes,
          product_type: variantData.product_type,
          external_handle: variantData.external_handle,
          shopify_data: variantData.shopify_data,
        },
      });

      const variant = result[0];
      const created = result[1];

      if (!created) {
        await variant.update({
          name: variantData.name,
          description: variantData.description,
          plain_description: variantData.plain_description,
          price: variantData.price,
          all_images: variantData.all_images,
          all_colors: variantData.all_colors,
          all_sizes: variantData.all_sizes,
          vendor_name: variantData.vendor_name,
          product_type: variantData.product_type,
          external_handle: variantData.external_handle,
          sync_status: "synced",
          last_synced_at: new Date(),
          updated_by: "da1c3170-e647-11ec-9e7a-3b37506735e7",
          shopify_data: variantData.shopify_data,
        });
      }

      // Inherit parent product relationships
      try {
        // Get parent product to inherit relationships
        const parentProduct = await Models.Product.findByPk(parentProductId, {
          include: [
            { model: Models.ProductType, as: 'productType' },
            { model: Models.Category, as: 'categories' }
          ]
        });

        if (parentProduct) {
          // Inherit product type
          if (parentProduct.product_type_id) {
            await variant.update({ product_type_id: parentProduct.product_type_id });
          }

          // Inherit category relationships
          if (parentProduct.categories && parentProduct.categories.length > 0) {
            const categoryRelationships = parentProduct.categories.map(category => ({
              product_id: variant.id,
              category_id: category.id,
              is_primary: category.ProductCategory?.is_primary || false,
              created_by: "da1c3170-e647-11ec-9e7a-3b37506735e7"
            }));

            await Models.Product.createBulkProductCategories(categoryRelationships);
          }
        }

        console.log(`Successfully inherited parent relationships for variant: ${variant.name}`);
      } catch (inheritanceError) {
        console.error(
          `Variant relationship inheritance failed for variant ${variant.id} (non-fatal):`,
          inheritanceError.message
        );
      }

      return { id: variant.id, created: created };
    } catch (error) {
      console.error("Failed to upsert variant:", error);
      throw error;
    }
  }

  /**
   * Batch sync with enhanced error handling
   */
  static async batchSync(products, options = {}) {
    const { batchSize = 10, maxRetries = 3 } = options;
    const results = {
      success: [],
      failed: [],
      skipped: []
    };

    console.log(`Starting batch sync for ${products.length} products`);

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}`);

      await Promise.all(batch.map(async (productData) => {
        let retries = 0;
        
        while (retries < maxRetries) {
          try {
            const result = await this.upsertMainProductOptimized(productData);
            results.success.push({
              shopify_product_id: productData.shopify_product_id,
              product_id: result.id,
              created: result.created
            });
            break;
          } catch (error) {
            retries++;
            console.error(`Attempt ${retries} failed for product ${productData.shopify_product_id}:`, error.message);
            
            if (retries >= maxRetries) {
              results.failed.push({
                shopify_product_id: productData.shopify_product_id,
                error: error.message
              });
            } else {
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000 * retries));
            }
          }
        }
      }));
    }

    console.log(`Batch sync completed: ${results.success.length} success, ${results.failed.length} failed, ${results.skipped.length} skipped`);
    return results;
  }

  /**
   * Cleanup orphaned relationships
   */
  static async cleanupOrphanedRelationships() {
    try {
      console.log('Starting cleanup of orphaned relationships...');

      // Clean up product-category relationships where product no longer exists
      const orphanedCategoryRelationships = await Models.ProductCategory.findAll({
        include: [{
          model: Models.Product,
          as: 'product',
          required: false
        }],
        where: {
          '$product.id$': null
        }
      });

      if (orphanedCategoryRelationships.length > 0) {
        await Models.ProductCategory.destroy({
          where: {
            id: {
              [Sequelize.Op.in]: orphanedCategoryRelationships.map(rel => rel.id)
            }
          }
        });
        console.log(`Cleaned up ${orphanedCategoryRelationships.length} orphaned category relationships`);
      }

      // Clean up unused categories (optional)
      const unusedCategories = await Models.Category.findAll({
        include: [{
          model: Models.Product,
          as: 'products',
          required: false
        }],
        where: {
          '$products.id$': null
        }
      });

      if (unusedCategories.length > 0) {
        console.log(`Found ${unusedCategories.length} unused categories`);
        // Optionally remove unused categories
        // await Models.Category.destroy({
        //   where: {
        //     id: {
        //       [Sequelize.Op.in]: unusedCategories.map(cat => cat.id)
        //     }
        //   }
        // });
      }

      console.log('Cleanup completed successfully');
    } catch (error) {
      console.error('Error during cleanup:', error);
      throw error;
    }
  }

  /**
   * Get sync statistics
   */
  static async getSyncStatistics() {
    try {
      const stats = {
        totalProducts: await Models.Product.count({
          where: { external_source: 'shopify' }
        }),
        totalVariants: await Models.Product.count({
          where: { external_source: 'shopify', is_variant: true }
        }),
        totalCategories: await Models.Category.count(),
        totalProductTypes: await Models.ProductType.count(),
        syncedToday: await Models.Product.count({
          where: {
            external_source: 'shopify',
            last_synced_at: {
              [Sequelize.Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }),
        categoriesWithProducts: await Models.Category.count({
          include: [{
            model: Models.Product,
            as: 'products',
            required: true
          }]
        })
      };

      return stats;
    } catch (error) {
      console.error('Error getting sync statistics:', error);
      throw error;
    }
  }

  /**
   * Validate product data before sync
   */
  static validateProductData(productData) {
    const errors = [];

    if (!productData.shopify_product_id) {
      errors.push('shopify_product_id is required');
    }

    if (!productData.name) {
      errors.push('name is required');
    }

    if (!productData.vendor_name) {
      errors.push('vendor_name is required');
    }

    if (productData.price && (typeof productData.price !== 'number' || productData.price < 0)) {
      errors.push('price must be a non-negative number');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Legacy method for backward compatibility
   */
  static async createCategoryRelationshipSafe(productId, isVariant = false) {
    console.warn('createCategoryRelationshipSafe is deprecated. Use createDynamicCategoryRelationship instead.');
    
    try {
      const product = await Models.Product.findByPk(productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      const productData = {
        product_type: product.product_type,
        vendor_name: product.vendor_name,
        name: product.name,
        client_id: product.client_id
      };

      return await this.createDynamicCategoryRelationship(productId, productData, isVariant);
    } catch (error) {
      console.error('Legacy category relationship creation failed:', error);
      throw error;
    }
  }
}

module.exports = ShopifyService;