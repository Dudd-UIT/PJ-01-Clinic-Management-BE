export function convertDayName(dayName) {
  if (!dayName || typeof dayName !== 'string') {
    return '';
  }

  const words = dayName.split(' ');

  if (words.length !== 2 || words[0] !== 'Thứ') {
    return dayName; // Return the original string if it doesn't match the expected pattern
  }

  return `${words[0]} ${words[1].charAt(0).toLowerCase() + words[1].slice(1)}`;
}