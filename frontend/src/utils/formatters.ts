// utils/formatters.ts

/**
 * Formats a 10-digit phone number string into a more readable (XXX) XXX-XXXX format.
 * If the input is not a 10-digit string, it returns the original input.
 * @param phoneNumber The phone number string.
 * @returns Formatted phone number or original string.
 */
export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber || phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
    return phoneNumber; // Return original if not a 10-digit number string
  }
  return `(${phoneNumber.substring(0, 3)}) ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6, 10)}`;
}

/**
 * Formats a date into a relative time string (e.g., "5 minutes ago").
 * @param date The date to format.
 * @returns A string representing the relative time.
 */
function safelyConvertDate(input: Date | string | number): Date | null {
    if (input instanceof Date) return input;

    // If it's a number, detect seconds vs milliseconds
    if (typeof input === "number") {
        if (input.toString().length === 10) {
            // Unix timestamp in seconds → convert to ms
            return new Date(input * 1000);
        }
        return new Date(input); // assume milliseconds
    }

    if (typeof input === "string") {
        // If numeric string
        if (/^\d+$/.test(input)) {
            const num = Number(input);
            if (input.length === 10) return new Date(num * 1000);
            return new Date(num);
        }
        return new Date(input);
    }

    return null;
}


/**
 * Formats a date value to display the distance from now (e.g., "5 minutes ago").
 * Handles Date objects, Unix timestamps (seconds or milliseconds), and date strings.
 * * @param dateInput The date to format (Date, string, or number/timestamp).
 * @returns The formatted distance string, or an error message if the date is invalid.
 */
export function formatDistanceToNow(dateInput: Date | string | number): string {

    const date = safelyConvertDate(dateInput);

    if (!date) {
        return "Invalid date"; // Handle unconvertible input
    }

    const now = new Date().getTime();
    const targetTime = date.getTime();

    // Check if the date is in the future
    if (targetTime > now) {
        // You might adjust this logic for future dates (e.g., "in 5 minutes")
        return "in the future";
    }

    const seconds = Math.floor((now - targetTime) / 1000);

    if (seconds < 5) return "just now";

    let interval: number;

    // Years
    interval = seconds / 31536000;
    if (interval >= 1) { // Changed to >= 1 for clearer boundary
        const years = Math.floor(interval);
        return years + (years === 1 ? " year ago" : " years ago");
    }

    // Months
    interval = seconds / 2592000;
    if (interval >= 1) {
        const months = Math.floor(interval);
        return months + (months === 1 ? " month ago" : " months ago");
    }

    // Days
    interval = seconds / 86400;
    if (interval >= 1) {
        const days = Math.floor(interval);
        return days + (days === 1 ? " day ago" : " days ago");
    }

    // Hours
    interval = seconds / 3600;
    if (interval >= 1) {
        const hours = Math.floor(interval);
        return hours + (hours === 1 ? " hour ago" : " hours ago");
    }

    // Minutes
    interval = seconds / 60;
    if (interval >= 1) {
        const minutes = Math.floor(interval);
        return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
    }

    // Seconds
    return Math.floor(seconds) + " seconds ago";
}
