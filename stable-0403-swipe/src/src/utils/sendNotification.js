export function sendNotification(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico" // optional: path to your logo/icon
      });
    }
  }

  