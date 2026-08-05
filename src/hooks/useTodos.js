import { useEffect, useState } from 'react';

function useTodos() {    
    
    // -----Use States-----
    const [todos, setTodos] = useState([]); // API returns a list of todos, so an empty array is the right starting value. 
    const [loading, setLoading] = useState(true); // when the component first mounts, show a loading state, set loading to true
    const [error, setError] = useState(null); // check for errors when fetching data, set error to null
   
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
    // Fetch data from the API when the component mounts
    useEffect(() => {

        // function fetchTodos is an async function that fetches data from the API
        async function fetchTodos() {

            // try block is used to catch any errors that occur during the fetch operation
            try {
                
                // Send GET request, wait for server response.
                const response = await fetch('https://jsonplaceholder.typicode.com/todos'); 

                // Ensure HTTP failures, Network Failures end in same catch block
                if (!response.ok) {
                    throw new Error('Failed to fetch todos.');
                }

                const data = await response.json(); // Convert the response to JSON
                console.log(data); // Log the data to the console
                setTodos(data); // Update the todos state with the fetched data
            }

            // catch block is used to handle any errors that occur during the fetch operation
            catch (error) {
                setError(error); // Update the error state with the error that occurred
            }

            // finally block is used to execute code after the try and catch blocks, regardless of whether an error occurred or not
            finally {
                setLoading(false); // Set loading to false after data is fetched  
            }
  
        }
        fetchTodos(); // Call the async function to fetch todos

    }, []);

    // Return everything that the component needs to know about the todos state
    return {
        todos,
        loading,
        error,
        addNewTodo,
        deleteTodo,
        toggleTodo,
        updateTodo
    }; 
}

export default useTodos;