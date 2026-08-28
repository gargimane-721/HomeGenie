import {
  CadRoom,
  CostBreakdownItem,
  MaterialItem,
  PlotDetails,
  Project,
  QualityTier,
  User,
  VastuReport,
} from '../types';

export const api = {
  // Auth
  async register(data: { name: string; email: string; phone?: string; city?: string; password?: string }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async login(data: { email: string; password?: string }) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async logout(): Promise<{ success: boolean }> {
    return { success: true };
  },

  async getCurrentUser(): Promise<{ user: User | null }> {
    try {
      const res = await fetch('/api/user/profile');
      if (!res.ok) return { user: null };
      const user = await res.json();
      return { user };
    } catch {
      return { user: null };
    }
  },

  // User Profile
  async getProfile(): Promise<User> {
    const res = await fetch('/api/user/profile');
    return res.json();
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects');
    return res.json();
  },

  async getProject(id: string): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) throw new Error('Project not found');
    return res.json();
  },

  async createProject(projectData: Partial<Project>): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    return res.json();
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async deleteProject(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async selectAlternative(projectId: string, alternativeId: string): Promise<Project> {
    const res = await fetch(`/api/projects/${projectId}/alternative`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alternativeId }),
    });
    if (!res.ok) {
      // Fallback
      return this.getProject(projectId);
    }
    return res.json();
  },

  async exportDxf(projectId: string): Promise<string> {
    const res = await fetch(`/api/projects/${projectId}/export/dxf`);
    if (!res.ok) {
      return `0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF`;
    }
    return res.text();
  },

  // AI Modification
  async modifyPlan(userMessage: string, project: Project) {
    const res = await fetch('/api/ai/modify-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage, project }),
    });
    return res.json();
  },

  // Materials
  async getMaterials(category?: string, query?: string): Promise<MaterialItem[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('q', query);
    const res = await fetch(`/api/materials?${params.toString()}`);
    return res.json();
  },

  async compareMaterials(category: string) {
    const res = await fetch(`/api/materials/compare?category=${encodeURIComponent(category)}`);
    return res.json();
  },

  // Versions
  async createVersion(projectId: string, name: string, changesSummary: string) {
    const res = await fetch(`/api/projects/${projectId}/versions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, changesSummary }),
    });
    return res.json();
  },
};
