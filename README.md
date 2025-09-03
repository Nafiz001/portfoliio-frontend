# Portfolio ASP.NET Web Forms Application

This is a portfolio website built with ASP.NET Web Forms and SQL Server, following the Lab 6 tutorial methodology.

## Features

- **Portfolio Display**: Shows projects and education information from database
- **Admin Panel**: CRUD operations for managing projects and education
- **Contact Form**: Stores messages in database
- **Responsive Design**: Uses existing CSS styles

## Database Configuration

- **Server**: NAFIZ\SQLEXPRESS
- **Database**: PortfolioDB
- **Connection**: Integrated Security (Windows Authentication)

## Setup Instructions

1. **Prerequisites**:
   - IIS or Visual Studio with ASP.NET Web Forms
   - SQL Server Express (NAFIZ\SQLEXPRESS)
   - .NET Framework 4.7.2 or higher

2. **Database Setup**:
   - The application will automatically create the database and tables
   - Visit `Setup.aspx` to initialize the database
   - Default admin credentials: `admin` / `admin123`

3. **Files Structure**:
   - `Default.aspx` - Main portfolio page (wraps index.html content)
   - `Admin.aspx` - Admin panel for CRUD operations
   - `Setup.aspx` - Database initialization page
   - `web.config` - Configuration file
   - Original files (index.html, admin.html, styles.css) are preserved

## Database Tables

1. **AdminUsers**: Admin login credentials
2. **Projects**: Portfolio projects with CRUD operations
3. **Education**: Education records with CRUD operations  
4. **Messages**: Contact form submissions

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

## Usage

1. Visit `Setup.aspx` first to initialize the database
2. Go to `Default.aspx` to view the portfolio
3. Access `Admin.aspx` to manage content
4. Use admin credentials to login and manage projects/education

## Technical Implementation

- Follows Lab 6 tutorial methodology for database operations
- Uses SqlConnection and SqlCommand for database operations
- Implements session management for admin authentication
- Preserves original HTML/CSS design while adding server-side functionality
- Uses GridView controls for displaying and managing data

## Security Notes

- In production, implement password hashing
- Add input validation and SQL injection protection
- Consider implementing proper authentication mechanisms
