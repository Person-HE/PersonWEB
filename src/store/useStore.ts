import { create } from 'zustand';
import type { Tool, Resource, NavSite } from '@/types';
import initialTools from '@/data/tools.json';
import initialResources from '@/data/resources.json';
import initialNavSites from '@/data/navSites.json';

const ADMIN_PASSWORD = 'admin123';

interface AppState {
  tools: Tool[];
  resources: Resource[];
  navSites: NavSite[];
  isAdmin: boolean;

  init: () => void;
  login: (password: string) => boolean;
  logout: () => void;

  addTool: (tool: Omit<Tool, 'id' | 'createdAt'>) => void;
  updateTool: (id: string, tool: Partial<Tool>) => void;
  deleteTool: (id: string) => void;

  addResource: (resource: Omit<Resource, 'id' | 'createdAt'>) => void;
  updateResource: (id: string, resource: Partial<Resource>) => void;
  deleteResource: (id: string) => void;

  addNavSite: (site: Omit<NavSite, 'id' | 'createdAt'>) => void;
  updateNavSite: (id: string, site: Partial<NavSite>) => void;
  deleteNavSite: (id: string) => void;
}

function loadData<T>(key: string, fallback: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return fallback;
}

function saveData<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function today() {
  return new Date().toISOString().split('T')[0];
}

export const useStore = create<AppState>((set, get) => ({
  tools: [],
  resources: [],
  navSites: [],
  isAdmin: false,

  init: () => {
    const tools = loadData<Tool>('pw_tools', initialTools as Tool[]);
    const resources = loadData<Resource>('pw_resources', initialResources as Resource[]);
    const navSites = loadData<NavSite>('pw_navsites', initialNavSites as NavSite[]);
    saveData('pw_tools', tools);
    saveData('pw_resources', resources);
    saveData('pw_navsites', navSites);
    set({ tools, resources, navSites });
  },

  login: (password: string) => {
    if (password === ADMIN_PASSWORD) {
      set({ isAdmin: true });
      return true;
    }
    return false;
  },

  logout: () => set({ isAdmin: false }),

  addTool: (tool) => {
    const newTool: Tool = { ...tool, id: generateId(), createdAt: today() };
    const tools = [...get().tools, newTool];
    saveData('pw_tools', tools);
    set({ tools });
  },

  updateTool: (id, updates) => {
    const tools = get().tools.map((t) => (t.id === id ? { ...t, ...updates } : t));
    saveData('pw_tools', tools);
    set({ tools });
  },

  deleteTool: (id) => {
    const tools = get().tools.filter((t) => t.id !== id);
    saveData('pw_tools', tools);
    set({ tools });
  },

  addResource: (resource) => {
    const newResource: Resource = { ...resource, id: generateId(), createdAt: today() };
    const resources = [...get().resources, newResource];
    saveData('pw_resources', resources);
    set({ resources });
  },

  updateResource: (id, updates) => {
    const resources = get().resources.map((r) => (r.id === id ? { ...r, ...updates } : r));
    saveData('pw_resources', resources);
    set({ resources });
  },

  deleteResource: (id) => {
    const resources = get().resources.filter((r) => r.id !== id);
    saveData('pw_resources', resources);
    set({ resources });
  },

  addNavSite: (site) => {
    const newSite: NavSite = { ...site, id: generateId(), createdAt: today() };
    const navSites = [...get().navSites, newSite];
    saveData('pw_navsites', navSites);
    set({ navSites });
  },

  updateNavSite: (id, updates) => {
    const navSites = get().navSites.map((s) => (s.id === id ? { ...s, ...updates } : s));
    saveData('pw_navsites', navSites);
    set({ navSites });
  },

  deleteNavSite: (id) => {
    const navSites = get().navSites.filter((s) => s.id !== id);
    saveData('pw_navsites', navSites);
    set({ navSites });
  },
}));
