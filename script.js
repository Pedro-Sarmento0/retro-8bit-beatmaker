// Initialize the browser's native web audio API
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

//fuction that synthesizes sounds in real-time
function playRetroSound(soundType) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    //Select which sound to sunthesize based on the HTML data attribute
    switch (soundType) {
        case 'kikc': //deep kick drum
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.3);
    }
}