const canvas = document.getElementById('myCanvas2');
const ctx = canvas.getContext('2d');
const width = canvas.width = 320;
const height = canvas.height = 480;
const frameWidth = 1710;
const frameHeight = 1080;
const xPos = 0;
const yPos = 160;
const scale = 1;
const fps = 60;
const secondsToUpdate = 1 * fps;
let count = 0;
let frameIndex = 0;


canvas.style.marginTop = window.innerHeight / 2 - height / 2 + 'px';

const spriteSheet = new Image();
spriteSheet.src = "spritesheet-walker.png";

function animate() {
        ctx.drawImage(
                spriteSheet,
                frameIndex * frameWidth,
                0,
                frameWidth,
                frameHeight,
                xPos,
                yPos,
                frameWidth * scale,
                frameHeight * scale);
        count++;
        if(count > 10) {
        frameIndex++;
                count = 0;
        }
        if(frameIndex > 10) {
        frameIndex = 0;
        }
}

function frame() { 
        ctx.clearRect(0, 0, width, height);
        animate();
        requestAnimationFrame(frame);
}

frame();
