export default function Controls() {
    return (
        <div className="flex items-center justify-center w-full">
            <div id="controls">
                <button id="play">Play</button>
                <button id="stop">Stop</button>
                <button id="reset">Reset</button>
                <button id="mute">Mute</button>
                <button id="volumeUp">Volume Up</button>
                <button id="volumeDown">Volume Down</button>
            </div>
        </div>
    );
}