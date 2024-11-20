const formatNumber = (num) => {
  // Ensure the input is a valid number by attempting to parse it first
  if (num === undefined || num === null) {
    console.error("Received undefined or null value in formatNumber.");
    return "0"; // Return a fallback value if the input is undefined or null
  }

  const parsedNum = parseFloat(num);
  if (isNaN(parsedNum)) {
    console.error("Invalid number provided to formatNumber:", num);
    return "0"; // Return a fallback value if the input is invalid
  }

  // Format the number based on its magnitude
  if (parsedNum >= 1e9) {
    return (parsedNum / 1e9).toFixed(2).replace(/\.00$/, "") + "B";
  }
  if (parsedNum >= 1e6) {
    return (parsedNum / 1e6).toFixed(2).replace(/\.00$/, "") + "M";
  }
  if (parsedNum >= 1e3) {
    return (parsedNum / 1e3).toFixed(2).replace(/\.00$/, "") + "K";
  }

  return parsedNum.toFixed(2).replace(/\.00$/, "");
};

export default formatNumber;