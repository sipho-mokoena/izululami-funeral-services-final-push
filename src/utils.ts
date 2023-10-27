export function parseDate(dateString: string) {
    const dateParts = dateString.split("/");
    if (dateParts.length !== 3) {
      throw new Error("Invalid date format");
    }
  
    const day = parseInt(dateParts[1], 10);
    const month = parseInt(dateParts[0], 10) - 1;
    const year = parseInt(dateParts[2], 10);
  
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new Error("Invalid date components");
    }
  
    return new Date(year, month, day);
  }
  