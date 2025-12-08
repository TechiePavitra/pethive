/**
 * Electronics E-Commerce Configuration Example
 * Copy this to config/site.config.js to create an electronics store
 */

export const siteConfig = {
  appName: "TechMart",
  appType: "ecommerce",
  tagline: "Latest Tech, Best Prices",
  description: "Your one-stop shop for all things tech",
  
  modules: {
    ecommerce: true,
    streaming: false,
    saas: false,
    blog: true,
    chat: true,
    analytics: true,
  },
  
  theme: {
    mode: "dark",
    primary: "blue",
    secondary: "purple",
    preset: "electronics"
  },
  
  ecommerce: {
    enableCart: true,
    enableWishlist: true,
    enableReviews: true,
    currency: "USD",
    defaultCategories: ["Laptops", "Smartphones", "Accessories", "Gaming", "Smart Home"]
  },
  
  contact: {
    email: "support@techmart.com",
    phone: "+1 (800) TECH-MART",
    address: "456 Tech Avenue, Silicon Valley, CA"
  },
  
  social: {
    facebook: "https://facebook.com/techmart",
    twitter: "https://twitter.com/techmart",
    instagram: "https://instagram.com/techmart"
  },
  
  seo: {
    keywords: ["electronics", "laptops", "smartphones", "gadgets", "tech"],
    author: "TechMart Team",
    ogImage: "/og-tech.png"
  }
};
