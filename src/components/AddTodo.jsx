import { useState } from "react";

// AddTodo component is a form that allows users to add new todos to the list. It takes a prop called addNewTodo, 
// which is a function that adds a new todo to the list of todos.
function AddTodo({addNewTodo}) {

    // -----Use States-----
    // useState hook is used to create a piece of state called newTodo, which is a string that represents the title 
    // of the new todo to be added.
    const [newTodo, setNewTodo] = useState("");

    // -----Functions-----
    // handleSubmit is a function that is called when the form is submitted. It prevents the default form submission
    // event is the argument passed to the function, which is the event object that is created when the form is submitted.
    function handleSubmit(event) {
        event.preventDefault();

        // Call the addNewTodo function passed as a prop, passing the newTodo state as an argument
        addNewTodo(newTodo); 

        // Reset the newTodo state to an empty string after the todo is added
        setNewTodo(""); 
    }

    return (
        <div>
            <h2>Add a new todo</h2>

            {/* handleSubmit is called when the form is submitted.  */}
            <form onSubmit={handleSubmit}>

                {/* 
                onChange runs every time the user types in the input field.

                React passes an event object to the function. The current text inside
                the input is available as event.target.value.

                We store that value in the newTodo state using setNewTodo().
                
                Because the input's value comes from newTodo, updating the state causes
                the input to display the latest text. This is called a controlled input.
                */}
                <input type="text" value={newTodo} onChange={
                    (event) => {
                        setNewTodo(event.target.value);
                        }
                    } 
                />

                <button>Add Todo</button>
            </form>
        </div>
    );
}

export default AddTodo;

            
