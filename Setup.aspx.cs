using System;
using System.Web.UI;

public partial class _Setup : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        
    }

    protected void btnSetup_Click(object sender, EventArgs e)
    {
        try
        {
            DatabaseHelper.InitializeDatabase();
            lblMessage.Text = "Database initialized successfully! You can now use the portfolio application.";
            lblMessage.CssClass = "success";
        }
        catch (Exception ex)
        {
            lblMessage.Text = "Error initializing database: " + ex.Message;
            lblMessage.CssClass = "error";
            System.Diagnostics.Debug.WriteLine("Setup error: " + ex.Message);
        }
    }
}
