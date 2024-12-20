        const spriteSheet = new Image();
        spriteSheet.src = "spritesheet-walker.png";

        spriteSheet.onLoad = function() {
                init();
        }

        const frameWidth = 35;
        const frameHeight = 75;
        const frameCount = 10;
        let currentFrame = 0;

        function drawFrame(frameX, frameY, canvasX, canvasY) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(spriteSheet, frameX * frameWidth, frameY * frameHeight, frameWidth, frameHeight, canvasX, canvasY, frameWidth, frameHeight);
        }

        function animateFrames() {
        drawFrame(currentFrame, 0, 0, 0);
        currentFrame = (currentFrame + 1) % frameCount;
        requestAnimationFrame(animateFrames);
        }

        function init() {
        animateFrames();
        }
