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
        // loading,
        // error,
        searchTitle,
        setSearchTitle,
        filteredTodos,
        filter,
        setFilter,
        sortBy,
        setSortBy,
        addNewTodo,
        deleteTodo,
        toggleTodo,
        updateTodo  
    } = useTodos(); 

    // -----JSX-----
    // Conditional Rendering
    // If the data is still loading, show a loading message
    // if (loading) {
    //     return <h1>Loading... </h1>
    // }

    // // If there was an error fetching the data, show an error message
    // if (error) {
    //     return <h1>{error.message}</h1>
    // }

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

            {/* Adds a new todo */}
            <AddTodo addNewTodo={addNewTodo} />

            {/* Filtering buttons */}
            <button onClick={() => setFilter("all")}>All</button>
            <button onClick={() => setFilter("active")}>Active</button>
            <button onClick={() => setFilter("completed")}>Completed</button>

            {/* 
            Search for a todo. 
            Search input is a controlled component.
            Updating searchTitle causes React to re-render, which recalculates
            filteredTodos and updates the displayed todo list automatically.
            */}
            <br></br>
            <span> Search </span><input type="text" value={searchTitle} onChange={(event) => {
                setSearchTitle(event.target.value);
            }} />

            {/* 
            Sorting the todo list
            Sorting select is also a controlled input like search input 
            */}
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
            </select>

            {/* Display the todos list */}
            <ShowTodos todos={filteredTodos} deleteTodo={deleteTodo} toggleTodo={toggleTodo} updateTodo={updateTodo}/>
        </div>
    );
}

export default App;
