interface ControlsProps {
    className: string;
    messageCallback: (id: string, value: number) => void;
}

export default function Controls(props: ControlsProps) {

    function handlePlayClicked() {
        console.log("Play button clicked");
        props.messageCallback("rnbo-toggleclock", 1);
    }

    function handleStopClicked() {
        console.log("Stop button clicked");
        props.messageCallback("rnbo-toggleclock", 0);
    }

    function handleResetClicked() {
        console.log("Reset button clicked");
        props.messageCallback("rnbo-toggleclock", 0);
    }

    function handleMuteClicked() {
        console.log("Mute button clicked");
        //props.messageCallback("Mute button clicked");
    }

    function handleVolumeChanged(e: React.ChangeEvent<HTMLInputElement>) {
        console.log("Volume changed");
        props.messageCallback("output-volume", parseFloat(e.target.value));
    }


    return (
        <div className={props.className}>
            <div id="controls">
                <button id="play" onClick={handlePlayClicked}>Play</button>
                <button id="stop" onClick={handleStopClicked} >Stop</button>
                <button id="reset" onClick={handleResetClicked} >Reset</button>
                <button id="mute"onClick={handleMuteClicked}>Mute</button>
                <input type="range" id="volume" min="0" max="1" step="0.01" onChange={handleVolumeChanged}/>
            </div>
        </div>
    );
}