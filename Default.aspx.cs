using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web;
using System.Web.UI;

public partial class _Default : System.Web.UI.Page
{
    private string connectionString = ConfigurationManager.ConnectionStrings["PortfolioDB"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        // Check for success message from redirect (only once per session)
        if (Request.QueryString["message"] == "sent" && Session["MessageShown"] == null)
        {
            ClientScript.RegisterStartupScript(this.GetType(), "alert", "alert('Message sent successfully!');", true);
            Session["MessageShown"] = "true";
        }
        
        if (!IsPostBack)
        {
            // Track visitor and handle cookies
            HandleVisitorTracking();
            LoadProjects();
            LoadEducation();
        }
    }

    private void HandleVisitorTracking()
    {
        try
        {
            // Simple visitor tracking with basic cookies
            HttpCookie visitorCookie = Request.Cookies["VisitorInfo"];
            
            if (visitorCookie == null)
            {
                // First time visitor - create visitor cookie
                HttpCookie newVisitorCookie = new HttpCookie("VisitorInfo");
                newVisitorCookie.Values["FirstVisit"] = DateTime.Now.ToString();
                newVisitorCookie.Values["VisitCount"] = "1";
                newVisitorCookie.Values["VisitorId"] = Guid.NewGuid().ToString();
                newVisitorCookie.Expires = DateTime.Now.AddDays(365); // 1 year
                Response.Cookies.Add(newVisitorCookie);
                
                // Set session for first-time visitor
                Session["IsFirstVisit"] = true;
                Session["VisitCount"] = 1;
            }
            else
            {
                // Returning visitor - update visit count
                int visitCount = 1;
                if (visitorCookie.Values["VisitCount"] != null)
                {
                    int.TryParse(visitorCookie.Values["VisitCount"], out visitCount);
                }
                visitCount++;
                
                HttpCookie updatedVisitorCookie = new HttpCookie("VisitorInfo");
                updatedVisitorCookie.Values["FirstVisit"] = visitorCookie.Values["FirstVisit"];
                updatedVisitorCookie.Values["VisitCount"] = visitCount.ToString();
                updatedVisitorCookie.Values["VisitorId"] = visitorCookie.Values["VisitorId"];
                updatedVisitorCookie.Values["LastVisit"] = DateTime.Now.ToString();
                updatedVisitorCookie.Expires = DateTime.Now.AddDays(365);
                Response.Cookies.Add(updatedVisitorCookie);
                
                Session["IsFirstVisit"] = false;
                Session["VisitCount"] = visitCount;
            }
        }
        catch (Exception ex)
        {
            // Log error but don't break the page
            System.Diagnostics.Debug.WriteLine("Error in visitor tracking: " + ex.Message);
        }
    }

    private void LoadProjects()
    {
        try
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "SELECT ProjectId, Title, Description, Technologies, ImageUrl, ImageData, GithubUrl, LiveUrl FROM Projects WHERE IsActive = 1 ORDER BY CreatedDate DESC";
                SqlCommand cmd = new SqlCommand(query, con);
                con.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);
                
                // Process image URLs to handle relative paths and database images
                foreach (DataRow row in dt.Rows)
                {
                    // Check if image is stored in database
                    if (row["ImageData"] != DBNull.Value)
                    {
                        // Image is in database, use ImageHandler.aspx to serve it
                        row["ImageUrl"] = "ImageHandler.aspx?id=" + row["ProjectId"].ToString();
                    }
                    else if (row["ImageUrl"] != DBNull.Value)
                    {
                        // Image is a URL, handle relative paths
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
                
                // Redirect to prevent form resubmission on refresh
                Response.Redirect("Default.aspx?message=sent");
            }
        }
        catch (Exception ex)
        {
            ClientScript.RegisterStartupScript(this.GetType(), "alert", "alert('Error sending message. Please try again.');", true);
            System.Diagnostics.Debug.WriteLine("Error sending message: " + ex.Message);
        }
    }
}
