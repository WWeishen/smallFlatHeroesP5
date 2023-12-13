class Player {
    constructor(x, y,color) {
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        this.size = 30;
        this.gravity = createVector(0, 0.5);
        this.grounded = false;
        this.color = color;
        this.lives = 3;
        this.lastCollisionTime =0;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        if (!this.grounded) {
            this.applyForce(this.gravity); // Apply gravity
        } 
        
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc.mult(0);
        
        if (this.pos.y >= height - this.size) {
            this.pos.y = height - this.size;
            this.grounded = true;
        } else {
            this.grounded = false;
        }

        // Keep the player within the canva bounds
        this.pos.x = constrain(this.pos.x, 0, canvaWidth - this.size);
        
    }

    draw() {
        fill(this.color);
        rect(this.pos.x, this.pos.y, this.size, this.size);
    }


    move(direction) {
        let force = createVector(0, 0);
        if (direction === 'right') {
          force.x = 3;
        } else if (direction === 'left') {
          force.x = -3;
        } else if (this.grounded == true && direction === 'up') {
            force.y = -3;
        }
        this.applyForce(force);
    }

    stop() {
        this.vel.x = 0;
    }
    checkObstacleCollision(obstacle){
        if(rectsOverlap(this.pos.x,this.pos.y,this.size,this.size,
            obstacle.x,obstacle.y,obstacle.width,obstacle.height)){
                this.pos.y = obstacle.y - obstacle.height-this.size;
                this.grounded = true;
        }
    }
}
