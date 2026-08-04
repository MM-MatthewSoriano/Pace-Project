function ShowTodos({ todos }) {
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
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ShowTodos;