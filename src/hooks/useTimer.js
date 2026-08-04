import { useEffect, useState } from 'react';

function useTimer(initialTime) {

    // Encapsulation
    // This custom hook encapsulates the timer logic, making it reusable across different components. 
    // It manages the timer state and provides functions to control the timer.

    // -----Use States-----
    const [counter, setCounter] = useState(initialTime); // creates a piece of state called counter, starting at 0
    const [hasStarted, setHasStarted] = useState(false); // creates a piece of state called hasStarted, set to false

    // -----Boolean Flags-----
    // Information Hiding
    // The hook hides how completion is determined.
    // Components receive a simple `isComplete` flag instead of needing
    // to inspect or calculate from the internal counter state.
    const isComplete = counter === 0; // A boolean flag that indicates if the timer has completed (counter is 0)

    // -----Derived States-----
    const minutes = Math.floor(counter / 60); // Calculate minutes from counter
    const seconds = counter % 60; // Calculate remaining seconds from counter


    // ------Functions------
    // Start the timer by setting [hasStarted] to true
    function handleStart() {
        setHasStarted(true);
    }

    // Stop the timer by setting [hasStarted] to false
    function handleStop() {
        setHasStarted(false); 
    }

    // Reset the timer by setting [counter] to 2 and [hasStarted] to false
    function handleReset() {
        setCounter(initialTime); 
        setHasStarted(false); 
    }


    // ------Use Effects-----
    // Start a timer that updates the counter every second
    useEffect(() => {

        // Early Return: if the timer has not started, do not set up the interval
        if (!hasStarted) { return; }

        // setInterval runs a function repeatedly every 1000ms (1 second)
        const id = setInterval(() => {

            // setCounter updates the [counter] using the previous value
            setCounter(prev => {
                if (prev > 0) {
                    return prev - 1; // Decrease the counter by 1 if it's greater than 0
                }
                return prev; // Return 0
            })
            console.log('Timer running.'); // Log that the interval is running

        }, 1000);

        // This cleanup function runs when the component is removed
        // It stops the timer so it does not keep running in the background
        return(() => clearInterval(id));

    }, [hasStarted]); // The effect runs again whenever hasStarted changes

    // Checks if the counter hits 0 and sets [hasStarted] to false
    useEffect(() => {

        // If the counter reaches 0, stop the timer by setting hasStarted to false
        if (counter === 0) {
            setHasStarted(false); // Stop the timer if the counter reaches 0
            console.log('Timer stopped.'); // Log that the interval has stopped
        }

    }, [counter]); // The effect runs again whenever counter changes

    // Return everything that the component needs to use the timer functionality
    return {
        minutes, 
        seconds, 
        handleStart, 
        handleStop, 
        handleReset 
    }; 
}

export default useTimer;