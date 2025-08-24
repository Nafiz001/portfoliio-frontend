// Admin Panel JavaScript
const API_BASE_URL = 'https://your-backend-api.herokuapp.com/api'; // Replace with your backend URL

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

// Check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    
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
        
        if (result.success) {
            isLoggedIn = true;
            currentUser = username;
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
    
    const projectData = {
        title: document.getElementById('projectTitle').value,
        description: document.getElementById('projectDescription').value,
        image: document.getElementById('projectImage').value,
        liveUrl: document.getElementById('projectLive').value,
        githubUrl: document.getElementById('projectGithub').value,
        technologies: document.getElementById('projectTech').value
    };
    
    try {
        await PortfolioAPI.addProject(projectData);
        
        // Clear form
        document.getElementById('projectForm').reset();
        
        // Reload projects list
        loadProjectsAdmin();
        
        alert('Project added successfully!');
    } catch (error) {
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
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            await PortfolioAPI.deleteProject(projectId);
            loadProjectsAdmin();
            alert('Project deleted successfully!');
        } catch (error) {
            alert('Error deleting project: ' + error.message);
        }
    }
}

// Include the same PortfolioAPI class from script.js
class PortfolioAPI {
    static async makeRequest(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
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
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            // Fallback to local storage for development
            return this.fallbackToLocalStorage(endpoint, options);
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
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const filteredProjects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('projects', JSON.stringify(filteredProjects));
        return { success: true };
    }

    // Authentication API
    static async login(username, password) {
        // Simple client-side auth for demo
        const validCredentials = [
            { username: 'admin', password: 'admin123' },
            { username: 'nafiz', password: 'portfolio2025' }
        ];

        const isValid = validCredentials.some(cred => 
            cred.username === username && cred.password === password
        );

        if (isValid) {
            const token = btoa(`${username}:${Date.now()}`); // Simple token
            localStorage.setItem('authToken', token);
            localStorage.setItem('username', username);
            return { success: true, token, username };
        }

        throw new Error('Invalid credentials');
    }

    static logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
    }
}
