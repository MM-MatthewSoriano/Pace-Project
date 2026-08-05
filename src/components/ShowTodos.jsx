import { useState } from "react";

function ShowTodos({ todos, deleteTodo, toggleTodo, updateTodo }) {

    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");

    return (
        <div>
            <ul>
                {/* Render each todo as a list item */}
                {todos.map(todo => (

                    // Unique key used by React to track list items
                    <li key={todo.id} >
                        
                        {/* Conditional rendering the form when the user clicks update on the todo item */}
                        {
                            // editingId state contains the todo.id value 
                            // if editingId is equal to todo.Id, it passes conditional rendering therefore rendering
                            // the form input section below, if no todo id is passed, then it will not render edit mode
                            // default value of todo.id is null per todo
                            editingId === todo.id ? 

                            // Edit Mode
                            // The map function will return this specific todo as true, thus showing edit mode
                            // If it does not match, it will show the normal mode
                            (
                                <div>
                                    <input 
                                        type="text" 

                                        // The value displayed inside the input always comes from the editingTitle state.
                                        // If editingTitle changes, React automatically updates what the user sees.
                                        value={editingTitle} 

                                        // onChange runs every time the user types in the input field.
                                        // event.target.value gets the latest text from the input.
                                        // setEditingTitle updates the editingTitle state with the user's latest input.
                                        onChange={(event) => {
                                            setEditingTitle(event.target.value);
                                        }}
                                    />
                                    <button 
                                        onClick={() => {
                                            // upon click, call the updateTodo function and pass todo.id and editingTitle state as 
                                            // arguments update the todo title that matches the todo.id and replace title with editngTitle 
                                            // value
                                            updateTodo(todo.id, editingTitle);
                                            setEditingId(null); // upon click, set editingId state back to null
                                        }}
                                    >
                                    Update
                                    </button>
                                </div>
                            ) 

                            : 

                            // Normal Mode
                            // This renders if the condition is false or eidting id is null
                            (
                                
                                <div>
                                    {/* Display the todo title */}
                                    {todo.title}
                                    <button 
                                        onClick={() => {
                                            setEditingId(todo.id); // upon click, editingId state will contain todo.id value
                                            setEditingTitle(todo.title); // upon click, editingTitle will contain todo.title value
                                        }}
                                    >
                                    Edit
                                    </button>
                                </div>
                            )
                        }

                        {/* 
                        deleteTodo is called directly because it is a function that takes an id as an argument.
                        The onClick event handler is set to call deleteTodo with the todo's id when the button is clicked. 

                        No arguments needed?
                        onClick={handleStart}

                        Need to pass arguments?
                        onClick={() => deleteTodo(todo.id)}
                        */}
                        <button 
                            onClick={() => deleteTodo(todo.id)}
                        > 
                        delete 
                        </button>

                        {/*  */}
                        <p>{todo.completed ? "Complete" : "Incomplete"}</p>
                        <input 
                            type="checkbox" 
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ShowTodos;