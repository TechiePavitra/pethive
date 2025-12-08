/**
 * Netflix/Streaming Platform Configuration Example
 * Copy this to config/site.config.js to create a streaming platform
 */

export const siteConfig = {
  appName: "StreamFlix",
  appType: "streaming",
  tagline: "Unlimited Movies, TV Shows, and More",
  description: "Watch anywhere. Cancel anytime.",
  
  modules: {
    ecommerce: false,
    streaming: true,
    saas: false,
    blog: false,
    chat: true,
    analytics: true,
  },
  
  theme: {
    mode: "dark",
    primary: "red",
    secondary: "pink",
    preset: "streaming"
  },
  
  streaming: {
    enableDownloads: true,
    enableLiveTV: true,
    qualityOptions: ["480p", "720p", "1080p", "4K"],
    defaultCategories: ["Action", "Comedy", "Drama", "Thriller", "Documentary"],
    maxProfiles: 5,
    allowKidsMode: true
  },
  
  contact: {
    email: "support@streamflix.com",
    phone: "+1 (800) STREAM",
    address: ""
  },
  
  social: {
    facebook: "https://facebook.com/streamflix",
    twitter: "https://twitter.com/streamflix",
    instagram: "https://instagram.com/streamflix"
  },
  
  seo: {
    keywords: ["streaming", "movies", "tv shows", "entertainment"],
    author: "StreamFlix Team",
    ogImage: "/og-streaming.png"
  }
};
