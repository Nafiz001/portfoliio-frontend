// Admin Panel JavaScript
const API_BASE_URL = 'http://localhost:5000/api'; // Backend API URL

// Authentication state
let isLoggedIn = false;
let currentUser = null;

// DOM Elements
let loginForm, dashboard, adminLoginForm, errorMessage, welcomeMessage;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin panel DOM loaded');
    
    // Initialize DOM elements
    loginForm = document.getElementById('loginForm');
    dashboard = document.getElementById('dashboard');
    adminLoginForm = document.getElementById('adminLoginForm');
    errorMessage = document.getElementById('errorMessage');
    welcomeMessage = document.getElementById('welcomeMessage');
    
    console.log('DOM elements found:', {
        loginForm: !!loginForm,
        dashboard: !!dashboard,
        adminLoginForm: !!adminLoginForm,
        errorMessage: !!errorMessage,
        welcomeMessage: !!welcomeMessage
    });
    
    // Test API connection
    testAPIConnection();
    
    checkAuthStatus();
    initializeForms();
    initializeEventListeners();
});

// Initialize event listeners
function initializeEventListeners() {
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleLogin);
    }
}

// Test API connection
async function testAPIConnection() {
    console.log('Testing API connection to:', API_BASE_URL);
    try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log('API test response status:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('API test successful! Received projects:', data);
        } else {
            console.error('API test failed with status:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('API connection test error:', error);
    }
}

// Check if user is already logged in
function checkAuthStatus() {
    // Clear any existing auth for fresh start - UNCOMMENT TO FORCE FRESH LOGIN
    // localStorage.removeItem('authToken');
    // localStorage.removeItem('username');
    
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    
    console.log('Checking auth status - token:', token ? token.substring(0, 20) + '...' : 'none');
    console.log('Checking auth status - username:', username);
    
    if (token && username) {
        isLoggedIn = true;
        currentUser = username;
        showDashboard();
    }
}

// Show dashboard
function showDashboard() {
    if (loginForm) loginForm.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';
    if (welcomeMessage) welcomeMessage.textContent = `Welcome back, ${currentUser}!`;
    showSection('projects'); // Show projects by default
}

// Show login form
function showLoginForm() {
    if (loginForm) loginForm.style.display = 'block';
    if (dashboard) dashboard.style.display = 'none';
    if (errorMessage) errorMessage.textContent = '';
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    
    if (!usernameField || !passwordField) {
        console.error('Username or password field not found');
        return;
    }
    
    const username = usernameField.value;
    const password = passwordField.value;
    
    console.log('Attempting login with username:', username);
    
    try {
        const result = await PortfolioAPI.login(username, password);
        console.log('Login successful:', result);
        
        if (result.Success || result.success) { // Handle both backend and fallback response formats
            isLoggedIn = true;
            currentUser = result.Username || result.username || username;
            showDashboard();
            if (errorMessage) errorMessage.textContent = '';
        }
    } catch (error) {
        console.error('Login error:', error);
        if (errorMessage) errorMessage.textContent = 'Invalid username or password. Please try again.';
        if (passwordField) passwordField.value = '';
    }
}

// Handle logout
function logout() {
    PortfolioAPI.logout();
    isLoggedIn = false;
    currentUser = null;
    showLoginForm();
    
    // Clear forms
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    if (usernameField) usernameField.value = '';
    if (passwordField) passwordField.value = '';
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    isLoggedIn = false;
    currentUser = null;
    showLoginForm();
}

// Show different sections
function showSection(section) {
    // Hide all sections
    const projectsSection = document.getElementById('projectsSection');
    if (projectsSection) projectsSection.style.display = 'none';
    
    // Show selected section
    const targetSection = document.getElementById(section + 'Section');
    if (targetSection) targetSection.style.display = 'block';
    
    // Load data for the section
    if (section === 'projects') {
        loadProjectsAdmin();
    }
}

// Initialize forms
function initializeForms() {
    // Project form
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', handleAddProject);
    }
}

// Handle add project
async function handleAddProject(e) {
    e.preventDefault();
    
    console.log('Add project form submitted');
    
    // Get form values
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const image = document.getElementById('projectImage').value.trim();
    const liveUrl = document.getElementById('projectLive').value.trim();
    const githubUrl = document.getElementById('projectGithub').value.trim();
    const technologies = document.getElementById('projectTech').value.trim();
    
    // Validate required fields
    if (!title) {
        alert('Project title is required');
        return;
    }
    if (!description) {
        alert('Project description is required');
        return;
    }
    if (!image) {
        alert('Project image URL is required');
        return;
    }
    if (!technologies) {
        alert('Technologies field is required');
        return;
    }
    
    const projectData = {
        title: title,
        description: description,
        image: image,
        technologies: technologies,
        // Only include URLs if they're not empty and appear to be valid URLs
        ...(liveUrl && liveUrl.startsWith('http') ? { liveUrl: liveUrl } : {}),
        ...(githubUrl && githubUrl.startsWith('http') ? { githubUrl: githubUrl } : {})
    };
    
    console.log('Project data:', projectData);
    
    try {
        console.log('Calling PortfolioAPI.addProject...');
        const result = await PortfolioAPI.addProject(projectData);
        console.log('Add project result:', result);
        
        // Clear form
        document.getElementById('projectForm').reset();
        
        // Reload projects list
        console.log('Reloading projects list...');
        await loadProjectsAdmin();
        
        alert('Project added successfully!');
    } catch (error) {
        console.error('Error adding project:', error);
        alert('Error adding project: ' + error.message);
    }
}

