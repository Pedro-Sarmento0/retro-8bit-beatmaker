// Initialize the browser's native web audio API
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

//function that synthesizes sounds in real-time
function playRetroSound(soundType) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    //Select which sound to synthesize based on the HTML data attribute
    switch (soundType) {
        case 'kick': //deep kick drum
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.3);
            gain.gain.setValueAtTime(1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;

        case 'laser': //arcade spaceship laser shot
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);
            gain.gain.setValueAtTime(0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
            break;
            
        case 'coin': //Classic arcade coin sound
            osc.type = 'square';
            osc.frequency.setValueAtTime(987.77, now);
            osc.frequency.setValueAtTime(1318.51, now + 0.08);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
            break;

        case 'jump': //8-bit platformer jump
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
            break;

        case 'synth1': //simple synth note (C4)
            playNote(261.63, 'square', 0.3);
            break;
        case 'synth2': //simple synth note (E4)
            playNote(329.63, 'square', 0.3);
            break;
        case 'synth3': //simple synth note (G4)
            playNote(392.00, 'square', 0.3);
            break;
        
        case 'powerup': //level up / power up sound
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(330, now);
            osc.frequency.setValueAtTime(392, now + 0.1);
            osc.frequency.setValueAtTime(659, now + 0.2);
            osc.frequency.setValueAtTime(523, now + 0.3);
            osc.frequency.setValueAtTime(587, now + 0.4);
            osc.frequency.setValueAtTime(784, now + 0.5);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
            osc.start(now);
            osc.stop(now + 0.7);
            break;
    }
}

//helper function to play standard musical notes
function playNote(freq, type, duration) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + duration);

}

//function to trigger pad animations and sounds
function triggerPad(padElement) {
    const sound = padElement.getAttribute('data-sound');
    playRetroSound(sound);

    padElement.classList.add('playing');

    setTimeout(() => {
        padElement.classList.remove('playing');
    }, 150);
}

//1) listen for mouse clicks on the pads
const pads = document.querySelectorAll('.pad');
pads.forEach(pad => {
    pad.addEventListener('click', () => {
        triggerPad(pad);
    });
});

//2) listen for keyboard presses
window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const pad = document.querySelector(`.pad[data-key="${key}"]`);

    if (pad) {
        triggerPad(pad);
    }
});