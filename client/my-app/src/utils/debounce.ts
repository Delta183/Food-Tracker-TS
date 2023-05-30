// From https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086

let timeout: NodeJS.Timeout;

// The purpose of this class is to provide a sort of buffer time to the search query
// such that API calls aren't as frequent nor as redundant
const debounce = (func: (...args: any[]) => void, wait: number) => {
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default debounce;