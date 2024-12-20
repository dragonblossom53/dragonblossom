const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = 320;
const height = canvas.height = 480;
const frameWidth = 2000;
const frameHeight = 1080;
const xPos = 0;
const yPos = 160;
const scale = 1;
const fps = 60;
const secondsToUpdate = 1 * fps;
const count = 0;


canvas.style.marginTop = window.innerHeight / 2 - height / 2 + 'px';

const spriteSheet = new Image();
spriteSheet.src = "spritesheet-walker.png";

function animate() {
        ctx.drawImage(
                spriteSheet,
                0,
                0,
                frameWidth,
                frameHeight,
                xPos,
                yPos,
                frameWidth * scale,
                frameHeight * scale);
}

function frame() { 
        ctx.clearRect(0, 0, width, height);
        animate();
        requestAnimationFrame(frame);
}

frame();
