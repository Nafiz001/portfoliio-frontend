<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Admin.aspx.cs" Inherits="_Admin" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Portfolio</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .admin-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--background-dark, #1a1a1a) 0%, var(--background-light, #2a2a2a) 100%);
            padding: 20px;
        }
        
        .admin-card {
            background: var(--card-background, #333);
            padding: 3rem;
            border-radius: 20px;
            border: 1px solid var(--border-color, #555);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            width: 100%;
            max-width: 450px;
            text-align: center;
            color: #fff;
        }
        
        .dashboard {
            background: var(--card-background, #2a2a2a);
            padding: 2rem;
            border-radius: 20px;
            border: 1px solid var(--border-color, #444);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            max-width: 1200px;
            width: 100%;
            color: #fff;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
            text-align: left;
        }
        
        .form-control {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid var(--border-color, #555);
            border-radius: 8px;
            background: var(--background-light, #333);
            color: var(--text-primary, #fff);
            font-size: 1rem;
            box-sizing: border-box;
        }
        
        .btn-admin {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 1rem;
        }
        
        .nav-btn {
            padding: 10px 20px;
            background: #333;
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 0.5rem;
            text-decoration: none;
        }
        
        .nav-btn:hover {
            background: #0073e6;
            color: #fff;
            text-decoration: none;
        }
        
        .logout-btn {
            background: #ff4757;
        }
        
        .project-form {
            background: #2a2a2a;
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            color: #fff;
        }
        
        .project-item {
            background: #333;
            padding: 1rem;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .delete-btn {
            background: #ff4757;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 5px;
        }
        
        .update-btn {
            background: #2ecc71;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 5px;
        }
        
        .update-btn:hover {
            background: #27ae60;
        }
        
        .btn-secondary {
            background: #95a5a6;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.3s ease;
        }
        
        .btn-secondary:hover {
            background: #7f8c8d;
        }
        
        .error-message {
            color: #ff4757;
            font-size: 0.9rem;
            margin-top: 1rem;
            text-align: center;
        }
        
        .success-message {
            color: #2ed573;
            font-size: 1rem;
            margin-bottom: 1rem;
            text-align: center;
        }

        .gridview-style {
            width: 100%;
            background-color: #333;
            border-collapse: collapse;
            margin: 1rem 0;
        }
        
        .gridview-style th {
            background-color: #444;
            color: #fff;
            padding: 12px;
            text-align: left;
            border: 1px solid #555;
        }
        
        .gridview-style td {
            padding: 10px;
            border: 1px solid #555;
            color: #ccc;
        }
        
        .gridview-style tr:nth-child(even) {
            background-color: #3a3a3a;
        }
        
        .gridview-style tr:hover {
            background-color: #454545;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="admin-container">
            <!-- Login Form -->
            <asp:Panel ID="pnlLogin" runat="server" CssClass="admin-card">
                <h2 style="color: #fff; margin-bottom: 2rem;">
                    <i class="fas fa-lock"></i> Admin Login
                </h2>
                <div class="form-group">
                    <label style="color: #ccc;">Username</label>
                    <asp:TextBox ID="txtUsername" runat="server" CssClass="form-control" placeholder="Enter username"></asp:TextBox>
                </div>
                <div class="form-group">
                    <label style="color: #ccc;">Password</label>
                    <asp:TextBox ID="txtPassword" runat="server" TextMode="Password" CssClass="form-control" placeholder="Enter password"></asp:TextBox>
                </div>
                <asp:Button ID="btnLogin" runat="server" Text="Login" CssClass="btn-admin" OnClick="btnLogin_Click" />
                <asp:Label ID="lblError" runat="server" CssClass="error-message"></asp:Label>
            </asp:Panel>

            <!-- Dashboard -->
            <asp:Panel ID="pnlDashboard" runat="server" CssClass="dashboard" Visible="false">
                <h2 style="color: #fff; text-align: center; margin-bottom: 2rem;">Portfolio Admin Dashboard</h2>
                
                <div style="text-align: center; margin-bottom: 2rem;">
                    <asp:Label ID="lblWelcome" runat="server" CssClass="success-message" style="font-size: 1.2rem;"></asp:Label>
                    <div style="margin: 1rem 0; display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap;">
                        <asp:Button ID="btnShowProjects" runat="server" Text="Manage Projects" CssClass="nav-btn" OnClick="btnShowProjects_Click" />
                        <asp:Button ID="btnShowEducation" runat="server" Text="Manage Education" CssClass="nav-btn" OnClick="btnShowEducation_Click" />
                        <a href="Default.aspx" class="nav-btn">
                            <i class="fas fa-home"></i> View Site
                        </a>
                        <asp:Button ID="btnLogout" runat="server" Text="Logout" CssClass="nav-btn logout-btn" OnClick="btnLogout_Click" />
                    </div>
                </div>

                <!-- Projects Section -->
                <asp:Panel ID="pnlProjects" runat="server" Visible="false">
                    <h3 style="color: #fff;">Manage Projects</h3>
                    <div class="project-form">
                        <h4 style="color: #00a8ff;">Add New Project</h4>
                        <div class="form-group">
                            <label style="color: #ccc;">Project Title *</label>
                            <asp:TextBox ID="txtProjectTitle" runat="server" CssClass="form-control" placeholder="Enter project title"></asp:TextBox>
                        </div>
                        <div class="form-group">
                            <label style="color: #ccc;">Description *</label>
                            <asp:TextBox ID="txtProjectDescription" runat="server" TextMode="MultiLine" Rows="3" CssClass="form-control" placeholder="Describe your project"></asp:TextBox>
                        </div>
                        <div class="form-group">
                            <label style="color: #ccc;">Project Image *</label>
                            <div style="margin-bottom: 10px;">
                                <asp:RadioButton ID="rbImageUrl" runat="server" GroupName="ImageType" Text="Image URL" Checked="true" style="color: #ccc; margin-right: 20px;" OnCheckedChanged="ImageType_Changed" AutoPostBack="true" />
                                <asp:RadioButton ID="rbImageFile" runat="server" GroupName="ImageType" Text="Upload Local File" style="color: #ccc;" OnCheckedChanged="ImageType_Changed" AutoPostBack="true" />
                            </div>
                            <asp:Panel ID="pnlImageUrl" runat="server" Visible="true">
                                <asp:TextBox ID="txtProjectImage" runat="server" CssClass="form-control" placeholder="https://example.com/image.jpg"></asp:TextBox>
                            </asp:Panel>
                            <asp:Panel ID="pnlImageFile" runat="server" Visible="false">
                                <asp:FileUpload ID="fuProjectImage" runat="server" CssClass="form-control" accept="image/*" />
                                <small style="color: #888; margin-top: 5px; display: block;">Supported formats: JPG, PNG, GIF, WebP (Max: 5MB)</small>
                            </asp:Panel>
                        </div>
                        <div class="form-group">
                            <label style="color: #ccc;">Live Demo URL</label>
                            <asp:TextBox ID="txtProjectLive" runat="server" CssClass="form-control" placeholder="https://your-demo.com"></asp:TextBox>
                        </div>
                        <div class="form-group">
                            <label style="color: #ccc;">GitHub URL</label>
                            <asp:TextBox ID="txtProjectGithub" runat="server" CssClass="form-control" placeholder="https://github.com/username/repo"></asp:TextBox>
                        </div>
                        <div class="form-group">
                            <label style="color: #ccc;">Technologies *</label>
                            <asp:TextBox ID="txtProjectTech" runat="server" CssClass="form-control" placeholder="React, Node.js, MongoDB"></asp:TextBox>
                        </div>
                        <div style="margin-bottom: 1rem; text-align: center;">
                            <asp:Button ID="btnAddProject" runat="server" Text="Add Project" CssClass="btn-admin" OnClick="btnAddProject_Click" />
                            <asp:Button ID="btnCancelProject" runat="server" Text="Cancel" CssClass="btn-secondary" OnClick="btnCancelProject_Click" style="margin-left: 10px; margin-top: 15px;" />
                        </div>
                        <asp:Label ID="lblProjectMessage" runat="server" CssClass="success-message"></asp:Label>
                    </div>
                    
                    <h4 style="color: #fff;">Existing Projects</h4>
                    <asp:GridView ID="gvProjects" runat="server" AutoGenerateColumns="False" CssClass="gridview-style" 
                        OnRowCommand="gvProjects_RowCommand" DataKeyNames="ProjectId">
                        <Columns>
                            <asp:BoundField DataField="Title" HeaderText="Title" />
                            <asp:BoundField DataField="Description" HeaderText="Description" />
                            <asp:BoundField DataField="Technologies" HeaderText="Technologies" />
                            <asp:TemplateField HeaderText="Actions">
                                <ItemTemplate>
                                    <asp:Button ID="btnUpdate" runat="server" Text="Update" CssClass="update-btn" 
                                        CommandName="UpdateProject" CommandArgument='<%# Eval("ProjectId") %>' />
                                    <asp:Button ID="btnDelete" runat="server" Text="Delete" CssClass="delete-btn" 
                                        CommandName="DeleteProject" CommandArgument='<%# Eval("ProjectId") %>' 
                                        OnClientClick="return confirm('Are you sure you want to delete this project?');" />
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                    </asp:GridView>
                </asp:Panel>

                <!-- Education Section -->
                <asp:Panel ID="pnlEducation" runat="server" Visible="false">
                    <h3 style="color: #fff;">Manage Education</h3>
                    <div class="project-form">
                        <h4 style="color: #00a8ff;">Add New Education</h4>
                        <div class="form-group">
                            <label style="color: #ccc;">Degree/Course *</label>
                            <asp:TextBox ID="txtDegree" runat="server" CssClass="form-control" placeholder="Bachelor of Science in Computer Science"></asp:TextBox>
                        </div>
                        <div class="form-group">
                            <label style="color: #ccc;">Institution *</label>
                            <asp:TextBox ID="txtInstitution" runat="server" CssClass="form-control" placeholder="University Name"></asp:TextBox>
                        </div>
                        <div class="form-group">
                            <label style="color: #ccc;">Duration *</label>
                            <asp:TextBox ID="txtPeriod" runat="server" CssClass="form-control" placeholder="2020 - 2024"></asp:TextBox>
                        </div>
                        <div class="form-group">
                            <label style="color: #ccc;">Description</label>
                            <asp:TextBox ID="txtEduDescription" runat="server" TextMode="MultiLine" Rows="3" CssClass="form-control" placeholder="Brief description of your studies"></asp:TextBox>
                        </div>
                        <div class="form-group">
                            <label style="color: #ccc;">Grade/CGPA</label>
                            <asp:TextBox ID="txtGrade" runat="server" CssClass="form-control" placeholder="3.8/4.0 or First Class"></asp:TextBox>
                        </div>
                        <div class="form-group">
                            <label style="color: #ccc;">Group/Field</label>
                            <asp:TextBox ID="txtGroup" runat="server" CssClass="form-control" placeholder="Science, Engineering, etc."></asp:TextBox>
                        </div>
                        <div style="margin-bottom: 1rem; text-align: center;">
                            <asp:Button ID="btnAddEducation" runat="server" Text="Add Education" CssClass="btn-admin" OnClick="btnAddEducation_Click" />
                            <asp:Button ID="btnCancelEducation" runat="server" Text="Cancel" CssClass="btn-secondary" OnClick="btnCancelEducation_Click" style="margin-left: 10px; margin-top: 15px;" />
                        </div>
                        <asp:Label ID="lblEducationMessage" runat="server" CssClass="success-message"></asp:Label>
                    </div>
                    
                    <h4 style="color: #fff;">Existing Education</h4>
                    <asp:GridView ID="gvEducation" runat="server" AutoGenerateColumns="False" CssClass="gridview-style" 
                        OnRowCommand="gvEducation_RowCommand" DataKeyNames="EducationId">
                        <Columns>
                            <asp:BoundField DataField="Degree" HeaderText="Degree" />
                            <asp:BoundField DataField="Institution" HeaderText="Institution" />
                            <asp:BoundField DataField="Period" HeaderText="Period" />
                            <asp:BoundField DataField="Grade" HeaderText="Grade" />
                            <asp:TemplateField HeaderText="Actions">
                                <ItemTemplate>
                                    <asp:Button ID="btnUpdate" runat="server" Text="Update" CssClass="update-btn" 
                                        CommandName="UpdateEducation" CommandArgument='<%# Eval("EducationId") %>' />
                                    <asp:Button ID="btnDelete" runat="server" Text="Delete" CssClass="delete-btn" 
                                        CommandName="DeleteEducation" CommandArgument='<%# Eval("EducationId") %>' 
                                        OnClientClick="return confirm('Are you sure you want to delete this education record?');" />
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                    </asp:GridView>
                </asp:Panel>
            </asp:Panel>
        </div>
    </form>
</body>
</html>
