// src/utils/onesignalInit.js
export function initOneSignal() {
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(function (OneSignal) {
    OneSignal.init({
      appId: "37e1dbd9-eb4d-4979-9541-56ca2a580b8f",
      notifyButton: {
        enable: true,
      },
      allowLocalhostAsSecureOrigin: window.location.hostname === "localhost",
      autoResubscribe: true,
    });

    // Optional: Debug
    OneSignal.on('subscriptionChange', function (isSubscribed) {
      console.log("Subscription state changed:", isSubscribed);
    });
  });

  const script = document.createElement("script");
  script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}
