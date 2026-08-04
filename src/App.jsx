import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import TimerDisplay from './components/TimerDisplay.jsx'
import TimerControls from './components/TimerControls.jsx'
import CompletionMessage from './components/CompletionMessage.jsx'
import useTimer from './hooks/useTimer.js'
import './App.css'

// This is the main component of the app
function App() {

    // -----Custom Hooks-----
    // Use the custom hook useTimer to get timer functionality
    const { 
        minutes, 
        seconds, 
        handleStart, 
        handleStop, 
        handleReset,
        isComplete 
    } = useTimer(2); 

    // -----JSX-----
    return (
        <div>
            {/* Display the timer in minutes and seconds format */}
            {/* Using the TimerDisplay component with minutes and seconds props */}
            <TimerDisplay minutes={minutes} seconds={seconds} />
            {/* Using the boolean flag isComplete from useTimer hook to return a message if session is over*/}
            <CompletionMessage isComplete={isComplete} />

            {/* Display the start, stop, and reset buttons to control the timer display */}
            {/* Using the TimerControls component with onStart, onStop, onReset as props */}
            <TimerControls onStart={handleStart} onStop={handleStop} onReset={handleReset} />
        </div>
    );
}

export default App;
