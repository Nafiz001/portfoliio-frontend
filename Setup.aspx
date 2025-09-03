<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Setup.aspx.cs" Inherits="_Setup" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Database Setup</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 50px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .success { color: #2ed573; font-weight: bold; }
        .error { color: #ff4757; font-weight: bold; }
        .btn { padding: 12px 24px; background: #3742fa; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .btn:hover { background: #2f3542; }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="container">
            <h2>Portfolio Database Setup</h2>
            <p>Click the button below to initialize the database with required tables and default data.</p>
            
            <asp:Button ID="btnSetup" runat="server" Text="Initialize Database" CssClass="btn" OnClick="btnSetup_Click" />
            <br /><br />
            
            <asp:Label ID="lblMessage" runat="server"></asp:Label>
            
            <div style="margin-top: 30px;">
                <h3>Default Login Credentials:</h3>
                <p><strong>Username:</strong> admin</p>
                <p><strong>Password:</strong> admin123</p>
                
                <h3>Next Steps:</h3>
                <ul>
                    <li><a href="Default.aspx">View Portfolio Site</a></li>
                    <li><a href="Admin.aspx">Access Admin Panel</a></li>
                </ul>
            </div>
        </div>
    </form>
</body>
</html>
