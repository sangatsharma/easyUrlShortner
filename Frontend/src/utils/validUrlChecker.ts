// Helper function to validate URLs
export const isValidUrl = (url: string): boolean => {
  if (url.match(/\s/)) {
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
