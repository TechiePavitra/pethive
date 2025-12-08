/**
 * E-Commerce Module Manifest
 * Defines routes, models, and admin pages for the e-commerce module
 */

export default {
  name: "ecommerce",
  version: "1.0.0",
  description: "Full-featured e-commerce module with products, cart, and checkout",
  
  // Public routes
  routes: [
    {
      path: "/shop",
      component: "Shop",
      exact: true
    },
    {
      path: "/products/:id",
      component: "ProductDetail",
      exact: true
    },
    {
      path: "/cart",
      component: "Cart",
      exact: true
    }
  ],
  
  // Admin pages
  adminPages: [
    {
      name: "Products",
      path: "/admin/products",
      icon: "Package",
      component: "Products"
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: "FolderTree",
      component: "Categories"
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: "ShoppingCart",
      component: "Orders"
    }
  ],
  
  // Database models (Prisma schemas)
  models: ["Product", "Category", "Order", "OrderItem"],
  
  // Required permissions
  permissions: ["view_products", "manage_products", "process_orders"],
  
  // Dependencies (other modules this depends on)
  dependencies: []
};
