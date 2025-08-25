// Admin Panel JavaScript
const API_BASE_URL = 'https://web-production-813ca.up.railway.app/api'; // Backend API URL (local testing)

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
    
    // Image type toggle listeners
    const imageTypeUrl = document.getElementById('imageTypeUrl');
    const imageTypeFile = document.getElementById('imageTypeFile');
    const urlInputGroup = document.getElementById('urlInputGroup');
    const fileInputGroup = document.getElementById('fileInputGroup');
    const projectImageFile = document.getElementById('projectImageFile');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    if (imageTypeUrl && imageTypeFile) {
        imageTypeUrl.addEventListener('change', function() {
            if (this.checked) {
                urlInputGroup.style.display = 'block';
                fileInputGroup.style.display = 'none';
                imagePreview.style.display = 'none';
                document.getElementById('projectImage').required = true;
            }
        });
        
        imageTypeFile.addEventListener('change', function() {
            if (this.checked) {
                urlInputGroup.style.display = 'none';
                fileInputGroup.style.display = 'block';
                document.getElementById('projectImage').required = false;
            }
        });
    }
    
    // File upload preview
    if (projectImageFile) {
        projectImageFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file.');
                    this.value = '';
                    return;
                }
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Image size should be less than 5MB.');
                    this.value = '';
                    return;
                }
                
                // Show preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    imagePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.style.display = 'none';
            }
        });
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
        // Check if token is expired by trying to decode it (for JWT tokens)
        if (isTokenExpired(token)) {
            console.log('Token has expired, clearing auth');
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            showLoginForm();
            return;
        }
        
        isLoggedIn = true;
        currentUser = username;
        showDashboard();
    }
}

// Check if JWT token is expired
function isTokenExpired(token) {
    try {
        // For JWT tokens, decode the payload to check expiration
        if (token.includes('.')) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp && payload.exp < currentTime;
        }
        // For fallback tokens, consider them valid for 24 hours
        const tokenAge = Date.now() - (localStorage.getItem('tokenTimestamp') || 0);
        return tokenAge > (24 * 60 * 60 * 1000); // 24 hours
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true; // Consider expired if we can't parse it
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
            
            // Store timestamp for token expiration tracking
            localStorage.setItem('tokenTimestamp', Date.now().toString());
            
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
    localStorage.removeItem('tokenTimestamp');
    isLoggedIn = false;
    currentUser = null;
    showLoginForm();
}

// Show different sections
function showSection(section) {
    // Hide all sections
    const projectsSection = document.getElementById('projectsSection');
    const educationSection = document.getElementById('educationSection');
    if (projectsSection) projectsSection.style.display = 'none';
    if (educationSection) educationSection.style.display = 'none';
    
    // Show selected section
    const targetSection = document.getElementById(section + 'Section');
    if (targetSection) targetSection.style.display = 'block';
    
    // Load data for the section
    if (section === 'projects') {
        loadProjectsAdmin();
    } else if (section === 'education') {
        loadEducationAdmin();
    }
}

// Initialize forms
function initializeForms() {
    // Project form
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', handleAddProject);
    }
    
    // Education form
    const educationForm = document.getElementById('educationForm');
    if (educationForm) {
        educationForm.addEventListener('submit', handleAddEducation);
    }
}

// Handle add project
async function handleAddProject(e) {
    e.preventDefault();
    
    console.log('Add project form submitted');
    
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    console.log('Auth status - Token exists:', !!token, 'Username:', username);
    
    if (!token) {
        alert('You must be logged in to add projects. Please log in again.');
        return;
    }
    
    // Get form values
    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const liveUrl = document.getElementById('projectLive').value.trim();
    const githubUrl = document.getElementById('projectGithub').value.trim();
    const technologies = document.getElementById('projectTech').value.trim();
    
    // Get image based on selected type
    const imageTypeUrl = document.getElementById('imageTypeUrl').checked;
    const imageUrl = document.getElementById('projectImage').value.trim();
    const imageFile = document.getElementById('projectImageFile').files[0];
    
    let finalImageUrl = '';
    
    if (imageTypeUrl) {
        if (!imageUrl) {
            alert('Please provide an image URL or switch to file upload.');
            return;
        }
        finalImageUrl = imageUrl;
    } else {
        if (!imageFile) {
            alert('Please select an image file or switch to URL input.');
            return;
        }
        // Convert file to base64 data URL for local storage
        finalImageUrl = await convertFileToDataURL(imageFile);
    }
    
    // Validate required fields
    if (!title) {
        alert('Project title is required');
        return;
    }
    if (!description) {
        alert('Project description is required');
        return;
    }
    if (!technologies) {
        alert('Technologies field is required');
        return;
    }
    
    const projectData = {
        title: title,
        description: description,
        image: finalImageUrl,
        technologies: technologies,
        // Only include URLs if they're not empty and appear to be valid URLs (use backend model field names)
        ...(liveUrl && liveUrl.startsWith('http') ? { liveUrl: liveUrl } : {}),
        ...(githubUrl && githubUrl.startsWith('http') ? { gitHubUrl: githubUrl } : {})
    };
    
    console.log('Project data:', projectData);
    
    try {
        console.log('Calling PortfolioAPI.addProject...');
        const result = await PortfolioAPI.addProject(projectData);
        console.log('Add project result:', result);
        
        // Clear form
        document.getElementById('projectForm').reset();
        
        // Reset image preview and radio buttons
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('imageTypeUrl').checked = true;
        document.getElementById('urlInputGroup').style.display = 'block';
        document.getElementById('fileInputGroup').style.display = 'none';
        
        // Reload projects list
        console.log('Reloading projects list...');
        await loadProjectsAdmin();
        
        alert('Project added successfully!');
    } catch (error) {
        console.error('Error adding project:', error);
        
        // More detailed error information
        if (error.message.includes('401')) {
            alert('Authentication failed. Please log in again.');
            logout(); // Force re-login
        } else if (error.message.includes('Failed to fetch')) {
            alert('Network error. Please check your internet connection and try again.');
        } else {
            alert('Error adding project: ' + error.message);
        }
    }
}

