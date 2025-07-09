// ✅ Save a value to localStorage under a given key
export const saveToLocalStorage = (key, value) => {
  try {
    // Convert the value (object, array, anything) to JSON before saving
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

// ✅ Get a value from localStorage by key
export const getFromLocalStorage = (key) => {
  try {
    // Get the stored JSON string
    const storedValue = localStorage.getItem(key);

    // If found, parse it back to its original form
    return storedValue ? JSON.parse(storedValue) : null;
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return null;
  }
};
