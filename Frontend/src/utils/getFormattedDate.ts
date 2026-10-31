export const getFormattedDate = (dateString: string): string => {
  // Create a Date object from the date string
  const date = new Date(dateString);

  // Extract year, month, and day
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth()+1; // Months are zero-based
  const day = date.getUTCDate();
  return `${year}-${month}-${day}`;
};
