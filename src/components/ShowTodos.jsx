function ShowTodos({todos}) {
    return (
        <div>
            <ul>
                {/* Map over the todos array and render each todo item as a list item */}
                {
                    todos.map(
                        todo => ( 
                            <li 
                                // Display the title of the todo item
                                // The key prop is used to help React identify which items have 
                                // changed, are added, or are removed.
                                key={todo.id}>{todo.title} 
                            </li>
                        )
                    )
                }
            </ul>
        </div>
    );
}

export default ShowTodos;

            
