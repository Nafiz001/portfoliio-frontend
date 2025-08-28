using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI;

public partial class _Default : System.Web.UI.Page
{
    private string connectionString = ConfigurationManager.ConnectionStrings["PortfolioDB"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadProjects();
            LoadEducation();
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
                
                // Process ImageUrl to handle relative paths
                foreach (DataRow row in dt.Rows)
                {
                    if (row["ImageUrl"] != DBNull.Value)
                    {
                        string imageUrl = row["ImageUrl"].ToString();
                        if (imageUrl.StartsWith("~/"))
                        {
                            row["ImageUrl"] = ResolveUrl(imageUrl);
                        }
                    }
                    else
                    {
                        row["ImageUrl"] = ""; // Set empty string for null values
                    }
                    
                    // Ensure no DBNull values for URLs
                    if (row["GithubUrl"] == DBNull.Value) row["GithubUrl"] = "";
                    if (row["LiveUrl"] == DBNull.Value) row["LiveUrl"] = "";
                }
                
                rptProjects.DataSource = dt;
                rptProjects.DataBind();
            }
        }
        catch (Exception ex)
        {
            // Log error or handle gracefully
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
                
                rptEducation.DataSource = dt;
                rptEducation.DataBind();
            }
        }
        catch (Exception ex)
        {
            // Log error or handle gracefully
            System.Diagnostics.Debug.WriteLine("Error loading education: " + ex.Message);
        }
    }

    protected string GetTechTags(string technologies)
    {
        if (string.IsNullOrEmpty(technologies))
            return "";
        
        string[] techArray = technologies.Split(',');
        string result = "";
        
        foreach (string tech in techArray)
        {
            if (!string.IsNullOrEmpty(tech.Trim()))
            {
                result += "<span class=\"tech-tag\">" + tech.Trim() + "</span>";
            }
        }
        
        return result;
    }

    protected void btnSendMessage_Click(object sender, EventArgs e)
    {
        try
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "INSERT INTO Messages (Name, Email, Subject, Message, ReceivedDate) VALUES (@Name, @Email, @Subject, @Message, @ReceivedDate)";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Name", txtName.Text.Trim());
                cmd.Parameters.AddWithValue("@Email", txtEmail.Text.Trim());
                cmd.Parameters.AddWithValue("@Subject", txtSubject.Text.Trim());
                cmd.Parameters.AddWithValue("@Message", txtMessage.Text.Trim());
                cmd.Parameters.AddWithValue("@ReceivedDate", DateTime.Now);
                
                con.Open();
                cmd.ExecuteNonQuery();
                
                // Clear form
                txtName.Text = "";
                txtEmail.Text = "";
                txtSubject.Text = "";
                txtMessage.Text = "";
                
                // Show success message
                ClientScript.RegisterStartupScript(this.GetType(), "alert", "alert('Message sent successfully!');", true);
            }
        }
        catch (Exception ex)
        {
            ClientScript.RegisterStartupScript(this.GetType(), "alert", "alert('Error sending message. Please try again.');", true);
            System.Diagnostics.Debug.WriteLine("Error sending message: " + ex.Message);
        }
    }
}
