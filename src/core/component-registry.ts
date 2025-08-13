import { Page } from '@playwright/test';
import { BaseComponent } from './base-component';

export class ComponentRegistry {
  private components: Map<string, BaseComponent> = new Map();
  private aliases: Map<string, string> = new Map();
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  register(name: string, component: BaseComponent): void {
    this.components.set(name, component);
    
    if (name === 'loanApplication') {
      this.aliases.set('loan', name);
      this.aliases.set('application', name);
    }
  }

  get(name: string): BaseComponent | undefined {
    if (this.aliases.has(name)) {
      const actualName = this.aliases.get(name)!;
      return this.components.get(actualName);
    }
    return this.components.get(name);
  }

  has(name: string): boolean {
    return this.components.has(name) || this.aliases.has(name);
  }

  list(): string[] {
    return Array.from(this.components.keys());
  }

  remove(name: string): boolean {
    const removed = this.components.delete(name);
    
    for (const [alias, target] of this.aliases.entries()) {
      if (target === name) {
        this.aliases.delete(alias);
      }
    }
    
    return removed;
  }

  clear(): void {
    this.components.clear();
    this.aliases.clear();
  }

  getStats(): { totalComponents: number; aliases: number; ready: number } {
    return {
      totalComponents: this.components.size,
      aliases: this.aliases.size,
      ready: 0
    };
  }

  async getHealthStatus(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};
    
    for (const [name, component] of this.components.entries()) {
      try {
        health[name] = await component.isReady();
      } catch (error) {
        health[name] = false;
      }
    }
    
    return health;
  }

  async waitForComponent(name: string, timeout: number = 10000): Promise<BaseComponent> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const component = this.get(name);
      if (component) {
        try {
          const ready = await component.isReady();
          if (ready) {
            return component;
          }
        } catch (error) {
          await this.page.waitForTimeout(500);
        }
      }
      
      await this.page.waitForTimeout(500);
    }
    
    throw new Error(`Component '${name}' not found or not ready within ${timeout}ms`);
  }

  async initializeComponent(name: string): Promise<boolean> {
    const component = this.get(name);
    if (!component) {
      return false;
    }
    
    try {
      if ('initialize' in component && typeof component.initialize === 'function') {
        await component.initialize();
      }
      return true;
    } catch (error) {
      console.error(`Failed to initialize component '${name}':`, error);
      return false;
    }
  }
} 