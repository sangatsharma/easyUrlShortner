// Helper function to validate URLs
export const isValidUrl = (url: string) :boolean=> {
    try {
      new URL(url); // This will throw if the URL is invalid
      return true;
    } catch (e) {
      return false;
    }
  };