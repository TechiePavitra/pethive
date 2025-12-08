/**
 * SaaS / Project Management Platform Configuration Example
 * Copy this to config/site.config.js to create a project management tool
 */

export const siteConfig = {
  appName: "TaskMaster Pro",
  appType: "saas",
  tagline: "Manage Projects Like a Pro",
  description: "The all-in-one project management solution for modern teams",
  
  modules: {
    ecommerce: false,
    streaming: false,
    saas: true,
    blog: false,
    chat: true,
    analytics: true,
  },
  
  theme: {
    mode: "dark",
    primary: "indigo",
    secondary: "blue",
    preset: "saas"
  },
  
  saas: {
    enableKanban: true,
    enableGantt: true,
    enableTimeTracking: true,
    enableInvoicing: true,
    maxProjectsPerUser: 50,
    maxTeamSize: 100,
    allowPublicSharing: true
  },
  
  contact: {
    email: "hello@taskmaster.com",
    phone: "+1 (555) TASK-PRO",
    address: "123 Productivity Lane, San Francisco, CA"
  },
  
  social: {
    facebook: "https://facebook.com/taskmasterpro",
    twitter: "https://twitter.com/taskmasterpro",
    instagram: "https://instagram.com/taskmasterpro",
    linkedin: "https://linkedin.com/company/taskmasterpro"
  },
  
  seo: {
    keywords: ["project management", "task tracking", "team collaboration", "productivity"],
    author: "TaskMaster Team",
    ogImage: "/og-saas.png"
  }
};
