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

  // ==========================================
  // SMART HOME, APPLIANCE & AI MANAGEMENT APIS
  // ==========================================

  async getHomes(): Promise<any[]> {
    const res = await fetch('/api/homes');
    return res.json();
  },

  async getHome(id: string): Promise<any> {
    const res = await fetch(`/api/homes/${id}`);
    return res.json();
  },

  async createHome(data: any): Promise<any> {
    const res = await fetch('/api/homes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateHome(id: string, updates: any): Promise<any> {
    const res = await fetch(`/api/homes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async deleteHome(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/homes/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Rooms
  async getRooms(homeId: string): Promise<any[]> {
    const res = await fetch(`/api/rooms?home_id=${encodeURIComponent(homeId)}`);
    return res.json();
  },

  async createRoom(data: { home_id: string; name: string; room_type?: string; floor?: string; description?: string }): Promise<any> {
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteRoom(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Appliances
  async getAppliances(homeId?: string): Promise<any[]> {
    const url = homeId ? `/api/appliances?home_id=${encodeURIComponent(homeId)}` : '/api/appliances';
    const res = await fetch(url);
    return res.json();
  },

  async getAppliance(id: string): Promise<any> {
    const res = await fetch(`/api/appliances/${id}`);
    return res.json();
  },

  async createAppliance(data: any): Promise<any> {
    const res = await fetch('/api/appliances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateAppliance(id: string, updates: any): Promise<any> {
    const res = await fetch(`/api/appliances/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async deleteAppliance(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/appliances/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Maintenance Tasks
  async getMaintenanceTasks(homeId?: string): Promise<any[]> {
    const url = homeId ? `/api/maintenance?home_id=${encodeURIComponent(homeId)}` : '/api/maintenance';
    const res = await fetch(url);
    return res.json();
  },

  async createMaintenanceTask(data: any): Promise<any> {
    const res = await fetch('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async completeMaintenanceTask(id: string, homeId?: string): Promise<any> {
    const res = await fetch(`/api/maintenance/${id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ home_id: homeId }),
    });
    return res.json();
  },

  async deleteMaintenanceTask(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/maintenance/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Energy
  async getEnergyRecords(homeId?: string): Promise<any[]> {
    const url = homeId ? `/api/energy?home_id=${encodeURIComponent(homeId)}` : '/api/energy';
    const res = await fetch(url);
    return res.json();
  },

  async logEnergyConsumption(data: { home_id: string; energy_consumption: number; appliance_name?: string }): Promise<any> {
    const res = await fetch('/api/energy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Recommendations
  async getAiRecommendations(homeId?: string): Promise<any[]> {
    const url = homeId ? `/api/ai/recommendations?home_id=${encodeURIComponent(homeId)}` : '/api/ai/recommendations';
    const res = await fetch(url);
    return res.json();
  },

  async updateRecommendationStatus(id: string, status: 'completed' | 'dismissed'): Promise<any> {
    const res = await fetch(`/api/ai/recommendations/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Home Genie AI Chat
  async sendHomeGenieMessage(data: { message: string; home_id?: string; conversation_id?: string }): Promise<{
    reply: string;
    suggestedActions?: string[];
    messageId: string;
    conversationId: string;
  }> {
    const res = await fetch('/api/ai/home-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Vision Scan
  async scanApplianceImage(imageBase64: string, mimeType: string = 'image/jpeg'): Promise<{
    category: string;
    brand: string;
    model: string;
    status_assessment: string;
    maintenance_advice: string;
    confidence: number;
    error_codes: string[];
  }> {
    const res = await fetch('/api/ai/vision-scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType }),
    });
    return res.json();
  },

  // Dashboard Stats
  async getDashboardStats(homeId?: string): Promise<any> {
    const url = homeId ? `/api/stats/dashboard?home_id=${encodeURIComponent(homeId)}` : '/api/stats/dashboard';
    const res = await fetch(url);
    return res.json();
  },
};
