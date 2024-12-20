        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        const walkers = [];
        const walkersTop = [];
        const walkersBottom = [];
        const walkersRight = [];
        const walkersLeft = [];
        let rightPressed = false;
        let leftPressed = false;
        let downPressed = false;
        let upPressed = false;
        let wWasPressed = false;
        let aWasPressed = false;
        let sWasPressed = false;
        let dWasPressed = false;
        let targetHit = false;
        let playerHit = false;
        let canSpawnTop = true;
        let canSpawnLeft = true;
        let canSpawnBottom = true;
        let canSpawnRight = true;
        let canFire = true;
        let mapX = 0;
        let mapY = canvas.height - 80;
        let mapWidth = 1000;
        let mapHeight = 1000;
        let blockColumnCount = 5;
        let blockRowCount = 5;
        let blockWidth = 100;
        let blockHeight = 100;
        let blockPadding = 100;
        let blockOffsetTop = 300;
        let blockOffsetLeft = 100;
        let blocks = []
        let blocks2 = []

        //trying to figure out sprite animation
        const spriteSheet = new Image();
        spriteSheet.src = "spritesheet-walker.png";

        function drawFrame(x, y, width, height) {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.drawImage(spriteSheet, x, y, width, height);
        }

        /*spriteSheet.onLoad = function() {
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
        }*/
        //end of sprite animation
                
        class Vector {

            constructor(x, y) {
                this.x = x;
                this.y = y;
            }

            add(v) {
                this.x += v.x;
                this.y += v.y;
                return this;
            }

            sub(v) {
                this.x -= v.x;
                this.y -= v.y;
                return this;
            }

            mult(n) {
                this.x = this.x * n;
                this.y = this.y * n;
                return this;

            }

            div(n) {
                this.x = this.x / n;
                this.y = this.y / n;
                return this;
            }

            mag() {
                return Math.sqrt(this.x*this.x + this.y*this.y);
            }

            normalize() {
                const m = this.mag();
                if(m > 0) {
                    this.x = this.x / m; 
                    this.y = this.y / m;
                }
                return this;
            }

            dot(v) {
                return this.x * v.x + this.y * v.y;
            }

            toString() {
                return `(${this.x}, ${this.y})`;
            }

            limit(limit) {
                var m = this.mag();
                if(m > limit) {
                    const scale = limit / m;
                    this.x *= scale;
                    this.y *= scale;
                }
                return this;
            }
        }

        function PlayerObject() { //make 2 player, 2 viewports, or no viewport
        let player = Object.create(playerMethods);
        player.x = canvas.width /2 - 25;
        player.y = canvas.height + 500;
        player.width = 35;
        player.height = 35;
        player.color = "yellow";
        player.speedX = 7;
        player.speedY = 5;
        player.position = new Vector(canvas.width /2 - 25, canvas.height + 500);
        player.velocity = new Vector(0, 0);
        player.acceleration = new Vector(0, 0);
        player.lives = 4;
        player.status = 1;
        return player;
        }

        let playerMethods = {
            draw: function() {
            if(this.status == 1) {
            ctx.beginPath();
            ctx.rect(this.position.x, this.position.y, this.width, this.height);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            }
            },
            updatePosition: function() {
            this.velocity.add(this.acceleration);
            this.velocity.limit(8);
            this.position.add(this.velocity);
            },
            damage: function() {
            this.lives -= 1;
                if(this.lives == 3) {
                this.color = "#FE3434";
                } else if(this.lives == 2) {
                this.color = "#DC0C0C";
                } else if(this.lives == 0) {
                this.status = 0;
                }
            },
            right: function() {
                this.position.x += this.speedX;
                //this.acceleration.x = 1;
            },
            left: function() {
                this.position.x -= this.speedX;
                //this.acceleration.x = -1;

            },
            up: function() {
                this.position.y -= this.speedY;
                //this.acceleration.y = -1;
            },
            down: function() {
                this.position.y += this.speedY;
                //this.acceleration.y = 1;
            },
            stop: function() {
                this.velocity.mult(0);
                this.acceleration.mult(0);
            },
        }
        let player1 = PlayerObject();

        function allowFire() {
            canFire = true;
        }

        function BulletObject(x, y) {
        let bullet = Object.create(bulletMethods);
        bullet.x = x;
        bullet.y = y;
        bullet.pos = new Vector(x, y);
        bullet.speedX = 7;
        bullet.speedY = 7;
        bullet.speed = new Vector(7, 7);
        bullet.status = 1;
        canFire = false;
        setTimeout(allowFire, 50);
        return bullet;
        }

        let bulletMethods = {
            draw: function() {
            ctx.beginPath();
            ctx.rect(this.x, this.y, 8, 8);
            ctx.fillStyle = "grey";
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            },
            down: function() {
            this.y += this.speed.y;
            },
            up: function() {
            this.y -= this.speed.y;
            },
            left: function() {
            this.x -= this.speed.x;
            },
            right: function() {
            this.x += this.speed.x;
            },
            collisionDetect: function(obj) {
                if(this.x > obj.position.x &&
                this.x < obj.position.x + obj.width &&
                this.y > obj.position.y &&
                this.y < obj.position.y + obj.height) {
                    obj.takeDamage();  
                    this.status = 0;
                }
            },
        }

        const bulletsW = [];
        const bulletsA = [];
        const bulletsS = [];
        const bulletsD = [];
        const bulletsWASD = [];

        document.addEventListener('keydown', keyDownHandler, false);
        document.addEventListener('keyup', keyUpHandler, false);
        document.addEventListener('keypress', keyPressHandler, false);

        function keyPressHandler(e) {//push them all into their own arrays
        if(canFire) {
            if(e.key == "w" || e.code == "KeyW") {
                bulletsW.push(new BulletObject(player1.position.x + player1.width/2 - 5, player1.position.y + player1.height/2));
                wWasPressed = true;
                aWasPressed = false;
                sWasPressed = false;
                dWasPressed = false;
            } else if(e.key == "a" || e.code == "KeyA") {
                bulletsA.push(new BulletObject(player1.position.x + player1.width/2 - 5, player1.position.y + player1.height/2));
                aWasPressed = true;
                wWasPressed = false;
                sWasPressed = false;
                dWasPressed = false;
            } else if(e.key == "s" || e.code == "KeyS") {
                bulletsS.push(new BulletObject(player1.position.x + player1.width/2 - 5, player1.position.y + player1.height/2));
                sWasPressed = true;
                aWasPressed = false;
                wWasPressed = false;
                dWasPressed = false;
            } else if(e.key == "d" || e.code == "KeyD") {
                bulletsD.push(new BulletObject(player1.position.x + player1.width/2 - 5, player1.position.y + player1.height/2));
                dWasPressed = true;
                aWasPressed = false;
                sWasPressed = false;
                wWasPressed = false;
            }
        }
        }

        function keyDownHandler(e) {
            if(e.key == "Right" || e.key == "ArrowRight") {
                rightPressed = true;
            } else if(e.key == "Left" || e.key == "ArrowLeft") {
                leftPressed = true;
            } else if(e.key == "Down" || e.key == "ArrowDown") {
                downPressed = true;
            } else if(e.key == "Up" || e.key == "ArrowUp") {
                upPressed = true;
            }/* else if(e.key == "Space" || e.code == "Space") {

            }*/
        }

        function keyUpHandler(e) {
            if(e.key == "Right" || e.key == "ArrowRight") {
                rightPressed = false;
            } else if(e.key == "Left" || e.key == "ArrowLeft") {
                leftPressed = false;
            } else if(e.key == "Down" || e.key == "ArrowDown") {
                downPressed = false;
            } else if(e.key == "Up" || e.key == "ArrowUp") {
                upPressed = false;
            } else if(e.key == "s" || e.code == "KeyS") {
                sPressed = false;
            }
        }

        for(var c = 0; c < blockColumnCount; c++) {
            blocks[c] = [];
            blocks2[c] = [];
            for(var r = 0; r < blockRowCount; r++) {
                blocks[c][r] = {x: 0, y: 0};
                blocks2[c][r] = {x: 0, y: 0};
            }
        }

        function drawBlocks() {
            for(var c = 0; c < blockColumnCount; c++) {    
                for(var r = 0; r < blockRowCount; r++) {
                    const blockX = c * (blockWidth + blockPadding);
                    const blockY = r * (blockHeight + blockPadding) + blockOffsetTop;
                    const block2X = c * (blockWidth + blockPadding) + blockOffsetLeft;
                    const block2Y = r * (blockHeight + blockPadding) + blockOffsetTop + 100;
                    blocks[c][r].x = blockX;
                    blocks[c][r].y = blockY;
                    blocks2[c][r].x = block2X;
                    blocks2[c][r].y = block2Y;
                    ctx.rect(blockX, blockY, blockWidth, blockHeight);
                    ctx.rect(block2X, block2Y, blockWidth, blockHeight);
                    ctx.fillStyle = "#006D2C";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
        
        function drawGround() {
        ctx.beginPath();
        ctx.fillStyle = "#038638";
        ctx.fillRect(mapX, mapY, mapWidth, mapHeight);
        drawBlocks();
        ctx.closePath();
        }

        function WalkerObject(x, y, speedX, speedY, color) {
        let walker = Object.create(constructorObject);
        walker.x = x;
        walker.y = y;
        walker.position = new Vector(x, y);
        walker.width = 35;
        walker.height = 75;
        walker.speedX = speedX || 1;
        walker.speedY = speedY || 1;
        walker.velocity = new Vector(0, 0);
        walker.acceleration = new Vector(0, 0);
        walker.color = color || '#116C94';
        walker.hasHitLeftEdge = false;
        walker.hasHitRightEdge = false;
        walker.lives = 20;
        walker.status = 1;
        walkers.push(walker);
        return walker;
        }

        let constructorObject = {
                draw: function () {
                if(this.status == 1) {
                ctx.beginPath();
                ctx.rect(this.position.x, this.position.y, this.width, this.height);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                }
            },
            updatePosition: function() {
            this.velocity.add(this.acceleration);
            this.velocity.limit(2);
            this.position.add(this.velocity);
            },
            walkLeft: function () {
                //this.x -= this.speedX;
                this.acceleration.x = -1;
            },
            walkRight: function () {
                //this.x += this.speedX;
                this.acceleration.x = 1;
            },
            walkDown: function() {
                //this.y += this.speedY;
                this.acceleration.y = 1;
            },
            walkUp: function () {
                //this.y -= this.speedY;
                this.acceleration.y = -1;
            },
            followPlayer: function(player) {
                if(player.status == 1) {
                    if(this.position.x > player.position.x + player.width) {
                        this.walkLeft();
                    } else if(this.position.x < player.position.x - player.width) {
                        this.walkRight();
                    }
                    if(this.position.y < player.position.y) {
                        this.walkDown();
                    } else if(this.position.y > player.position.y) {
                        this.walkUp();
                    }
                } else {
                this.stopChasing();
                }
            },
            /*personalSpace: function(walker) {
                if(this.x > walker.x - walker.width*1.5 &&
                    this.y > walker.y &&
                    this.y < walker.y + walker.height) {
                    this.walkLeft();
                } else if(this.x < walker.x + walker.width*1.5 &&
                    this.y > walker.y &&
                    this.y < walker.y + walker.height) {
                    this.walkRight();
                } else if(this.y > walker.y - 10 &&
                    this.x > walker.x &&
                    this.x < walker.x + walker.width) {
                    this.walkUp();
                }
            },*/
            boundaryBounce: function(left, right) {//needs updated
                if(this.x + this.width > right) {
                    this.hasHitRightEdge = true;
                    this.hasHitLeftEdge = false;
                } else if(this.x < left) {
                    this.hasHitLeftEdge = true;
                    this.hasHitRightEdge = false;
                }
                if(this.hasHitRightEdge) {
                this.x -= this.speedX;
                } else if(this.hasHitLeftEdge) {
                this.x += this.speedX;
                }
                
            },
            stopChasing: function() {
                this.velocity.mult(0);
                this.acceleration.mult(0);
            },
            takeDamage: function() {
            this.lives -= 1;
                if(this.lives == 15) {
                this.color = "#FE3434";
                } else if(this.lives == 5) {
                this.color = "#DC0C0C";
                } else if(this.lives == 0) {
                this.status = 0;
                }
            },
            attack: function(player) {
                if(this.position.x + this.width > player.position.x &&
                this.position.x < player.position.x + player.width &&
                this.position.y + this.height > player.position.y &&
                this.position.y < player.position.y + player.height &&
                player.status == 1) {// if this is within player hitbox
                    if(this.position.x > player.position.x - player.width &&
                    this.position.x + this.width < player.position.x + player.width &&
                    playerHit == false) {//walker is on left
                        playerHit = true;
                        player.damage();
                        player.acceleration.add(this.velocity);
                        setTimeout(playerHitTimer, 0200);
                    } else if(player.position.x > this.position.x - this.width &&
                    player.position.x + player.width < this.position.x + this.width &&
                    playerHit == false) {//walker is on right
                        playerHit = true;
                        player.damage();
                        player.acceleration.add(this.velocity);
                        setTimeout(playerHitTimer, 0200);
                    }
                }
                if(playerHit == false) {
                        player1.stop();
                }
            },
        }

        function spawnLimitTop() { // used in set timeouts for walker spawns
        canSpawnTop = true;
        }
        function spawnLimitLeft() {
        canSpawnLeft = true;
        }
        function spawnLimitRight() {
        canSpawnRight = true;
        }
        function spawnLimitBottom() {
        canSpawnBottom = true;
        }
        function playerHitTimer() {//used in setTimeout to allow player to be hit again
            playerHit = false;
        }

        function spawnWalkersTop(num, interval) {
        let rx = Math.floor(Math.random() * 11);
            if(walkersTop.length < num && canSpawnTop == true) {
                walker = WalkerObject(100 * rx, 300, 2, 2); // spawns at random x or y
                walkersTop.push(walker);
                canSpawnTop = false;
                setTimeout(spawnLimitTop, interval);
            }
        }

        function spawnWalkersRight(num, interval) {
        let ry = Math.floor(Math.random() * 11);
            if(walkersRight.length < num && canSpawnRight == true) {
                walker = WalkerObject(1000, 300 + 100 * ry, 2, 2); // spawns at random x or y
                walkersRight.push(walker);
                canSpawnRight = false;
                setTimeout(spawnLimitRight, interval);
            }
        }

        function spawnWalkersLeft(num, interval) {
        let ry = Math.floor(Math.random() * 11);
            if(walkersLeft.length < num && canSpawnLeft == true) {
                walker = WalkerObject(0, 300 + 100 * ry, 2, 2); // spawns at random x or y
                walkersLeft.push(walker);
                canSpawnLeft = false;
                setTimeout(spawnLimitLeft, interval);
            }
        }

        function spawnWalkersBottom(num, interval) {
        let rx = Math.floor(Math.random() * 11);
            if(walkersBottom.length < num && canSpawnBottom == true) {
                walker = WalkerObject(100 * rx, 1300, 2, 2); // spawns at random x or y
                walkersBottom.push(walker);
                canSpawnBottom = false;
                setTimeout(spawnLimitBottom, interval);
            }
        }

        function updateWalkersTop() {
            for(var i = 0; i < walkersTop.length; i++) {
            walkersTop[i].draw();
            walkersTop[i].followPlayer(player1);
            walkersTop[i].attack(player1);
            walkersTop[i].updatePosition();
            }
        }

        function updateWalkersRight() {
            for(var i = 0; i < walkersRight.length; i++) {
            walkersRight[i].draw();
            walkersRight[i].followPlayer(player1);
            walkersRight[i].attack(player1);
            walkersRight[i].updatePosition();
            }
        }

        function updateWalkersLeft() {
            for(var i = 0; i < walkersLeft.length; i++) {
            walkersLeft[i].draw();
            walkersLeft[i].followPlayer(player1);
            walkersLeft[i].attack(player1);
            walkersLeft[i].updatePosition();
            }
        }

        function updateWalkersBottom() {
            for(var i = 0; i < walkersBottom.length; i++) {
            walkersBottom[i].draw();
            walkersBottom[i].followPlayer(player1);
            walkersBottom[i].attack(player1);
            walkersBottom[i].updatePosition();
            }
        }

        //make diaganol bullets
        //make walkers move diagonal
        //learn more setInterval/animationFrame to make animations for bounce and damage animation
        function drawScene1() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const offsetX = canvas.width /2 - player1.position.x - 25;
        const offsetY = canvas.height /2 - player1.position.y;

        ctx.save();
        ctx.translate(offsetX, offsetY);
        drawGround();
        player1.draw();
        let randomNum = Math.floor(Math.random() * 3);
        spawnWalkersTop(randomNum, 0500);
        spawnWalkersRight(randomNum, 1000);
        spawnWalkersBottom(randomNum, 1000);
        spawnWalkersLeft(randomNum, 0500);
        updateWalkersBottom();
        updateWalkersLeft();
        updateWalkersTop();
        updateWalkersRight();
        player1.updatePosition();
        drawFrame(0,0,700,200);

            bulletsWASD.forEach((bullet, index) => { //handles collision detection
            walkers.forEach((walker, index) => {
            bullet.collisionDetect(walker);
                if(bullet.status == 0) {
                    bulletsWASD.splice(index, 1);
                }
                if(walker.status == 0) {
                    walkers.splice(index, 1);
                }
            });//works
            });

            //handles player movement
            if(rightPressed) {
                player1.right();
            } else if(leftPressed) {
                player1.left();
            }

            if(downPressed) {
                player1.down();
            } else if(upPressed) {
                player1.up();
            }

            bulletsW.forEach((bullet, index) => {
                if(bullet.status == 1) {
                    bullet.up();
                    bullet.draw();
                    bulletsWASD.push(bullet);
                } else if(bullet.y < mapY || bullet.status == 0) {
                    bullet.status == 0;
                    bulletsW.splice(index, 1);
                }
            });
            
            bulletsA.forEach((bullet, index) => {
                bullet.left();
                bullet.draw();
                bulletsWASD.push(bullet);
                if(bullet.x < mapX || bullet.status == 0) {
                    bullet.status == 0;
                    bulletsA.splice(index, 1);
                }
            });

            bulletsS.forEach((bullet, index) => {
                bullet.down();
                bullet.draw();
                bulletsWASD.push(bullet);
                if(bullet.y > mapY + mapHeight || bullet.status == 0) {
                    bullet.status == 0;
                    bulletsS.splice(index, 1);
                }
            });

            bulletsD.forEach((bullet, index) => {
                bullet.right();
                bullet.draw();
                bulletsWASD.push(bullet);
                if(bullet.x > mapX + mapWidth || bullet.status == 0) {
                    bullet.status == 0;       
                    bulletsD.splice(index, 1);    
                }
            });

            walkersTop.forEach((walker, index) => {
                if(walker.status == 0) {
                    walkersTop.splice(index, 1);    
                }
            });

            walkersRight.forEach((walker, index) => {
                if(walker.status == 0) {
                    walkersRight.splice(index, 1);    
                }
            });

            walkersLeft.forEach((walker, index) => {
                if(walker.status == 0) {
                    walkersLeft.splice(index, 1);    
                }
            });

            walkersBottom.forEach((walker, index) => {
                if(walker.status == 0) {
                    walkersBottom.splice(index, 1);    
                }
            });

         ctx.restore();
         requestAnimationFrame(drawScene1);
        }

        drawScene1();
