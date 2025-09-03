using System;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI;

public class DatabaseHelper
{
    private static string connectionString = ConfigurationManager.ConnectionStrings["PortfolioDB"].ConnectionString;

    public static void InitializeDatabase()
    {
        try
        {
            CreateTables();
            InsertDefaultData();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine("Database initialization error: " + ex.Message);
        }
    }

    private static void CreateTables()
    {
        using (SqlConnection con = new SqlConnection(connectionString))
        {
            con.Open();

            // Create AdminUsers table
            string createAdminUsers = @"
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AdminUsers' AND xtype='U')
                CREATE TABLE AdminUsers (
                    AdminId INT IDENTITY(1,1) PRIMARY KEY,
                    Username NVARCHAR(50) NOT NULL UNIQUE,
                    Password NVARCHAR(100) NOT NULL,
                    Email NVARCHAR(100),
                    CreatedDate DATETIME DEFAULT GETDATE(),
                    IsActive BIT DEFAULT 1
                )";

            // Create Projects table
            string createProjects = @"
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Projects' AND xtype='U')
                CREATE TABLE Projects (
                    ProjectId INT IDENTITY(1,1) PRIMARY KEY,
                    Title NVARCHAR(200) NOT NULL,
                    Description NVARCHAR(MAX),
                    Technologies NVARCHAR(500),
                    ImageUrl NVARCHAR(500),
                    GithubUrl NVARCHAR(500),
                    LiveUrl NVARCHAR(500),
                    CreatedDate DATETIME DEFAULT GETDATE(),
                    IsActive BIT DEFAULT 1
                )";

            // Create Education table
            string createEducation = @"
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Education' AND xtype='U')
                CREATE TABLE Education (
                    EducationId INT IDENTITY(1,1) PRIMARY KEY,
                    Degree NVARCHAR(200) NOT NULL,
                    Institution NVARCHAR(200) NOT NULL,
                    Period NVARCHAR(50),
                    Description NVARCHAR(MAX),
                    Grade NVARCHAR(50),
                    [Group] NVARCHAR(50),
                    StartYear INT,
                    IsActive BIT DEFAULT 1
                )";

            // Create Messages table
            string createMessages = @"
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Messages' AND xtype='U')
                CREATE TABLE Messages (
                    MessageId INT IDENTITY(1,1) PRIMARY KEY,
                    Name NVARCHAR(100) NOT NULL,
                    Email NVARCHAR(100) NOT NULL,
                    Subject NVARCHAR(200),
                    Message NVARCHAR(MAX),
                    ReceivedDate DATETIME DEFAULT GETDATE(),
                    IsRead BIT DEFAULT 0
                )";

            SqlCommand cmd = new SqlCommand(createAdminUsers, con);
            cmd.ExecuteNonQuery();

            cmd = new SqlCommand(createProjects, con);
            cmd.ExecuteNonQuery();

            cmd = new SqlCommand(createEducation, con);
            cmd.ExecuteNonQuery();

            cmd = new SqlCommand(createMessages, con);
            cmd.ExecuteNonQuery();
        }
    }

    private static void InsertDefaultData()
    {
        using (SqlConnection con = new SqlConnection(connectionString))
        {
            con.Open();

            // Insert default admin user
            string checkAdmin = "SELECT COUNT(*) FROM AdminUsers WHERE Username = 'admin'";
            SqlCommand checkCmd = new SqlCommand(checkAdmin, con);
            int adminCount = (int)checkCmd.ExecuteScalar();

            if (adminCount == 0)
            {
                string insertAdmin = "INSERT INTO AdminUsers (Username, Password, Email) VALUES ('admin', 'admin123', 'admin@portfolio.com')";
                SqlCommand cmd = new SqlCommand(insertAdmin, con);
                cmd.ExecuteNonQuery();
            }

            // Insert default education records
            string checkEducation = "SELECT COUNT(*) FROM Education";
            SqlCommand checkEduCmd = new SqlCommand(checkEducation, con);
            int eduCount = (int)checkEduCmd.ExecuteScalar();

            if (eduCount == 0)
            {
                string insertEducation = @"
                    INSERT INTO Education (Degree, Institution, Period, Description, Grade, [Group], StartYear) VALUES 
                    ('Bachelor of Science in Computer Science and Engineering (BSc)', 'Khulna University of Engineering & Technology (KUET)', '2022 - Present', 'Currently pursuing my undergraduate degree in Computer Science and Engineering with focus on software development, algorithms, and system design.', 'CGPA: 3.53/4.00', 'Expected Graduation: 2027', 2022),
                    ('Higher Secondary Certificate (HSC)', 'Notre Dame College,Dhaka', '2019 - 2021', 'Completed higher secondary education in Science group with concentration in Mathematics, Physics, Chemistry, and Biology.', 'GPA: 5.00/5.00', 'Group: Science', 2019),
                    ('Secondary School Certificate (SSC)', 'Bogura Zilla School,Bogura', '2017 - 2019', 'Completed secondary education with excellent academic performance in Science group, building strong foundation in mathematics and sciences.', 'GPA: 5.00/5.00', 'Group: Science', 2017)";
                
                SqlCommand cmd = new SqlCommand(insertEducation, con);
                cmd.ExecuteNonQuery();
            }
        }
    }
}
