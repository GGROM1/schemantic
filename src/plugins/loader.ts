/**
 * Plugin loader for dynamic plugin loading
 * Handles loading plugins from various sources (files, packages, etc.)
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { TypeSyncPlugin } from '../types/core';

/**
 * Plugin loader class
 */
export class PluginLoader {
  private loadedPlugins: Map<string, TypeSyncPlugin> = new Map();
  
  /**
   * Load plugin from file path
   */
  async loadPluginFromFile(filePath: string): Promise<TypeSyncPlugin> {
    try {
      // Check if file exists
      await fs.access(filePath);
      
      // Load the module
      const pluginModule = await import(path.resolve(filePath));
      
      // Extract plugin from module
      const plugin = this.extractPluginFromModule(pluginModule);
      
      if (!plugin) {
        throw new Error(`No valid plugin found in ${filePath}`);
      }
      
      // Validate plugin
      this.validatePlugin(plugin);
      
      // Store loaded plugin
      this.loadedPlugins.set(plugin.name, plugin);
      
      return plugin;
    } catch (error) {
      throw new Error(`Failed to load plugin from ${filePath}: ${error}`);
    }
  }
  
  /**
   * Load plugin from package
   */
  async loadPluginFromPackage(packageName: string): Promise<TypeSyncPlugin> {
    try {
      // Load the package
      const pluginModule = await import(packageName);
      
      // Extract plugin from module
      const plugin = this.extractPluginFromModule(pluginModule);
      
      if (!plugin) {
        throw new Error(`No valid plugin found in package ${packageName}`);
      }
      
      // Validate plugin
      this.validatePlugin(plugin);
      
      // Store loaded plugin
      this.loadedPlugins.set(plugin.name, plugin);
      
      return plugin;
    } catch (error) {
      throw new Error(`Failed to load plugin from package ${packageName}: ${error}`);
    }
  }
  
  /**
   * Load plugins from directory
   */
  async loadPluginsFromDirectory(directoryPath: string): Promise<TypeSyncPlugin[]> {
    try {
      const plugins: TypeSyncPlugin[] = [];
      
      // Read directory contents
      const entries = await fs.readdir(directoryPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.ts'))) {
          const filePath = path.join(directoryPath, entry.name);
          
          try {
            const plugin = await this.loadPluginFromFile(filePath);
            plugins.push(plugin);
          } catch (error) {
            console.warn(`Failed to load plugin from ${filePath}:`, error);
          }
        }
      }
      
      return plugins;
    } catch (error) {
      throw new Error(`Failed to load plugins from directory ${directoryPath}: ${error}`);
    }
  }
  
  /**
   * Load plugin from object
   */
  loadPluginFromObject(plugin: TypeSyncPlugin): TypeSyncPlugin {
    // Validate plugin
    this.validatePlugin(plugin);
    
    // Store loaded plugin
    this.loadedPlugins.set(plugin.name, plugin);
    
    return plugin;
  }
  
  /**
   * Extract plugin from module
   */
  private extractPluginFromModule(module: any): TypeSyncPlugin | undefined {
    // Try different export patterns
    if (module.default && this.isValidPlugin(module.default)) {
      return module.default;
    }
    
    if (module.plugin && this.isValidPlugin(module.plugin)) {
      return module.plugin;
    }
    
    if (this.isValidPlugin(module)) {
      return module;
    }
    
    // Look for plugin in exports
    for (const [, value] of Object.entries(module)) {
      if (this.isValidPlugin(value)) {
        return value as TypeSyncPlugin;
      }
    }
    
    return undefined;
  }
  
  /**
   * Check if object is a valid plugin
   */
  private isValidPlugin(obj: any): obj is TypeSyncPlugin {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.name === 'string' &&
      typeof obj.version === 'string' &&
      typeof obj.description === 'string'
    );
  }
  
  /**
   * Validate plugin
   */
  private validatePlugin(plugin: TypeSyncPlugin): void {
    if (!plugin.name || typeof plugin.name !== 'string') {
      throw new Error('Plugin must have a valid name');
    }
    
    if (!plugin.version || typeof plugin.version !== 'string') {
      throw new Error('Plugin must have a valid version');
    }
    
    if (!plugin.description || typeof plugin.description !== 'string') {
      throw new Error('Plugin must have a valid description');
    }
    
    // Check for duplicate names
    if (this.loadedPlugins.has(plugin.name)) {
      throw new Error(`Plugin with name '${plugin.name}' is already loaded`);
    }
  }
  
  /**
   * Get loaded plugin
   */
  getLoadedPlugin(name: string): TypeSyncPlugin | undefined {
    return this.loadedPlugins.get(name);
  }
  
  /**
   * Get all loaded plugins
   */
  getAllLoadedPlugins(): TypeSyncPlugin[] {
    return Array.from(this.loadedPlugins.values());
  }
  
  /**
   * Clear loaded plugins
   */
  clear(): void {
    this.loadedPlugins.clear();
  }
  
  /**
   * Get loading statistics
   */
  getStatistics(): LoadingStatistics {
    return {
      loadedPlugins: this.loadedPlugins.size,
      pluginNames: Array.from(this.loadedPlugins.keys()),
    };
  }
}

/**
 * Loading statistics
 */
export interface LoadingStatistics {
  loadedPlugins: number;
  pluginNames: string[];
}

/**
 * Plugin loading options
 */
export interface PluginLoadingOptions {
  /**
   * Whether to continue loading other plugins if one fails
   */
  continueOnError?: boolean;
  
  /**
   * Whether to validate plugins after loading
   */
  validate?: boolean;
  
  /**
   * Custom validation function
   */
  customValidator?: (plugin: TypeSyncPlugin) => boolean;
}

/**
 * Convenience function to load plugin from file
 */
export async function loadPluginFromFile(filePath: string): Promise<TypeSyncPlugin> {
  const loader = new PluginLoader();
  return loader.loadPluginFromFile(filePath);
}

/**
 * Convenience function to load plugin from package
 */
export async function loadPluginFromPackage(packageName: string): Promise<TypeSyncPlugin> {
  const loader = new PluginLoader();
  return loader.loadPluginFromPackage(packageName);
}

/**
 * Convenience function to load plugins from directory
 */
export async function loadPluginsFromDirectory(directoryPath: string): Promise<TypeSyncPlugin[]> {
  const loader = new PluginLoader();
  return loader.loadPluginsFromDirectory(directoryPath);
}
