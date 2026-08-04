function CompletionMessage({isComplete}) {
    return (
        <div>
            <h2>{isComplete && "Session Completed!"}</h2>
        </div>
    );
}

export default CompletionMessage;

            
