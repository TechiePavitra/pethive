/**
 * Universal Site Configuration
 * This file controls what type of application you're building
 */

export const siteConfig = {
  // ========================================
  // BASIC INFO
  // ========================================
  appName: "OneStopPet",
  appType: "ecommerce", // Options: "ecommerce", "streaming", "saas", "cms", "tool"
  tagline: "Giving Your Pets The Royal Treatment",
  description: "Premium pet supplies for your furry friends",
  
  // ========================================
  // MODULES (Enable/Disable Features)
  // ========================================
  modules: {
    ecommerce: true,    // Product catalog, cart, checkout
    streaming: false,   // Video library, player, playlists
    saas: false,        // Projects, teams, analytics
    blog: false,        // Posts, comments, SEO
    chat: true,         // Customer support chat
    analytics: true,    // Admin dashboard stats
  },
  
  // ========================================
  // THEME
  // ========================================
  theme: {
    mode: "light",           // "light" or "dark"
    primary: "amber",        // Main brand color
    secondary: "orange",     // Accent color
    preset: "pet-shop"       // Pre-built theme preset
  },
  
  // ========================================
  // MODULE-SPECIFIC CONFIGS
  // ========================================
  
  // E-Commerce Settings
  ecommerce: {
    enableCart: true,
    enableWishlist: false,
    enableReviews: false,
    currency: "USD",
    defaultCategories: ["Food", "Toys", "Accessories", "Healthcare"]
  },
  
  // Streaming Settings (unused when module disabled)
  streaming: {
    enableDownloads: false,
    enableLiveTV: false,
    qualityOptions: ["480p", "720p", "1080p"],
    defaultCategories: ["Action", "Comedy", "Drama"]
  },
  
  // SaaS Settings (unused when module disabled)
  saas: {
    enableKanban: true,
    enableGantt: false,
    enableTimeTracking: true,
    maxProjectsPerUser: 10
  },
  
  // ========================================
  // CONTACT & SOCIAL
  // ========================================
  contact: {
    email: "support@onestoppet.com",
    phone: "+1 (555) 123-4567",
    address: "123 Pet Street, Pawville, PA 12345"
  },
  
  social: {
    facebook: "https://facebook.com/onestoppet",
    twitter: "https://twitter.com/onestoppet",
    instagram: "https://instagram.com/onestoppet"
  },
  
  // ========================================
  // SEO
  // ========================================
  seo: {
    keywords: ["pet supplies", "pet food", "pet toys"],
    author: "OneStopPet Team",
    ogImage: "/og-image.png"
  }
};

// Theme presets for quick setup
export const themePresets = {
  "pet-shop": {
    primary: "amber",
    secondary: "orange",
    mode: "light"
  },
  "electronics": {
    primary: "blue",
    secondary: "purple",
    mode: "dark"
  },
  "streaming": {
    primary: "red",
    secondary: "pink",
    mode: "dark"
  },
  "fashion": {
    primary: "pink",
    secondary: "rose",
    mode: "light"
  },
  "saas": {
    primary: "indigo",
    secondary: "blue",
    mode: "dark"
  }
};