// Helper function to convert file to data URL
function convertFileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
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
    
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    console.log('Auth status - Token exists:', !!token, 'Username:', username);
    
    if (!token) {
        alert('You must be logged in to delete projects. Please log in again.');
        return;
    }
    
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
            
            // More detailed error information
            if (error.message.includes('401')) {
                alert('Authentication failed. Please log in again.');
                logout(); // Force re-login
            } else if (error.message.includes('Failed to fetch')) {
                alert('Network error. Please check your internet connection and try again.');
            } else {
                alert('Error deleting project: ' + error.message);
            }
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
            // Handle both Bearer-prefixed and plain tokens
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            config.headers['Authorization'] = authToken;
            console.log('Added auth token to request:', authToken.substring(0, 20) + '...');
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
                
                // Log specific error details
                if (response.status === 401) {
                    console.error('Authentication failed - token may be invalid or expired');
                } else if (response.status === 403) {
                    console.error('Access forbidden - insufficient permissions');
                } else if (response.status === 404) {
                    console.error('Resource not found');
                }
                
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Response data:', data);
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            
            // Enhanced error logging
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                console.error('Network error - possibly CORS, network connectivity, or server issues');
                console.error('Request details:', { url, method: options.method || 'GET', headers: config.headers });
            }
            
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
                // Create a simple token for fallback (without Bearer prefix since it's added in makeRequest)
                const fallbackToken = btoa(`${username}:${Date.now()}`);
                localStorage.setItem('authToken', fallbackToken);
                localStorage.setItem('username', username);
                localStorage.setItem('tokenTimestamp', Date.now().toString());
                return { Success: true, success: true, Token: fallbackToken, token: fallbackToken, Username: username, username };
            }

            throw new Error('Invalid credentials');
        }
    }

    static logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('tokenTimestamp');
        console.log('Logged out, cleared localStorage');
    }
    
    // Test function to clear auth and refresh
    static clearAuth() {
        this.logout();
        window.location.reload();
    }
}

// Education Management Functions
async function handleAddEducation(e) {
    e.preventDefault();
    
    const degree = document.getElementById('educationDegree').value;
    const institution = document.getElementById('educationInstitution').value;
    const duration = document.getElementById('educationDuration').value;
    const description = document.getElementById('educationDescription').value;
    const grade = document.getElementById('educationGrade').value;
    const location = document.getElementById('educationLocation').value;
    
    try {
        const response = await makeAuthenticatedRequest('/education', {
            method: 'POST',
            body: JSON.stringify({
                Degree: degree,
                Institution: institution,
                Duration: duration,
                Description: description,
                Grade: grade,
                Location: location
            })
        });
        
        if (response) {
            alert('Education added successfully!');
            document.getElementById('educationForm').reset();
            loadEducationAdmin();
        }
    } catch (error) {
        console.error('Error adding education:', error);
        alert('Error adding education: ' + error.message);
    }
}

async function loadEducationAdmin() {
    try {
        const response = await fetch(`${API_BASE_URL}/education`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const education = await response.json();
        console.log('Loaded education:', education);
        
        const educationList = document.getElementById('educationList');
        if (!educationList) return;
        
        if (education.length === 0) {
            educationList.innerHTML = '<p style="color: #ccc; text-align: center; padding: 2rem;">No education entries found. Add your first education entry above.</p>';
            return;
        }
        
        educationList.innerHTML = education.map(edu => `
            <div class="education-item">
                <div class="education-header">
                    <h4 style="color: #fff; margin: 0;">${edu.degree}</h4>
                    <button class="delete-btn" onclick="deleteEducation(${edu.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
                <div class="education-details">
                    <div><strong>Institution:</strong> ${edu.institution}</div>
                    <div><strong>Duration:</strong> ${edu.duration}</div>
                    ${edu.grade ? `<div><strong>Grade:</strong> ${edu.grade}</div>` : ''}
                    ${edu.location ? `<div><strong>Location:</strong> ${edu.location}</div>` : ''}
                    ${edu.description ? `<div><strong>Description:</strong> ${edu.description}</div>` : ''}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading education:', error);
        const educationList = document.getElementById('educationList');
        if (educationList) {
            educationList.innerHTML = '<p style="color: #ff4757; text-align: center; padding: 2rem;">Error loading education. Please try again.</p>';
        }
    }
}

async function deleteEducation(educationId) {
    if (!confirm('Are you sure you want to delete this education entry?')) {
        return;
    }
    
    try {
        const response = await makeAuthenticatedRequest(`/education/${educationId}`, {
            method: 'DELETE'
        });
        
        if (response) {
            alert('Education deleted successfully!');
            loadEducationAdmin();
        }
    } catch (error) {
        console.error('Error deleting education:', error);
        alert('Error deleting education: ' + error.message);
    }
}
