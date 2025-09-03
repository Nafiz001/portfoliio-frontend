using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI;

public partial class ImageHandler : System.Web.UI.Page
{
    private string connectionString = ConfigurationManager.ConnectionStrings["PortfolioDB"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        // Clear response and set content type
        Response.Clear();
        
        string projectIdParam = Request.QueryString["id"];
        
        if (string.IsNullOrEmpty(projectIdParam))
        {
            Response.StatusCode = 404;
            Response.End();
            return;
        }

        int projectId;
        if (!int.TryParse(projectIdParam, out projectId))
        {
            Response.StatusCode = 400;
            Response.End();
            return;
        }

        try
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "SELECT ImageData, ContentType FROM Projects WHERE ProjectId = @ProjectId AND ImageData IS NOT NULL";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@ProjectId", projectId);
                    con.Open();
                    
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            byte[] imageData = (byte[])reader["ImageData"];
                            string contentType = reader["ContentType"].ToString();
                            
                            Response.ContentType = contentType;
                            Response.Cache.SetCacheability(System.Web.HttpCacheability.Public);
                            Response.Cache.SetExpires(DateTime.Now.AddHours(1));
                            Response.BinaryWrite(imageData);
                        }
                        else
                        {
                            Response.StatusCode = 404;
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Response.StatusCode = 500;
            System.Diagnostics.Debug.WriteLine("Error retrieving image: " + ex.Message);
        }
        
        Response.End();
    }
}
