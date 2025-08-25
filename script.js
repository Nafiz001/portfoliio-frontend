// Configuration
const API_BASE_URL = 'https://web-production-813ca.up.railway.app/api'; // Backend API URL (local testing)
// For development, you can use: 'http://localhost:5000/api'

// API Helper Functions
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
            // Handle both Bearer-prefixed and plain tokens
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            config.headers['Authorization'] = authToken;
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

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Navigation functionality
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && hamburger) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && hamburger && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Load content when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await loadProjects();
    initContactForm();
    initAnimations();
});

// Load projects from API
async function loadProjects() {
    try {
        const projects = await PortfolioAPI.getProjects();
        const container = document.getElementById('projects-container');
        
        if (!container) return;

        if (projects.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #ccc; grid-column: 1 / -1;">
                    <p>No projects available. Check back soon!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = projects.map(project => `
            <div class="project-card" data-aos="fade-up">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/400x250/333/fff?text=Project+Image'">
                    <div class="project-overlay">
                        <div class="project-links">
                            ${project.liveUrl || project.LiveUrl ? `<a href="${project.liveUrl || project.LiveUrl}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i></a>` : ''}
                            ${project.githubUrl || project.gitHubUrl || project.GitHubUrl ? `<a href="${project.githubUrl || project.gitHubUrl || project.GitHubUrl}" target="_blank" class="project-link"><i class="fab fa-github"></i></a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-technologies">
                        ${project.technologies ? project.technologies.split(',').map(tech => 
                            `<span class="tech-tag">${tech.trim()}</span>`
                        ).join('') : ''}
                    </div>
                </div>
            </div>
        `).join('');

        // Update project count in hero section
        const projectCount = document.getElementById('project-count');
        if (projectCount) {
            projectCount.textContent = projects.length;
        }

    } catch (error) {
        console.error('Error loading projects:', error);
        const container = document.getElementById('projects-container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; color: #ff4757; grid-column: 1 / -1;">
                    <p>Error loading projects. Please try again later.</p>
                </div>
            `;
        }
    }
}

// Initialize contact form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        try {
            // You can implement this API endpoint in your backend
            // await PortfolioAPI.sendMessage(formData);
            
            // For now, just show success message
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
            
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Sorry, there was an error sending your message. Please try again.');
        }
    });
}

// Initialize animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    document.querySelectorAll('.project-card, .service-card, .skill-category').forEach(el => {
        observer.observe(el);
    });

    // Typing animation for hero title
    const titleElement = document.querySelector('.title-main');
    if (titleElement) {
        const text = titleElement.textContent;
        titleElement.textContent = '';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                titleElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
}

// Load projects on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});

// Education timeline animations
function initEducationAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(item);
    });
}

// Initialize education animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initEducationAnimations, 500);
});
