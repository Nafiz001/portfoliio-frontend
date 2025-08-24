# GitHub Pages Deployment Instructions

## Frontend Repository Setup

1. Create a new GitHub repository named "portfolio-frontend" (or your preferred name)

2. Navigate to your static-frontend folder and initialize git:
```bash
cd static-frontend
git init
git add .
git commit -m "Initial portfolio website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio-frontend.git
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save

4. Your site will be available at: https://YOUR_USERNAME.github.io/portfolio-frontend

## Backend API Repository Setup

1. Create a new repository named "portfolio-api"

2. You'll need to create an ASP.NET Core Web API project:
```bash
dotnet new webapi -n PortfolioAPI
cd PortfolioAPI
```

3. Configure CORS to allow your GitHub Pages domain:
```csharp
// In Program.cs or Startup.cs
app.UseCors(builder => 
    builder.WithOrigins("https://YOUR_USERNAME.github.io")
           .AllowAnyMethod()
           .AllowAnyHeader());
```

## Hosting Options for Backend API

### Option 1: Azure App Service (Free Tier Available)
1. Create Azure account
2. Create App Service
3. Deploy via GitHub Actions or Azure DevOps

### Option 2: Heroku (Free alternative: Railway.app)
1. Create account on Railway.app
2. Connect GitHub repository
3. Deploy automatically

### Option 3: Vercel API Routes
1. Create Vercel account
2. Deploy API as serverless functions

## Configuration Steps

1. Update API_BASE_URL in your frontend script.js:
```javascript
const API_BASE_URL = 'https://your-api-domain.com';
```

2. Test the connection between frontend and backend

3. Update admin credentials and implement proper authentication
