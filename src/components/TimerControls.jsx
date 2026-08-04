function TimerControls({onStart, onStop, onReset}) {
    return (
        <div>
            <button onClick={onStart}>Start</button>
            <button onClick={onStop}>Stop</button>
            <button onClick={onReset}>Reset</button>
        </div>
    );
}

export default TimerControls;

            
