import { useMemo, useEffect, useState, useCallback, useReducer } from 'react';
// import useLocalStorage from "./useLocalStorage.js";

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
    // Moved to useLocalStorage.js
    // // Things that react needs to remember
    // const [todos, setTodos] = useLocalStorage("todos",[]);
    const [todos, dispatch] = useReducer(todosReducer, [], getInitialTodos);

    //     // Lazy Initializer: React only runs that function once, when creating the state.
    //     // Typically needed when computing the initial state SYNCHRONOUSLY
    //     () => { 
    //         return JSON.parse(localStorage.getItem("todos")) || [];
    //     }
    // ); 
    const [filter, setFilter] = useState("all");
    const [searchTitle, setSearchTitle] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    // These states are only typically needed for loading data ASYNCHRONOUSLY
    // const [loading, setLoading] = useState(true); // when the component first mounts, show a loading state, set loading to true
    // const [error, setError] = useState(null); // check for errors when fetching data, set error to null

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
    // Add a new todo to the list of todos
    // newTodo is the title of the new todo to be added
    // function addNewTodo(newTodo) { 

    //     // setTodos is called to update the todos state with a new array that includes the previous todos and the new todo
    //     // inside setTodos, we use a callback function that takes the previous todos as an argument (prevTodos) and returns 
    //     // a new array that includes all the previous todos and the new todo object.
    //     setTodos(prevTodos => [ 

    //         // spread operator is used to copy the previous todos into the new array
    //         ...prevTodos,

    //         // New todo object with a unique id, title, and completed status
    //         {
    //             id: Date.now(),
    //             title: newTodo,
    //             completed: false
    //         }

    //     ]);
    // }

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

    //     // Check if the action type is DELETE_TODO
    //     if (action.type === "DELETE_TODO") {

    //         // Create a new array by looking at each todo one by one.
    //         // Keep every todo whose id does not match the id passed through action.payload.
    //         return todos.filter(todo => todo.id !== action.payload);
    //     }

    //     // Check if the action type is ADD_TODO
    //     if (action.type === "ADD_TODO") {

    //         // Create a new array by copying all existing todos.
    //         // Add the new todo object passed through action.payload to the end of the array.
    //         return [
    //             ...todos,
    //             action.payload
    //         ];
    //     }

    //     // Check if the action type is TOGGLE_TODO
    //     if (action.type === "TOGGLE_TODO") {

    //         // Create a new array by looking at each todo one by one.
    //         return todos.map(todo => {

    //             // "Is this the todo the user clicked?"
    //             // action.payload contains the id of the todo that needs to be toggled.
    //             if (todo.id === action.payload) {

    //                 // Create a new object that copies all the existing properties.
    //                 // Overwrite only the completed property.
    //                 // The ! operator changes true to false and false to true.
    //                 return {
    //                     ...todo,
    //                     completed: !todo.completed
    //                 };
    //             }

    //             // If this isn't the todo we're updating, leave it unchanged.
    //             return todo;
    //         });
    //     }

    //     // Check if the action type is UPDATE_TODO
    //     if (action.type === "UPDATE_TODO") {

    //         // Create a new array by looking at each todo one by one.
    //         return todos.map(todo => {

    //             // "Is this the todo the user clicked?"
    //             // action.payload.id contains the id of the todo that needs to be updated.
    //             if (todo.id === action.payload.id) {

    //                 // Create a new object that copies all the existing properties.
    //                 // Overwrite only the title property with the new title.
    //                 return {
    //                     ...todo,
    //                     title: action.payload.newTitle
    //                 };
    //             }

    //             // If this isn't the todo we're updating, leave it unchanged.
    //             return todo;
    //         });
    //     }

    //     // Check if the action type is LOAD_TODOS
    //     if (action.type === "LOAD_TODOS") {

    //         // Replace the current todos with the todos loaded from localStorage.
    //         return action.payload;
    //     }

    //     // Return todos if none of the action types matched.
    //     return todos;
    // }

    // const addNewTodo = useCallback((newTodo) => {

    //     // setTodos is called to update the todos state with a new array that includes the previous todos and the new todo
    //     // inside setTodos, we use a callback function that takes the previous todos as an argument (prevTodos) and returns 
    //     // a new array that includes all the previous todos and the new todo object.
    //     setTodos(prevTodos => [ 

    //         // spread operator is used to copy the previous todos into the new array
    //         ...prevTodos,

    //         // New todo object with a unique id, title, and completed status
    //         {
    //             id: Date.now(),
    //             title: newTodo,
    //             completed: false
    //         }

    //     ]);
    // }, [setTodos]);

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

    // Delete a todo from the list of todos
    // the id of the todo to be deleted is passed as an argument from the 
    // ShowTodos component when the delete button is clicked
    // function deleteTodo(id) {

    //     // React gives you the latest array of todos.
    //     setTodos(prevTodos => {
    //         return prevTodos.filter(todo => todo.id !== id);
    //     }) 
    // }

    // useMemo     → remembers a calculated VALUE
    // useCallback → remembers a FUNCTION
    // React.memo  → memoizes a COMPONENT

    // const deleteTodo = useCallback((id) => {
    //     setTodos(prevTodos => {
    //         return prevTodos.filter(todo => todo.id !== id);
    //     }) 
    // },[setTodos])

    // Using the useReducer function
    const deleteTodo = (id) => {
        dispatch({
            type: "DELETE_TODO",
            payload: id
        })
    }

    // Toggle the completed status of a todo
    // the id of the todo to be toggled is passed as an argument from the 
    // ShowTodos component when the checkbox is clicked
    // function toggleTodo(id) {

    //     // React gives you the latest array of todos.
    //     setTodos(prevTodos => { 

    //         // Create a new array by looking at each todo one by one.
    //         return prevTodos.map(todo => {

    //             // "Is this the todo the user clicked?"
    //             if (todo.id === id) {

    //                 // Create a new object that copies all the existing properties.
    //                 // Overwrite only the completed property.   
    //                 return {
    //                     ...todo,
    //                     completed: !todo.completed
    //                 }
    //             }

    //             // If this isn't the todo we're updating, leave it unchanged.
    //             return todo;
    //         })
    //     })
    // }

    // const toggleTodo = useCallback((id) => {
    //     setTodos(prevTodos => { 

    //         // Create a new array by looking at each todo one by one.
    //         return prevTodos.map(todo => {

    //             // "Is this the todo the user clicked?"
    //             if (todo.id === id) {

    //                 // Create a new object that copies all the existing properties.
    //                 // Overwrite only the completed property.   
    //                 return {
    //                     ...todo,
    //                     completed: !todo.completed
    //                 }
    //             }

    //             // If this isn't the todo we're updating, leave it unchanged.
    //             return todo;
    //         })
    //     })
    // }, [setTodos])

    // useReducer
    function toggleTodo(id) {
        dispatch({
            type: "TOGGLE_TODO",
            payload: id
        })
    }

    // Update todo
    // function updateTodo(id, newTitle) {

    //     // React gives you the latest array of todos.
    //     setTodos(prevTodos => { 

    //         // Create a new array by looking at each todo one by one.
    //         return prevTodos.map(todo => {

    //             // "Is this the todo the user clicked?"
    //             if (todo.id === id) {

    //                 // Create a new object that copies all the existing properties.
    //                 // Overwrite only the completed property.   
    //                 return {
    //                     ...todo,
    //                     title: newTitle
    //                 }
    //             }

    //             // If this isn't the todo we're updating, leave it unchanged.
    //             return todo;
    //         })
    //     })
    // }

    // const updateTodo = useCallback((id, newTitle) => {

    //     // React gives you the latest array of todos.
    //     setTodos(prevTodos => { 

    //         // Create a new array by looking at each todo one by one.
    //         return prevTodos.map(todo => {

    //             // "Is this the todo the user clicked?"
    //             if (todo.id === id) {

    //                 // Create a new object that copies all the existing properties.
    //                 // Overwrite only the completed property.   
    //                 return {
    //                     ...todo,
    //                     title: newTitle
    //                 }
    //             }

    //             // If this isn't the todo we're updating, leave it unchanged.
    //             return todo;
    //         })
    //     })
    // }, [setTodos])

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

    // // Loading todos from local storage
    // useEffect(() => {
    //     const savedTodos = JSON.parse(
    //         localStorage.getItem("todos")
    //     ) || [];
    //     setTodos(savedTodos);
    //     setLoading(false)
    // }, []);

    // useEffect(() => {
    //     const savedTodos = localStorage.getItem("todos");

    //     if (savedTodos !== null) {

    //         const parsedTodos = JSON.parse(savedTodos);

    //         dispatch({
    //             type: "LOAD_TODOS",
    //             payload: parsedTodos
    //         })

    //     }
    // }, []);

    
    // Use effect for logging sort changes
    useEffect(() => {
    console.log("Sorted todos changed:", filteredTodos);
    }, [filteredTodos]);


    // // Fetch data from the API when the component mounts
    // useEffect(() => {

    //     // function fetchTodos is an async function that fetches data from the API
    //     async function fetchTodos() {

    //         // try block is used to catch any errors that occur during the fetch operation
    //         try {
                
    //             // Send GET request, wait for server response.
    //             const response = await fetch('https://jsonplaceholder.typicode.com/todos'); 

    //             // Ensure HTTP failures, Network Failures end in same catch block
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch todos.');
    //             }

    //             const data = await response.json(); // Convert the response to JSON
    //             console.log(data); // Log the data to the console
    //             setTodos(data); // Update the todos state with the fetched data
    //         }

    //         // catch block is used to handle any errors that occur during the fetch operation
    //         catch (error) {
    //             setError(error); // Update the error state with the error that occurred
    //         }

    //         // finally block is used to execute code after the try and catch blocks, regardless of whether an error occurred or not
    //         finally {
    //             setLoading(false); // Set loading to false after data is fetched  
    //         }
  
    //     }
    //     fetchTodos(); // Call the async function to fetch todos

    // }, []);

    // Return everything that the component needs to know about the todos state
    return {
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
    }; 
}

export default useTodos;