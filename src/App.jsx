import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import TimerDisplay from './components/TimerDisplay.jsx'
import './App.css'

// This is the main component of the app
function App() {

    // Use States
    const [counter, setCounter] = useState(2); // creates a piece of state called counter, starting at 0
    const [hasStarted, setHasStarted] = useState(false); // creates a piece of state called hasStarted, set to false

    // Derived States
    const minutes = Math.floor(counter / 60); // Calculate minutes from counter
    const seconds = counter % 60; // Calculate remaining seconds from counter


    // Use Effects
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


    // JSX: this displays the current counter value in the page
    return (
        <div>

            {/* Display the timer in minutes and seconds format */}
            {/* Using the TimerDisplay component with minutes and seconds props */}
            <TimerDisplay minutes={minutes} seconds={seconds} />
            <button onClick={() => setHasStarted(true)}>Start</button>
            <button onClick={() => setHasStarted(false)}>Stop</button>
            <button onClick={
                () => {
                    setCounter(2)
                    setHasStarted(false)
                }
            }>
            Reset
            </button>

        </div>
    );
}

export default App;
