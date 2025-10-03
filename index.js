require('dotenv').config();
const { WebClient } = require('@slack/web-api');

const token = process.env.SLACK_BOT_TOKEN;  // now read from .env
const channelName = 'all-demoapp';

const web = new WebClient(token);

async function runSlackOperations() {
  try {
    // Find channel ID by name
    const listRes = await web.conversations.list();
    const channel = listRes.channels.find(c => c.name === channelName);

    if (!channel) {
      console.error('Channel not found or bot not a member!');
      return;
    }

    const channelId = channel.id;

    // ---- SEND a message ----
    const sendRes = await web.chat.postMessage({
      channel: channelId,
      text: 'Hello from DemoApp Bot!'
    });
    console.log('Message sent:', sendRes.ts);

    const messageTs = sendRes.ts;

    // ---- SCHEDULE a message (5 min later) ----
    const postAt = Math.floor(Date.now() / 1000) + 300;
    const scheduleRes = await web.chat.scheduleMessage({
      channel: channelId,
      text: 'Scheduled message from DemoApp!',
      post_at: postAt
    });
    console.log('Message scheduled:', scheduleRes.scheduled_message_id);

    // ---- RETRIEVE message ----
    const historyRes = await web.conversations.history({
      channel: channelId,
      latest: messageTs,
      inclusive: true,
      limit: 1
    });
    console.log('Message retrieved:', historyRes.messages[0].text);

    // ---- EDIT message ----
    const updateRes = await web.chat.update({
      channel: channelId,
      ts: messageTs,
      text: 'Updated message from DemoApp Bot!'
    });
    console.log('Message updated:', updateRes.text);

    // ---- DELETE message ----
    const deleteRes = await web.chat.delete({
      channel: channelId,
      ts: messageTs
    });
    console.log('Message deleted');

  } catch (error) {
    console.error('Error:', error);
  }
}

runSlackOperations();
