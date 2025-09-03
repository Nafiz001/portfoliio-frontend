<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nafiz - Portfolio</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">
    
    <!-- Additional inline styles for smooth animations -->
    <style>
        /* Navigation Logo Styles */
        .nav-logo img {
            height: 60px;
            width: auto;
            max-width: 200px;
            object-fit: contain;
            transition: transform 0.3s ease, filter 0.3s ease;
            
            border-radius: 8px;
            
        }
        
        .nav-logo img:hover {
            transform: scale(1.05);
            filter: brightness(1.2) contrast(1.2);
        }
        
        /* Light theme adjustments for logo */
        [data-theme="light"] .nav-logo img {
            content: url('logo3.png');
            height: 60px;
            width: auto;
            max-width: 200px;
            object-fit: contain;
            filter: contrast(2);
            
            background: transparent;
            mix-blend-mode: normal;
        }
        
        [data-theme="light"] .nav-logo img:hover {
            filter: brightness(0.9) contrast(2.9);
        }
        
        .nav-logo a {
            display: flex;
            align-items: center;
            text-decoration: none;
        }
        
        /* Mouse Follower Animation Styles */
        .mouse-follower {
            position: fixed;
            width: 30px;
            height: 30px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.7;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease, opacity 0.2s ease;
            mix-blend-mode: difference;
        }

        .mouse-follower-delayed {
            position: fixed;
            width: 50px;
            height: 50px;
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0.5;
            transform: translate(-50%, -50%);
            transition: transform 0.2s ease, opacity 0.2s ease;
        }

        /* Hide default cursor on main sections */
        .hero, .about, .projects, .contact, .education {
            cursor: none;
        }

        /* Show pointer on interactive elements */
        a, button, .btn-primary, .btn-secondary, .project-card, .theme-toggle {
            cursor: pointer !important;
        }

        /* Enhanced hover effects for mouse follower */
        .mouse-follower.hover-active {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 1;
            background: var(--primary-light, #00ff88);
        }

        .mouse-follower-delayed.hover-active {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0.8;
            border-color: var(--primary-light, #00ff88);
        }
        
        .project-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-radius: 12px;
            overflow: hidden;
            background: var(--card-background);
            border: 1px solid var(--border-color);
        }
        
        .project-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .project-image {
            position: relative;
            height: 200px;
            overflow: hidden;
        }
        
        .project-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .project-card:hover .project-image img {
            transform: scale(1.05);
        }
        
        .project-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .project-card:hover .project-overlay {
            opacity: 1;
        }
        
        .project-overlay .project-links {
            display: flex;
            gap: 1rem;
        }
        
        .project-overlay .project-link {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: transform 0.2s ease;
        }
        
        .project-overlay .project-link:hover {
            transform: scale(1.1);
            background: var(--primary-light);
        }
        
        .project-content {
            padding: 1.5rem;
        }
        
        .project-content h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .project-content p {
            margin: 0 0 1rem 0;
            color: var(--text-secondary);
            line-height: 1.5;
        }
        
        .project-technologies {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .tech-tag {
            background: var(--primary-color);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .timeline-item {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Smooth scrolling */
        html {
            scroll-behavior: smooth;
        }
        
        /* Enhanced projects grid */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        @media (max-width: 768px) {
            .projects-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
        }
        
        /* About Section Styles */
        .about-content {
            display: flex;
            align-items: center;
            gap: 3rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .about-image {
            flex: 0 0 auto;
        }
        
        .about-profile-image {
            width: 300px;
            height: 350px;
            object-fit: cover;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 2px solid var(--primary-color, #00a8ff);
        }
        
        .about-profile-image:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        }
        
        .about-text {
            flex: 1;
        }
        
        /* Responsive design for about section */
        @media (max-width: 768px) {
            .about-content {
                flex-direction: column;
                text-align: center;
                gap: 2rem;
            }
            
            .about-profile-image {
                width: 250px;
                height: 250px;
                border-radius: 15px;
            }
        }
        
        @media (max-width: 480px) {
            .about-profile-image {
                width: 200px;
                height: 200px;
                border-radius: 12px;
            }
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <!-- Navigation -->
        <nav class="navbar" id="navbar">
            <div class="nav-container">
                <div class="nav-logo">
                    <a href="#home">
                        <img src="logo4.png" alt="Nafiz Portfolio Logo" />
                    </a>
                </div>
                <div class="nav-right">
                    <ul class="nav-menu" id="nav-menu">
                        <li><a href="#home" class="nav-link">Home</a></li>
                        <li><a href="#about" class="nav-link">About</a></li>
                        <li><a href="#education" class="nav-link">Education</a></li>
                        <li><a href="#projects" class="nav-link">Projects</a></li>
                        <li><a href="#contact" class="nav-link">Contact</a></li>
                    </ul>
                    <div class="theme-toggle" id="themeToggle">
                        <i class="fas fa-sun" id="themeIcon"></i>
                    </div>
                </div>
                <div class="hamburger" id="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section id="home" class="hero">
            <div class="hero-content">
                <div class="hero-text">
                    <span class="greeting">Hello! I'm an aspiring</span>
                    <h1 class="hero-title">
                        <span class="title-main">CSE student</span>
                    </h1>
                    <p class="hero-description">
                        High experienced in delivering solid and scalable web solutions with 
                        the latest technology stack. Let's build your next awesome project together.
                    </p>
                    <div class="hero-buttons">
                        <a href="#contact" class="btn-primary">Get In Touch</a>
                        <a href="resume.pdf" download class="btn-secondary">Download CV</a>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="Profile_pic.jpg" alt="Nafiz" class="profile-image">
                    
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="about">
            <div class="container">
                <div class="about-content">
                    <div class="about-image">
                        <img src="sidepic.jpg" alt="Nafiz Profile Picture" class="about-profile-image">
                    </div>
                    <div class="about-text">
                        <h2 class="section-title">About Me</h2>
                        <p class="about-description">
                            I'm a passionate full-stack developer with expertise in modern web technologies. 
                            I love creating efficient, scalable solutions that solve real-world problems.
                        </p>
                        <div class="about-details">
                            <div class="detail-item">
                                <strong>Name:</strong> Nafiz
                            </div>
                            <div class="detail-item">
                                <strong>Experience:</strong> 2+ Years
                            </div>
                            <div class="detail-item">
                                <strong>Location:</strong> Available Worldwide
                            </div>
                            <div class="detail-item">
                                <strong>Email:</strong> nafiz@example.com
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Education Section -->
        <section id="education" class="education">
            <div class="container">
                <h2 class="section-title">Education</h2>
                <div class="education-timeline">
                    <asp:Repeater ID="rptEducation" runat="server">
                        <ItemTemplate>
                            <div class="timeline-item">
                                <div class="timeline-marker"></div>
                                <div class="timeline-content">
                                    <div class="timeline-date"><%# Eval("Period") %></div>
                                    <h3><%# Eval("Degree") %></h3>
                                    <h4><%# Eval("Institution") %></h4>
                                    <p><%# Eval("Description") %></p>
                                    <div class="education-details">
                                        <span class="detail-tag"><%# Eval("Grade") %></span>
                                        <span class="detail-tag"><%# Eval("Group") %></span>
                                    </div>
                                </div>
                            </div>
                        </ItemTemplate>
                    </asp:Repeater>
                </div>
            </div>
        </section>

        <!-- Projects Section -->
        <section id="projects" class="projects">
            <div class="container">
                <h2 class="section-title">Latest Projects</h2>
                <div class="projects-grid" id="projects-container">
                    <asp:Repeater ID="rptProjects" runat="server">
                        <ItemTemplate>
                            <div class="project-card" data-aos="fade-up">
                                <div class="project-image">
                                    <img src="<%# Eval("ImageUrl") %>" alt="<%# Eval("Title") %>" onerror="this.src='https://via.placeholder.com/400x250/333/fff?text=Project+Image'">
                                    <div class="project-overlay">
                                        <div class="project-links">
                                            <%# !string.IsNullOrEmpty(Eval("LiveUrl") as string) ? 
                                                "<a href=\"" + Eval("LiveUrl") + "\" target=\"_blank\" class=\"project-link\"><i class=\"fas fa-external-link-alt\"></i></a>" : "" %>
                                            <%# !string.IsNullOrEmpty(Eval("GithubUrl") as string) ? 
                                                "<a href=\"" + Eval("GithubUrl") + "\" target=\"_blank\" class=\"project-link\"><i class=\"fab fa-github\"></i></a>" : "" %>
                                        </div>
                                    </div>
                                </div>
                                <div class="project-content">
                                    <h3><%# Eval("Title") %></h3>
                                    <p><%# Eval("Description") %></p>
                                    <div class="project-technologies">
                                        <%# GetTechTags(Eval("Technologies") as string) %>
                                    </div>
                                </div>
                            </div>
                        </ItemTemplate>
                    </asp:Repeater>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="contact">
            <div class="container">
                <h2 class="section-title">Get In Touch</h2>
                <div class="contact-content">
                    <div class="contact-info">
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <div>
                                <h4>Email</h4>
                                <p>nafizahmed000@gmail.com</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <div>
                                <h4>Phone</h4>
                                <p>+8801634324335</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <h4>Location</h4>
                                <p>KUET, Fulbarigate, Khulna</p>
                            </div>
                        </div>
                    </div>
                    <div class="contact-form">
                        <div class="form-group">
                            <asp:TextBox ID="txtName" runat="server" placeholder="Your Name" CssClass="form-control"></asp:TextBox>
                        </div>
                        <div class="form-group">
                            <asp:TextBox ID="txtEmail" runat="server" placeholder="Your Email" TextMode="Email" CssClass="form-control"></asp:TextBox>
                        </div>
                        <div class="form-group">
                            <asp:TextBox ID="txtSubject" runat="server" placeholder="Subject" CssClass="form-control"></asp:TextBox>
                        </div>
                        <div class="form-group">
                            <asp:TextBox ID="txtMessage" runat="server" placeholder="Your Message" TextMode="MultiLine" CssClass="form-control"></asp:TextBox>
                        </div>
                        <asp:Button ID="btnSendMessage" runat="server" Text="Send Message" CssClass="btn-primary" OnClick="btnSendMessage_Click" />
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-info">
                        <h3>Nafiz</h3>
                        <p>Full Stack Developer</p>
                    </div>
                    <div class="footer-social">
                        <a href="https://github.com/Nafiz001" target="_blank"><i class="fab fa-github"></i></a>
                        <a href="https://www.linkedin.com/in/nafiz-ahmed-770a3a273/" target="_blank"><i class="fab fa-linkedin"></i></a>
                        <a href="https://x.com/Nafizahmed000" target="_blank"><i class="fa-brands fa-twitter"></i></a>
                        <a href="https://www.instagram.com/nafiz_ahmed/" target="_blank"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 Nafiz. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </form>

    <!-- <script src="script.js"></script> -->
    
    <!-- AOS Animation Library -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    
    <!-- Essential functionalities inline -->
    <script>
        // Initialize AOS
        document.addEventListener('DOMContentLoaded', function() {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        });

        // Theme functionality
        function initializeTheme() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            setTheme(savedTheme);
        }

        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            const themeToggle = document.querySelector('.theme-toggle');
            if (themeToggle) {
                themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            }
        }

        function toggleTheme() {
            const currentTheme = localStorage.getItem('theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        }

        // Smooth scrolling for navigation
        function initSmoothScrolling() {
            const anchors = document.querySelectorAll('a[href^="#"]');
            anchors.forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            initializeTheme();
            initSmoothScrolling();
            initMouseFollower(); // Add mouse follower
            
            // Add theme toggle event listener
            const themeToggle = document.querySelector('.theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', toggleTheme);
            }
        });

        // Mouse follower functionality
        function initMouseFollower() {
            const follower = document.getElementById('mouseFollower');
            const followerDelayed = document.getElementById('mouseFollowerDelayed');
            
            if (!follower || !followerDelayed) return;
            
            let mouseX = 0, mouseY = 0;
            let followerX = 0, followerY = 0;
            let delayedX = 0, delayedY = 0;
            
            // Track mouse movement
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
            
            // Smooth animation loop
            function animate() {
                // Smooth following effect with different speeds
                followerX += (mouseX - followerX) * 0.9;
                followerY += (mouseY - followerY) * 0.9;
                
                delayedX += (mouseX - delayedX) * 0.3;
                delayedY += (mouseY - delayedY) * 0.3;
                
                // Update positions
                follower.style.left = followerX + 'px';
                follower.style.top = followerY + 'px';
                
                followerDelayed.style.left = delayedX + 'px';
                followerDelayed.style.top = delayedY + 'px';
                
                requestAnimationFrame(animate);
            }
            
            animate();
            
            // Interactive hover effects
            const interactiveElements = document.querySelectorAll('a, button, .project-card, .btn-primary, .btn-secondary, .theme-toggle, .nav-link');
            
            interactiveElements.forEach(element => {
                element.addEventListener('mouseenter', () => {
                    follower.classList.add('hover-active');
                    followerDelayed.classList.add('hover-active');
                });
                
                element.addEventListener('mouseleave', () => {
                    follower.classList.remove('hover-active');
                    followerDelayed.classList.remove('hover-active');
                });
            });
            
            // Hide followers when mouse leaves window
            document.addEventListener('mouseleave', () => {
                follower.style.opacity = '0';
                followerDelayed.style.opacity = '0';
            });
            
            document.addEventListener('mouseenter', () => {
                follower.style.opacity = '0.7';
                followerDelayed.style.opacity = '0.5';
            });
        }
    </script>
    
    <!-- Mouse Follower Elements -->
    <div class="mouse-follower" id="mouseFollower"></div>
    <div class="mouse-follower-delayed" id="mouseFollowerDelayed"></div>
</body>
</html>
