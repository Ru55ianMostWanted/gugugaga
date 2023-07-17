<?php

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
$botToken = '6345564172:AAGFI3hSqJLalAf3rhvYaXSz3AOzZTf4l38';

// Get the incoming message from Telegram
$update = json_decode(file_get_contents('php://input'), true);

// Extract the user information from the incoming message
$user = $update['message']['from'];
$userId = $user['id'];
$firstName = $user['first_name'];
$lastName = $user['last_name'];
$username = $user['username'];

// Construct the URL with the user information as parameters
$url = "https://gabacasino2.000webhostapp.com?user_id=$userId&first_name=$firstName&last_name=$lastName&username=$username";

// Create the keyboard array
$keyboard = [
    [
        [
            'text' => 'Click Me',
            'web_app' => [
                'url' => $url
            ]
        ]
    ]
];

// Encode the keyboard array into JSON
$encodedKeyboard = json_encode(['keyboard' => $keyboard, 'one_time_keyboard' => true]);

// Create the message with the custom keyboard
$message = [
    'chat_id' => $update['message']['chat']['id'],
    'text' => 'Click the button:',
    'reply_markup' => $encodedKeyboard,
    'parse_mode' => 'HTML'
];

// Send the message with the custom keyboard
$telegramApiUrl = "https://api.telegram.org/bot$botToken/sendMessage";
$options = [
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query($message),
    ],
];

$context = stream_context_create($options);
$result = file_get_contents($telegramApiUrl, false, $context);

// Output the result
echo $result;
