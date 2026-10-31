// Helper function to validate URLs
export const isValidUrl = (url: string): boolean => {
  if (url.match(/\s/)) {
    return false;
  }
  if (!url.includes(".")) {
    return false;
  }
  const parts = url.split(".");
  if (parts.length < 2 || parts.some((part) => part.length === 0)) {
    return false;
  }
  try {
    new URL(url); // This will throw if the URL is invalid
    console.log("URL is valid", url);
    return true;
  } catch (e) {
    return false;
  }
};
