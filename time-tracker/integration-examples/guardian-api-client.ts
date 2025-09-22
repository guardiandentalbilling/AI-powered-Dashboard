/**
 * Guardian Time Tracker API Client
 * Use this in your web-based project to integrate with Guardian Time Tracker
 */

export interface GuardianConfig {
  apiUrl: string;
  wsUrl?: string;
  apiKey?: string;
}

export class GuardianTimeTrackerClient {
  private config: GuardianConfig;
  private token: string | null = null;
  private ws: WebSocket | null = null;

  constructor(config: GuardianConfig) {
    this.config = config;
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', 'POST', {
      email,
      password
    });
    
    if (response.success) {
      this.token = response.data.token;
      if (this.token) {
        localStorage.setItem('guardian-token', this.token);
      }
    }
    
    return response;
  }

  async logout() {
    await this.request('/auth/logout', 'POST');
    this.token = null;
    localStorage.removeItem('guardian-token');
    this.disconnectWebSocket();
  }

  // Time Tracking
  async startTimeTracking(projectId?: string, description?: string) {
    return this.request('/time-entries/start', 'POST', {
      projectId,
      description
    });
  }

  async stopTimeTracking(timeEntryId: string) {
    return this.request(`/time-entries/${timeEntryId}/stop`, 'PUT');
  }

  async pauseTimeTracking(timeEntryId: string) {
    return this.request(`/time-entries/${timeEntryId}/pause`, 'PUT');
  }

  async resumeTimeTracking(timeEntryId: string) {
    return this.request(`/time-entries/${timeEntryId}/resume`, 'PUT');
  }

  async getTimeEntries(filters?: {
    userId?: string;
    projectId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/time-entries?${params.toString()}`);
  }

  async getActiveTimeEntry(userId?: string) {
    return this.request(`/time-entries/active${userId ? `?userId=${userId}` : ''}`);
  }

  // User Management
  async getUsers() {
    return this.request('/users');
  }

  async getUser(userId: string) {
    return this.request(`/users/${userId}`);
  }

  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: 'admin' | 'employee';
  }) {
    return this.request('/users', 'POST', userData);
  }

  async updateUser(userId: string, userData: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin' | 'employee';
    isActive: boolean;
  }>) {
    return this.request(`/users/${userId}`, 'PUT', userData);
  }

  // Screenshots
  async getScreenshots(timeEntryId: string) {
    return this.request(`/screenshots/${timeEntryId}`);
  }

  async getScreenshotsByUser(userId: string, dateRange?: {
    startDate: Date;
    endDate: Date;
  }) {
    const params = new URLSearchParams();
    if (dateRange) {
      params.append('startDate', dateRange.startDate.toISOString());
      params.append('endDate', dateRange.endDate.toISOString());
    }
    
    return this.request(`/screenshots/user/${userId}?${params.toString()}`);
  }

  // Projects
  async getProjects() {
    return this.request('/projects');
  }

  async createProject(projectData: {
    name: string;
    description?: string;
    assignedUsers?: string[];
  }) {
    return this.request('/projects', 'POST', projectData);
  }

  async updateProject(projectId: string, projectData: Partial<{
    name: string;
    description: string;
    isActive: boolean;
    assignedUsers: string[];
  }>) {
    return this.request(`/projects/${projectId}`, 'PUT', projectData);
  }

  // Reports
  async getTimeReport(params: {
    userId?: string;
    projectId?: string;
    startDate: Date;
    endDate: Date;
    groupBy?: 'day' | 'week' | 'month';
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value.toString());
      }
    });
    
    return this.request(`/reports/time?${searchParams.toString()}`);
  }

  async getActivityReport(params: {
    userId?: string;
    startDate: Date;
    endDate: Date;
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value.toString());
      }
    });
    
    return this.request(`/reports/activity?${searchParams.toString()}`);
  }

  // Real-time WebSocket Connection
  connectWebSocket(onMessage?: (event: any) => void) {
    if (!this.config.wsUrl) return;

    this.ws = new WebSocket(this.config.wsUrl);
    
    this.ws.onopen = () => {
      console.log('Connected to Guardian WebSocket');
      // Authenticate WebSocket connection
      if (this.token) {
        this.ws?.send(JSON.stringify({
          type: 'auth',
          token: this.token
        }));
      }
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Guardian WebSocket message:', data);
      
      if (onMessage) {
        onMessage(data);
      }
    };

    this.ws.onclose = () => {
      console.log('Guardian WebSocket disconnected');
    };

    this.ws.onerror = (error) => {
      console.error('Guardian WebSocket error:', error);
    };
  }

  disconnectWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Private helper method for API requests
  private async request(endpoint: string, method: string = 'GET', body?: any) {
    const url = `${this.config.apiUrl}/api${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authentication token
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Add API key if provided
    if (this.config.apiKey) {
      headers['X-API-Key'] = this.config.apiKey;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`Guardian API request failed: ${method} ${endpoint}`, error);
      throw error;
    }
  }

  // Utility method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token || !!localStorage.getItem('guardian-token');
  }

  // Load token from localStorage
  loadStoredToken(): void {
    const storedToken = localStorage.getItem('guardian-token');
    if (storedToken) {
      this.token = storedToken;
    }
  }
}

// Export types for TypeScript projects
export interface TimeEntry {
  id: string;
  userId: string;
  projectId?: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'paused' | 'stopped';
  totalDuration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'employee';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Screenshot {
  id: string;
  timeEntryId: string;
  userId: string;
  filePath: string;
  thumbnailPath?: string;
  capturedAt: Date;
  fileSize: number;
  metadata?: {
    screenResolution: string;
    activeWindow?: string;
    mouseActivity: boolean;
    keyboardActivity: boolean;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdBy: string;
  assignedUsers: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Example usage and export
export default GuardianTimeTrackerClient;