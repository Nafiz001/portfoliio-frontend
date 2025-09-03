using System;
using System.Web;

public partial class Global : System.Web.HttpApplication
{
    protected void Application_Start(object sender, EventArgs e)
    {
        // Initialize database tables and default data
        try
        {
            DatabaseHelper.InitializeDatabase();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine("Application_Start error: " + ex.Message);
        }
    }
}