// Load projects for admin
async function loadProjectsAdmin() {
    try {
        const projects = await PortfolioAPI.getProjects();
        const container = document.getElementById('projectsList');
        
        if (projects.length === 0) {
            container.innerHTML = '<p style="color: #ccc; text-align: center;">No projects found. Add some projects to get started!</p>';
            return;
        }
        
        container.innerHTML = projects.map(project => `
            <div class="project-item">
                <div>
                    <h4 style="color: #00a8ff; margin: 0 0 0.5rem 0;">${project.title}</h4>
                    <p style="color: #ccc; margin: 0; font-size: 0.9rem;">${project.description}</p>
                    <div style="margin-top: 0.5rem;">
                        ${project.technologies ? project.technologies.split(',').map(tech => 
                            `<span style="background: #0073e6; color: white; padding: 2px 6px; border-radius: 3px; font-size: 0.8rem; margin-right: 0.25rem;">${tech.trim()}</span>`
                        ).join('') : ''}
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteProject(${project.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Delete project
async function deleteProject(projectId) {
    console.log('Delete project called with ID:', projectId);
    
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            console.log('Calling PortfolioAPI.deleteProject...');
            const result = await PortfolioAPI.deleteProject(projectId);
            console.log('Delete project result:', result);
            
            console.log('Reloading projects list...');
            await loadProjectsAdmin();
            alert('Project deleted successfully!');
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Error deleting project: ' + error.message);
        }
    }
}

// Include the same PortfolioAPI class from script.js
class PortfolioAPI {
    static async makeRequest(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log('Making API request to:', url, 'with options:', options);
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('Added auth token to request:', token.substring(0, 20) + '...');
        } else {
            console.log('No auth token found in localStorage');
        }

        try {
            console.log('Sending request with config:', config);
            const response = await fetch(url, config);
            console.log('Response received:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('HTTP error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Response data:', data);
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            
            // Only fallback to localStorage for GET projects and specific operations
            if (endpoint === '/projects' && options.method === 'GET') {
                console.log('Falling back to localStorage for GET projects');
                return this.fallbackToLocalStorage(endpoint, options);
            }
            
            // Don't fallback for auth, POST, DELETE operations - let them fail properly
            throw error;
        }
    }

    // Fallback to localStorage when backend is not available
    static fallbackToLocalStorage(endpoint, options) {
        console.log('Using localStorage fallback for:', endpoint);
        
        if (endpoint === '/projects' && options.method === 'GET') {
            return JSON.parse(localStorage.getItem('projects') || '[]');
        }
        
        if (endpoint === '/projects' && options.method === 'POST') {
            const projects = JSON.parse(localStorage.getItem('projects') || '[]');
            const newProject = JSON.parse(options.body);
            newProject.id = Date.now();
            projects.push(newProject);
            localStorage.setItem('projects', JSON.stringify(projects));
            return newProject;
        }
        
        if (endpoint.startsWith('/projects/') && options.method === 'DELETE') {
            const projectId = parseInt(endpoint.split('/')[2]);
            const projects = JSON.parse(localStorage.getItem('projects') || '[]');
            const filteredProjects = projects.filter(p => p.id !== projectId);
            localStorage.setItem('projects', JSON.stringify(filteredProjects));
            return { success: true };
        }
        
        return {};
    }

    // Projects API
    static async getProjects() {
        return this.makeRequest('/projects', { method: 'GET' });
    }

    static async addProject(projectData) {
        return this.makeRequest('/projects', {
            method: 'POST',
            body: JSON.stringify(projectData)
        });
    }

    static async deleteProject(projectId) {
        return this.makeRequest(`/projects/${projectId}`, {
            method: 'DELETE'
        });
    }

    // Authentication API
    static async login(username, password) {
        console.log('Attempting backend login for:', username);
        
        try {
            const response = await this.makeRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            
            console.log('Backend login response:', response);
            
            if (response.Success && response.Token) { 
                localStorage.setItem('authToken', response.Token);
                localStorage.setItem('username', response.Username);
                return response;
            } else if (response.Token || response.token) { // Handle fallback format
                const token = response.Token || response.token;
                const user = response.Username || response.username || username;
                localStorage.setItem('authToken', token);
                localStorage.setItem('username', user);
                return response;
            }
            
            throw new Error(response.Message || 'Login failed');
        } catch (error) {
            console.error('Backend login failed:', error);
            console.log('Attempting fallback authentication...');
            
            // Fallback to simple client-side auth for demo
            const validCredentials = [
                { username: 'admin', password: 'admin123' },
                { username: 'nafiz', password: 'portfolio2025' }
            ];

            const isValid = validCredentials.some(cred => 
                cred.username === username && cred.password === password
            );

            if (isValid) {
                // Create a more realistic JWT-like token for fallback
                const fallbackToken = 'Bearer_' + btoa(`${username}:${Date.now()}`);
                localStorage.setItem('authToken', fallbackToken);
                localStorage.setItem('username', username);
                return { Success: true, success: true, Token: fallbackToken, token: fallbackToken, Username: username, username };
            }

            throw new Error('Invalid credentials');
        }
    }

    static logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        console.log('Logged out, cleared localStorage');
    }
    
    // Test function to clear auth and refresh
    static clearAuth() {
        this.logout();
        window.location.reload();
    }
}
