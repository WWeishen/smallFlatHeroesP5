class Player {
    constructor(x, y,color) {
        this.pos = createVector(x, y);
        this.size = 30;
        this.vel = createVector();
        this.acc = createVector();
        this.gravity = createVector(0, 0.5);
        this.grounded = false;
        this.jumping = false;
        this.lives = 3;
        this.color = color;
        this.lastCollisionTime =0;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.applyForce(this.gravity);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
        this.pos.x = constrain(this.pos.x, 0, canvaWidth - this.size);
        this.pos.y = constrain(this.pos.y, 0, canvaHeight - this.size);
    }

    draw() {
        fill(this.color);
        rect(this.pos.x, this.pos.y, this.size, this.size);
    }

    jump(){
        this.vel.y = -8;
        this.grounded = false;
        this.jumping = true;
    }

    move(direction) {
        const speed = 3;
        if (direction === 'right') {
            this.applyForce(createVector(speed, 0));
        } else if (direction === 'left') {
            this.applyForce(createVector(-speed, 0));
        } else if (direction === 'up') {
            this.jump();
        }
    }

    stop() {
        this.vel.x = 0;
    }
    checkObstacleCollision(obstacle){
        if(rectsOverlap(this.pos.x,this.pos.y,this.size,this.size,
            obstacle.x,obstacle.y,obstacle.width,obstacle.height)){
                this.pos.y = obstacle.y -this.size;
                this.grounded = true;
                this.jumping = false;
                this.vel.y = 0;
        }
        else{
            this.grounded = false;
        } 
    }
}
