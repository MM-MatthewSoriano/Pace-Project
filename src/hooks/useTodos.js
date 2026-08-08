import { useMemo, useEffect, useState, useCallback, useReducer } from 'react';

// -----Functions-----
function getInitialTodos() {
    const savedTodos = localStorage.getItem("todos");

    if (savedTodos !== null) {
        return JSON.parse(savedTodos);
    }

    return [];
}

function useTodos() {    
    
    // Encapsulation
    // This custom hook encapsulates the timer logic, making it reusable across different components. 
    // It manages the timer state and provides functions to control the timer.

    // -----Use States-----
    const [todos, dispatch] = useReducer(todosReducer, [], getInitialTodos);
    const [filter, setFilter] = useState("all");
    const [searchTitle, setSearchTitle] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    // -----Derived States-----
    // Derived states are things react can calculate
    // const completedTodos = todos.filter(todo => todo.completed); // todos that have been completed/true
    // const activeTodos = todos.filter(todo => !todo.completed); // todos that have not been completed/false

    // useMemo groups a calculation that produces a value.
    // React remembers (memoizes) the returned value.
    // The calculation only runs again when one of the dependencies changes.
    const filteredTodos = useMemo(() => {

        // filtered is a derived state that is filtered from todo
        const filtered = todos.filter(todo => {

        if (filter === "completed") {
            return todo.completed;
        }

        if (filter === "active") {
            return !todo.completed;
        }

        return true;

        // Method Chaining
        // Attaching another filter to the first filter
        // Now React immediately takes that array and applies another filter
        // That means the second .filter() operates on the result of the first one.
        }).filter(todo => todo.title
            .toLowerCase()
            .includes(searchTitle.toLowerCase()));

        // After filtering, we need to sort it
        // Sort mutates the array state if we were to directly use sort method on filtered state
        // That is why we use the spread operator on filtered for the array itself to be immutable
        // While still being able to copy the original array and filtered todos to be able to sort it
        // Resulting to filteredTodos receiving all the changes
        const sortedTodos = [...filtered];

        // switch decides which sorting algorithm to apply.
        // Each case sorts the same array differently based on sortBy.
        switch (sortBy) {
            case "newest":
                sortedTodos.sort((a,b) => b.id - a.id);
                break;

            case "oldest":
                sortedTodos.sort((a,b) => a.id - b.id);
                break;

            case "az":
                sortedTodos.sort((a,b) => a.title.localeCompare(b.title));
                break;

            case "za":
                sortedTodos.sort((a,b) => b.title.localeCompare(a.title));
                break;

            default:
                break;
        }

        // return the filtered todo
        return sortedTodos;
    }, [todos, filter, searchTitle, sortBy]);
   
    // -----Functions-----
    // useReducer
    function todosReducer(todos, action) {

        switch (action.type) {
            case "DELETE_TODO":
                // Create a new array by looking at each todo one by one.
                // Keep every todo whose id does not match the id passed through action.payload.
                return todos.filter(todo => todo.id !== action.payload);

            case "ADD_TODO":
                // Create a new array by copying all existing todos.
                // Add the new todo object passed through action.payload to the end of the array.
                return [
                    ...todos,
                    action.payload
                ];

            case "TOGGLE_TODO":
                // Create a new array by looking at each todo one by one.
                return todos.map(todo => {

                    // "Is this the todo the user clicked?"
                    // action.payload contains the id of the todo that needs to be toggled.
                    if (todo.id === action.payload) {

                        // Create a new object that copies all the existing properties.
                        // Overwrite only the completed property.
                        // The ! operator changes true to false and false to true.
                        return {
                            ...todo,
                            completed: !todo.completed
                        };
                    }

                    // If this isn't the todo we're updating, leave it unchanged.
                    return todo;
                });

            case "UPDATE_TODO":
                // Create a new array by looking at each todo one by one.
                return todos.map(todo => {

                    // "Is this the todo the user clicked?"
                    // action.payload.id contains the id of the todo that needs to be updated.
                    if (todo.id === action.payload.id) {

                        // Create a new object that copies all the existing properties.
                        // Overwrite only the title property with the new title.
                        return {
                            ...todo,
                            title: action.payload.newTitle
                        };
                    }

                    // If this isn't the todo we're updating, leave it unchanged.
                    return todo;
                });

            case "LOAD_TODOS":
                // Replace the current todos with the todos loaded from localStorage.
                return action.payload;

            default:
                return todos;

        }
    }

    // useReducer
    function addNewTodo(newTodo) {
        dispatch({
            type: "ADD_TODO",
            payload: {
                id: Date.now(),
                title: newTodo,
                completed: false
            }
        });
    }

    // Using the useReducer function
    function deleteTodo(id) {
        dispatch({
            type: "DELETE_TODO",
            payload: id
        })
    }

    // useReducer
    function toggleTodo(id) {
        dispatch({
            type: "TOGGLE_TODO",
            payload: id
        })
    }

    function updateTodo(id, newTitle) {
        dispatch({
            type: "UPDATE_TODO",
            payload: {

                // short hand property syntax
                id,
                newTitle

            }
        })
    }
    

    // -----Use Effects----- 
    // Saving todos to local storage
    // Save the latest todos to localStorage whenever the todos state changes.
    // JSON.stringify() converts the todos array into a string because
    // localStorage can only store strings.

    // Moved to useLocalStorage.js
    useEffect(() => {
        console.log("Saving:", todos)
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);
    
    // Use effect for logging sort changes
    useEffect(() => {
    console.log("Sorted todos changed:", filteredTodos);
    }, [filteredTodos]);

    return {
        todos,
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
    }; 
}

export default useTodos;