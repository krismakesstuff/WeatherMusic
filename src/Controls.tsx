interface ControlsProps {
    className: string;
}

export default function Controls(props: ControlsProps) {
    return (
        <div className={props.className}>
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