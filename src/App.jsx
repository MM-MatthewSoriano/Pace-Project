import TimerDisplay from './components/TimerDisplay.jsx'
import TimerControls from './components/TimerControls.jsx'
import CompletionMessage from './components/CompletionMessage.jsx'
import ShowTodos from './components/ShowTodos.jsx'
import AddTodo from './components/AddTodo.jsx'
import useTimer from './hooks/useTimer.js'
import useTodos from './hooks/useTodos.js'
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
        isComplete,
    } = useTimer(2); 

    // Use the custom hook useTodos to get todos from the API
    const {
        todos,
        loading,
        error,
        addNewTodo,
        deleteTodo  
    } = useTodos(); 

    // -----JSX-----
    // Conditional Rendering
    // If the data is still loading, show a loading message
    if (loading) {
        return <h1>Loading... </h1>
    }

    // If there was an error fetching the data, show an error message
    if (error) {
        return <h1>{error.message}</h1>
    }

    // If the data has loaded and there is no error, show the main app content
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

            {/*  */}
            <AddTodo addNewTodo={addNewTodo} />

            {/* Display the todos list */}
            <ShowTodos todos={todos} deleteTodo={deleteTodo}/>
        </div>
    );
}

export default App;
