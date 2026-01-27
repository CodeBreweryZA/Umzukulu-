// Note: The original path had "js\js\", which appears to be a typo. Assuming it should be "js\api.js". If this file is intended to be used, add <script src="js/api.js"></script> to your Index.html before the other JS files.

const API_URL = 'http://localhost:5000/api';

class API {
    constructor() {
        this.token = localStorage.getItem('token');
    }
    
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }
    
    getAuthHeader() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }
    
    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const headers = {
            ...this.getAuthHeader(),
            ...options.headers
        };
        
        try {
            const response = await fetch(url, {
                ...options,
                headers
            });
            
            // Check if response is ok before parsing JSON to avoid errors on non-JSON responses (e.g., HTML error pages)
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    // Auth
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }
    
    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }
    
    async getCurrentUser() {
        return this.request('/auth/me');
    }
    
    // Memorials
    async getMemorials() {
        return this.request('/memorials');
    }
    
    async createMemorial(memorialData) {
        return this.request('/memorials', {
            method: 'POST',
            body: JSON.stringify(memorialData)
        });
    }
    
    async updateMemorial(id, memorialData) {
        return this.request(`/memorials/${id}`, {
            method: 'PUT',
            body: JSON.stringify(memorialData)
        });
    }
    
    async deleteMemorial(id) {
        return this.request(`/memorials/${id}`, {
            method: 'DELETE'
        });
    }
    
    async searchMemorials(query) {
        return this.request(`/memorials/search/public?${new URLSearchParams(query).toString()}`);
    }
    
    // Services
    async getServices() {
        return this.request('/services');
    }
    
    async createService(serviceData) {
        return this.request('/services', {
            method: 'POST',
            body: JSON.stringify(serviceData)
        });
    }
    
    async updateService(id, serviceData) {
        return this.request(`/services/${id}`, {
            method: 'PUT',
            body: JSON.stringify(serviceData)
        });
    }
    
    async deleteService(id) {
        return this.request(`/services/${id}`, {
            method: 'DELETE'
        });
    }
    
    // Visits
    async getVisits() {
        return this.request('/visits');
    }
    
    async createVisit(visitData) {
        return this.request('/visits', {
            method: 'POST',
            body: JSON.stringify(visitData)
        });
    }
}

// Create global API instance
window.API = new API();
