/* eslint-disable */
export const showToast = (message, type = "success") => {
  if (window.$toast) {
    window.$toast.showToast(message, type);
  } else {
    console.warn(
      "Toast notification not available. Ensure ToastNotification is mounted."
    );
  }
};
