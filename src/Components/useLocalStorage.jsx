import { useState, useEffect } from 'react';


function useLocalStorage(key, initialValue) {
  

  const [storedValue, setStoredValue] = useState(() => {
    try {
     
      const item =localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      
      console.log(error);
      return initialValue;
    }
  });


  useEffect(() => {
    try {
  
      const valueToStore = JSON.stringify(storedValue);
     
    localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]); 

 
  return [storedValue, setStoredValue];
}

export default useLocalStorage;
