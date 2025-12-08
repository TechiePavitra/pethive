/**
 * Module Registry - Dynamic Module Loader
 * Scans enabled modules and loads their routes, components, and models
 */

import { siteConfig } from '../../config/site.config.js';

export class ModuleRegistry {
  constructor() {
    this.modules = new Map();
    this.routes = [];
    this.adminPages = [];
  }

  /**
   * Load all enabled modules from config
   */
  async loadModules() {
    const enabledModules = Object.entries(siteConfig.modules)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name);

    for (const moduleName of enabledModules) {
      try {
        await this.loadModule(moduleName);
      } catch (error) {
        console.warn(`Failed to load module: ${moduleName}`, error);
      }
    }
  }

  /**
   * Load a single module
   */
  async loadModule(moduleName) {
    try {
      // Dynamic import of module manifest
      const manifest = await import(`../../modules/${moduleName}/manifest.js`);
      
      this.modules.set(moduleName, {
        name: moduleName,
        manifest: manifest.default,
        routes: manifest.default.routes || [],
        adminPages: manifest.default.adminPages || []
      });

      console.log(`✅ Module loaded: ${moduleName}`);
    } catch (error) {
      console.error(`❌ Failed to load module ${moduleName}:`, error);
    }
  }

  /**
   * Get all routes from enabled modules
   */
  getAllRoutes() {
    const routes = [];
    
    for (const [moduleName, moduleData] of this.modules) {
      routes.push(...moduleData.routes);
    }
    
    return routes;
  }

  /**
   * Get all admin pages from enabled modules
   */
  getAllAdminPages() {
    const pages = [];
    
    for (const [moduleName, moduleData] of this.modules) {
      pages.push(...moduleData.adminPages);
    }
    
    return pages;
  }

  /**
   * Check if a module is enabled
   */
  isModuleEnabled(moduleName) {
    return this.modules.has(moduleName);
  }

  /**
   * Get module config
   */
  getModuleConfig(moduleName) {
    return siteConfig[moduleName] || {};
  }
}

// Singleton instance
export const moduleRegistry = new ModuleRegistry();

// Auto-load modules on import (for client-side)
if (typeof window !== 'undefined') {
  moduleRegistry.loadModules();
}
