import { useMemo, useEffect, useState } from 'react';

function useTodos() {    
    
    // -----Use States-----
    // Things that react needs to remember
    const [todos, setTodos] = useState(

        // Lazy Initializer: React only runs that function once, when creating the state.
        // Typically needed when computing the initial state SYNCHRONOUSLY
        () => { 
            return JSON.parse(localStorage.getItem("todos")) || [];
        }
    ); 
    const [filter, setFilter] = useState("all");
    const [searchTitle, setSearchTitle] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    // These states are only typically needed for loading data ASYNCHRONOUSLY
    const [loading, setLoading] = useState(true); // when the component first mounts, show a loading state, set loading to true
    const [error, setError] = useState(null); // check for errors when fetching data, set error to null

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
    function addNewTodo(newTodo) { 

        // setTodos is called to update the todos state with a new array that includes the previous todos and the new todo
        // inside setTodos, we use a callback function that takes the previous todos as an argument (prevTodos) and returns 
        // a new array that includes all the previous todos and the new todo object.
        setTodos(prevTodos => [ 

            // spread operator is used to copy the previous todos into the new array
            ...prevTodos,

            // New todo object with a unique id, title, and completed status
            {
                id: Date.now(),
                title: newTodo,
                completed: false
            }

        ]);
    }

    // Delete a todo from the list of todos
    // the id of the todo to be deleted is passed as an argument from the 
    // ShowTodos component when the delete button is clicked
    function deleteTodo(id) {

        // React gives you the latest array of todos.
        setTodos(prevTodos => {
            return prevTodos.filter(todo => todo.id !== id);
        }) 
    }

    // Toggle the completed status of a todo
    // the id of the todo to be toggled is passed as an argument from the 
    // ShowTodos component when the checkbox is clicked
    function toggleTodo(id) {

        // React gives you the latest array of todos.
        setTodos(prevTodos => { 

            // Create a new array by looking at each todo one by one.
            return prevTodos.map(todo => {

                // "Is this the todo the user clicked?"
                if (todo.id === id) {

                    // Create a new object that copies all the existing properties.
                    // Overwrite only the completed property.   
                    return {
                        ...todo,
                        completed: !todo.completed
                    }
                }

                // If this isn't the todo we're updating, leave it unchanged.
                return todo;
            })
        })
    }

    // Update todo
    function updateTodo(id, newTitle) {

        // React gives you the latest array of todos.
        setTodos(prevTodos => { 

            // Create a new array by looking at each todo one by one.
            return prevTodos.map(todo => {

                // "Is this the todo the user clicked?"
                if (todo.id === id) {

                    // Create a new object that copies all the existing properties.
                    // Overwrite only the completed property.   
                    return {
                        ...todo,
                        title: newTitle
                    }
                }

                // If this isn't the todo we're updating, leave it unchanged.
                return todo;
            })
        })
    }

    

    // -----Use Effects----- 
    // Saving todos to local storage
    // Save the latest todos to localStorage whenever the todos state changes.
    // JSON.stringify() converts the todos array into a string because
    // localStorage can only store strings.
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