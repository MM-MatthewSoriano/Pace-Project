function ShowTodos({ todos, deleteTodo }) {
    return (
        <div>
            <ul>
                {/* Render each todo as a list item */}
                {todos.map(todo => (
                    <li
                        key={todo.id} // Unique key used by React to track list items
                    >
                        {/* Display the todo title */}
                        {todo.title}

                        {/* 
                        deleteTodo is called directly because it is a function that takes an id as an argument.
                        The onClick event handler is set to call deleteTodo with the todo's id when the button is clicked. 
                        */}
                        <button onClick={deleteTodo(todo.id)}> delete </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ShowTodos;