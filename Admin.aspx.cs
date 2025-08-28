using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

public partial class _Admin : System.Web.UI.Page
{
    private string connectionString = ConfigurationManager.ConnectionStrings["PortfolioDB"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            CheckSession();
        }
    }

    private void CheckSession()
    {
        if (Session["AdminLoggedIn"] != null && (bool)Session["AdminLoggedIn"])
        {
            ShowDashboard();
        }
        else
        {
            ShowLogin();
        }
    }

    private void ShowLogin()
    {
        pnlLogin.Visible = true;
        pnlDashboard.Visible = false;
    }

    private void ShowDashboard()
    {
        pnlLogin.Visible = false;
        pnlDashboard.Visible = true;
        lblWelcome.Text = "Welcome, Admin!";
    }

    protected void btnLogin_Click(object sender, EventArgs e)
    {
        try
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "SELECT COUNT(*) FROM AdminUsers WHERE Username = @Username AND Password = @Password";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Username", txtUsername.Text.Trim());
                cmd.Parameters.AddWithValue("@Password", txtPassword.Text.Trim()); // In production, use hashed passwords
                
                con.Open();
                int count = (int)cmd.ExecuteScalar();
                
                if (count > 0)
                {
                    Session["AdminLoggedIn"] = true;
                    Session["AdminUsername"] = txtUsername.Text.Trim();
                    ShowDashboard();
                    lblError.Text = "";
                }
                else
                {
                    lblError.Text = "Invalid username or password.";
                }
            }
        }
        catch (Exception ex)
        {
            lblError.Text = "Login error. Please try again.";
            System.Diagnostics.Debug.WriteLine("Login error: " + ex.Message);
        }
    }

    protected void btnLogout_Click(object sender, EventArgs e)
    {
        Session.Clear();
        ShowLogin();
    }

    protected void btnShowProjects_Click(object sender, EventArgs e)
    {
        pnlProjects.Visible = true;
        pnlEducation.Visible = false;
        LoadProjects();
    }

    protected void btnShowEducation_Click(object sender, EventArgs e)
    {
        pnlEducation.Visible = true;
        pnlProjects.Visible = false;
        LoadEducation();
    }

    protected void ImageType_Changed(object sender, EventArgs e)
    {
        if (rbImageUrl.Checked)
        {
            pnlImageUrl.Visible = true;
            pnlImageFile.Visible = false;
        }
        else
        {
            pnlImageUrl.Visible = false;
            pnlImageFile.Visible = true;
        }
    }

    protected void btnAddProject_Click(object sender, EventArgs e)
    {
        try
        {
            string imageUrl = "";
            
            // Handle image upload or URL
            if (rbImageFile.Checked && fuProjectImage.HasFile)
            {
                // Validate file
                string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                string fileExtension = Path.GetExtension(fuProjectImage.FileName).ToLower();
                
                if (!Array.Exists(allowedExtensions, ext => ext == fileExtension))
                {
                    lblProjectMessage.Text = "Please upload a valid image file (JPG, PNG, GIF, WebP).";
                    lblProjectMessage.ForeColor = System.Drawing.Color.Red;
                    return;
                }
                
                if (fuProjectImage.PostedFile.ContentLength > 5 * 1024 * 1024) // 5MB limit
                {
                    lblProjectMessage.Text = "File size must be less than 5MB.";
                    lblProjectMessage.ForeColor = System.Drawing.Color.Red;
                    return;
                }
                
                // Create uploads directory if it doesn't exist
                string uploadsPath = Server.MapPath("~/uploads/");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }
                
                // Generate unique filename
                string fileName = DateTime.Now.ToString("yyyyMMddHHmmss") + "_" + fuProjectImage.FileName;
                string filePath = Path.Combine(uploadsPath, fileName);
                
                // Save file
                fuProjectImage.SaveAs(filePath);
                imageUrl = "~/uploads/" + fileName;
            }
            else if (rbImageUrl.Checked && !string.IsNullOrEmpty(txtProjectImage.Text.Trim()))
            {
                imageUrl = txtProjectImage.Text.Trim();
            }
            else
            {
                lblProjectMessage.Text = "Please provide an image URL or upload a file.";
                lblProjectMessage.ForeColor = System.Drawing.Color.Red;
                return;
            }

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query;
                SqlCommand cmd;
                
                // Check if we're updating or adding
                if (ViewState["UpdateProjectId"] != null)
                {
                    // Update existing project
                    int projectId = (int)ViewState["UpdateProjectId"];
                    query = @"UPDATE Projects SET Title = @Title, Description = @Description, Technologies = @Technologies, 
                             ImageUrl = @ImageUrl, GithubUrl = @GithubUrl, LiveUrl = @LiveUrl 
                             WHERE ProjectId = @ProjectId";
                    cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@ProjectId", projectId);
                }
                else
                {
                    // Add new project
                    query = @"INSERT INTO Projects (Title, Description, Technologies, ImageUrl, GithubUrl, LiveUrl, CreatedDate, IsActive) 
                             VALUES (@Title, @Description, @Technologies, @ImageUrl, @GithubUrl, @LiveUrl, @CreatedDate, @IsActive)";
                    cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@CreatedDate", DateTime.Now);
                    cmd.Parameters.AddWithValue("@IsActive", true);
                }
                
                cmd.Parameters.AddWithValue("@Title", txtProjectTitle.Text.Trim());
                cmd.Parameters.AddWithValue("@Description", txtProjectDescription.Text.Trim());
                cmd.Parameters.AddWithValue("@Technologies", txtProjectTech.Text.Trim());
                cmd.Parameters.AddWithValue("@ImageUrl", imageUrl);
                cmd.Parameters.AddWithValue("@GithubUrl", string.IsNullOrEmpty(txtProjectGithub.Text.Trim()) ? (object)DBNull.Value : txtProjectGithub.Text.Trim());
                cmd.Parameters.AddWithValue("@LiveUrl", string.IsNullOrEmpty(txtProjectLive.Text.Trim()) ? (object)DBNull.Value : txtProjectLive.Text.Trim());
                
                con.Open();
                cmd.ExecuteNonQuery();
                
                // Show appropriate success message
                if (ViewState["UpdateProjectId"] != null)
                {
                    lblProjectMessage.Text = "Project updated successfully!";
                    ViewState["UpdateProjectId"] = null; // Clear the update state
                    btnAddProject.Text = "Add Project"; // Reset button text
                }
                else
                {
                    lblProjectMessage.Text = "Project added successfully!";
                }
                
                lblProjectMessage.ForeColor = System.Drawing.Color.Green;
                ClearProjectForm();
                LoadProjects();
            }
        }
        catch (Exception ex)
        {
            lblProjectMessage.Text = "Error saving project. Please try again.";
            lblProjectMessage.CssClass = "error-message";
            System.Diagnostics.Debug.WriteLine("Error saving project: " + ex.Message);
        }
    }

    protected void btnAddEducation_Click(object sender, EventArgs e)
    {
        try
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query;
                SqlCommand cmd;
                
                // Check if we're updating or adding
                if (ViewState["UpdateEducationId"] != null)
                {
                    // Update existing education
                    int educationId = (int)ViewState["UpdateEducationId"];
                    query = @"UPDATE Education SET Degree = @Degree, Institution = @Institution, Period = @Period, 
                             Description = @Description, Grade = @Grade, [Group] = @Group 
                             WHERE EducationId = @EducationId";
                    cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@EducationId", educationId);
                }
                else
                {
                    // Add new education
                    query = @"INSERT INTO Education (Degree, Institution, Period, Description, Grade, [Group], StartYear, IsActive) 
                             VALUES (@Degree, @Institution, @Period, @Description, @Grade, @Group, @StartYear, @IsActive)";
                    cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@StartYear", DateTime.Now.Year);
                    cmd.Parameters.AddWithValue("@IsActive", true);
                }
                
                cmd.Parameters.AddWithValue("@Degree", txtDegree.Text.Trim());
                cmd.Parameters.AddWithValue("@Institution", txtInstitution.Text.Trim());
                cmd.Parameters.AddWithValue("@Period", txtPeriod.Text.Trim());
                cmd.Parameters.AddWithValue("@Description", string.IsNullOrEmpty(txtEduDescription.Text.Trim()) ? (object)DBNull.Value : txtEduDescription.Text.Trim());
                cmd.Parameters.AddWithValue("@Grade", string.IsNullOrEmpty(txtGrade.Text.Trim()) ? (object)DBNull.Value : txtGrade.Text.Trim());
                cmd.Parameters.AddWithValue("@Group", string.IsNullOrEmpty(txtGroup.Text.Trim()) ? (object)DBNull.Value : txtGroup.Text.Trim());
                
                con.Open();
                cmd.ExecuteNonQuery();
                
                // Show appropriate success message
                if (ViewState["UpdateEducationId"] != null)
                {
                    lblEducationMessage.Text = "Education updated successfully!";
                    ViewState["UpdateEducationId"] = null; // Clear the update state
                    btnAddEducation.Text = "Add Education"; // Reset button text
                }
                else
                {
                    lblEducationMessage.Text = "Education added successfully!";
                }
                
                ClearEducationForm();
                LoadEducation();
            }
        }
        catch (Exception ex)
        {
            lblEducationMessage.Text = "Error saving education. Please try again.";
            lblEducationMessage.CssClass = "error-message";
            System.Diagnostics.Debug.WriteLine("Error saving education: " + ex.Message);
        }
    }

    private void LoadProjects()
    {
        try
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "SELECT ProjectId, Title, Description, Technologies, ImageUrl, GithubUrl, LiveUrl FROM Projects WHERE IsActive = 1 ORDER BY CreatedDate DESC";
                SqlCommand cmd = new SqlCommand(query, con);
                con.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);
                gvProjects.DataSource = dt;
                gvProjects.DataBind();
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine("Error loading projects: " + ex.Message);
        }
    }

    private void LoadEducation()
    {
        try
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "SELECT EducationId, Degree, Institution, Period, Description, Grade, [Group] FROM Education WHERE IsActive = 1 ORDER BY StartYear DESC";
                SqlCommand cmd = new SqlCommand(query, con);
                con.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);
                gvEducation.DataSource = dt;
                gvEducation.DataBind();
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine("Error loading education: " + ex.Message);
        }
    }

    protected void gvProjects_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        int projectId = Convert.ToInt32(e.CommandArgument);
        
        if (e.CommandName == "DeleteProject")
        {
            DeleteProject(projectId);
        }
        else if (e.CommandName == "UpdateProject")
        {
            LoadProjectForUpdate(projectId);
        }
    }

    protected void gvEducation_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        int educationId = Convert.ToInt32(e.CommandArgument);
        
        if (e.CommandName == "DeleteEducation")
        {
            DeleteEducation(educationId);
        }
        else if (e.CommandName == "UpdateEducation")
        {
            LoadEducationForUpdate(educationId);
        }
    }

    private void DeleteProject(int projectId)
    {
        try
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "UPDATE Projects SET IsActive = 0 WHERE ProjectId = @ProjectId";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@ProjectId", projectId);
                con.Open();
                cmd.ExecuteNonQuery();
                LoadProjects();
                lblProjectMessage.Text = "Project deleted successfully!";
            }
        }
        catch (Exception ex)
        {
            lblProjectMessage.Text = "Error deleting project.";
            lblProjectMessage.CssClass = "error-message";
            System.Diagnostics.Debug.WriteLine("Error deleting project: " + ex.Message);
        }
    }

    private void DeleteEducation(int educationId)
    {
        try
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "UPDATE Education SET IsActive = 0 WHERE EducationId = @EducationId";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@EducationId", educationId);
                con.Open();
                cmd.ExecuteNonQuery();
                LoadEducation();
                lblEducationMessage.Text = "Education deleted successfully!";
            }
        }
        catch (Exception ex)
        {
            lblEducationMessage.Text = "Error deleting education.";
            lblEducationMessage.CssClass = "error-message";
            System.Diagnostics.Debug.WriteLine("Error deleting education: " + ex.Message);
        }
    }

    private void LoadProjectForUpdate(int projectId)
    {
        try
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "SELECT Title, Description, ImagePath, LiveUrl, GithubUrl, Technologies FROM Projects WHERE ProjectId = @ProjectId";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@ProjectId", projectId);
                    con.Open();
                    
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            // Store the ProjectId in ViewState for update
                            ViewState["UpdateProjectId"] = projectId;
                            
                            // Fill the form with existing data
                            txtProjectTitle.Text = reader["Title"].ToString();
                            txtProjectDescription.Text = reader["Description"].ToString();
                            txtProjectImage.Text = reader["ImagePath"].ToString();
                            txtProjectLive.Text = reader["LiveUrl"].ToString();
                            txtProjectGithub.Text = reader["GithubUrl"].ToString();
                            txtProjectTech.Text = reader["Technologies"].ToString();
                            
                            // Change button text to indicate update mode
                            btnAddProject.Text = "Update Project";
                            lblProjectMessage.Text = "Editing project. Modify the details and click 'Update Project'.";
                            lblProjectMessage.CssClass = "success-message";
                            
                            // Set the image option to URL since we're loading existing data
                            rbImageUrl.Checked = true;
                            rbImageFile.Checked = false;
                            pnlImageUrl.Visible = true;
                            pnlImageFile.Visible = false;
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            lblProjectMessage.Text = "Error loading project for update.";
            lblProjectMessage.CssClass = "error-message";
            System.Diagnostics.Debug.WriteLine("Error loading project: " + ex.Message);
        }
    }

    private void LoadEducationForUpdate(int educationId)
    {
        try
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "SELECT Degree, Institution, Period, Description, Grade, [Group] FROM Education WHERE EducationId = @EducationId";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@EducationId", educationId);
                    con.Open();
                    
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            // Store the EducationId in ViewState for update
                            ViewState["UpdateEducationId"] = educationId;
                            
                            // Fill the form with existing data
                            txtDegree.Text = reader["Degree"].ToString();
                            txtInstitution.Text = reader["Institution"].ToString();
                            txtPeriod.Text = reader["Period"].ToString();
                            txtEduDescription.Text = reader["Description"] != DBNull.Value ? reader["Description"].ToString() : "";
                            txtGrade.Text = reader["Grade"] != DBNull.Value ? reader["Grade"].ToString() : "";
                            txtGroup.Text = reader["Group"] != DBNull.Value ? reader["Group"].ToString() : "";
                            
                            // Change button text to indicate update mode
                            btnAddEducation.Text = "Update Education";
                            lblEducationMessage.Text = "Editing education record. Modify the details and click 'Update Education'.";
                            lblEducationMessage.CssClass = "success-message";
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            lblEducationMessage.Text = "Error loading education for update.";
            lblEducationMessage.CssClass = "error-message";
            System.Diagnostics.Debug.WriteLine("Error loading education: " + ex.Message);
        }
    }

    private void ClearProjectForm()
    {
        txtProjectTitle.Text = "";
        txtProjectDescription.Text = "";
        txtProjectImage.Text = "";
        txtProjectLive.Text = "";
        txtProjectGithub.Text = "";
        txtProjectTech.Text = "";
        
        // Reset image upload controls
        rbImageUrl.Checked = true;
        rbImageFile.Checked = false;
        pnlImageUrl.Visible = true;
        pnlImageFile.Visible = false;
        
        // Reset update state
        ViewState["UpdateProjectId"] = null;
        btnAddProject.Text = "Add Project";
        lblProjectMessage.Text = "";
    }

    private void ClearEducationForm()
    {
        txtDegree.Text = "";
        txtInstitution.Text = "";
        txtPeriod.Text = "";
        txtEduDescription.Text = "";
        txtGrade.Text = "";
        txtGroup.Text = "";
        
        // Reset update state
        ViewState["UpdateEducationId"] = null;
        btnAddEducation.Text = "Add Education";
        lblEducationMessage.Text = "";
    }
    
    protected void btnCancelProject_Click(object sender, EventArgs e)
    {
        ClearProjectForm();
    }
    
    protected void btnCancelEducation_Click(object sender, EventArgs e)
    {
        ClearEducationForm();
    }
}
