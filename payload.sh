#!/bin/bash

# Replace these with your bot token and chat ID
BOT_TOKEN="8128117790:AAHhKWnFTuk4DIeFsl1xyBiUsYxovpzm-_w"
CHAT_ID="817280214"
MESSAGE="Payload Executed: Bash"

# Telegram API URL
TELEGRAM_API_URL="https://api.telegram.org/bot$BOT_TOKEN/sendMessage"

# Send the message
curl -s -X POST "$TELEGRAM_API_URL" \
  -d chat_id="$CHAT_ID" \
  -d text="$MESSAGE"
