import { useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {

    // Things that react needs to remember
    // todos, setTodos becomes value, initialValue through destructuring at the call site
    const [value, setValue] = useState(

        // Lazy Initializer: React only runs that function once, when creating the state.
        // Typically needed when computing the initial state SYNCHRONOUSLY
        () => { 
            // return JSON.parse(localStorage.getItem(key)) || [];

            // Parameterization
            // You're turning hard-coded values into parameters so the function becomes reusable.
            const savedValue = localStorage.getItem(key);

            if (savedValue !== null) {
                return JSON.parse(savedValue);
            }

            return initialValue;
        }
    ); 

    useEffect(() => {
        console.log("Saving:", value)
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];

}

export default useLocalStorage;