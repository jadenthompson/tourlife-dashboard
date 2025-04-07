// src/utils/sendNotification.js
import axios from 'axios';

export const sendNotification = async ({ title, message, url }) => {
  try {
    const response = await axios.post('https://onesignal.com/api/v1/notifications', {
      app_id: import.meta.env.VITE_ONESIGNAL_APP_ID,
      included_segments: ['Subscribed Users'],
      headings: { en: title },
      contents: { en: message },
      url: url || 'https://tourlife.app',
    }, {
      headers: {
        Authorization: `Basic ${import.meta.env.VITE_ONESIGNAL_REST_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Push notification sent:', response.data);
  } catch (err) {
    console.error('❌ Notification error:', err.response?.data || err.message);
  }
};
