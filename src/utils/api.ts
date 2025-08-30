// API utility functions for communicating with Google Apps Script

const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'; // Replace with your deployed Apps Script URL

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}?path=${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const result: ApiResponse<T> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }

    return result.data as T;
  }

  async checkAuth() {
    return this.request('auth/check');
  }

  async uploadFiles(files: File[], folderId?: string) {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    
    if (folderId) {
      formData.append('folderId', folderId);
    }

    const response = await fetch(`${this.baseUrl}?path=upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const result: ApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    return result.data;
  }

  async getFiles(folderId?: string) {
    return this.request('files', {
      method: 'POST',
      body: JSON.stringify({ folderId }),
    });
  }

  async createFolder(name: string, parentId?: string) {
    return this.request('folders', {
      method: 'POST',
      body: JSON.stringify({ name, parentId }),
    });
  }

  async deleteFolder(folderId: string) {
    const response = await fetch(`${this.baseUrl}?path=folders/${folderId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const result: ApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Delete failed');
    }

    return result.data;
  }

  async renameFolder(folderId: string, newName: string) {
    const response = await fetch(`${this.baseUrl}?path=folders/${folderId}`, {
      method: 'POST', // Apps Script doesn't support PATCH, so we use POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newName, action: 'rename' }),
      credentials: 'include',
    });

    const result: ApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Rename failed');
    }

    return result.data;
  }
}

export const apiClient = new ApiClient(APPS_SCRIPT_URL);