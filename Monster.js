class Monster {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 2);
    this.collided = false;
    // MB : in general, ennemies have a bounding circle or/and a bounding box
    // Bounding circle radius
    this.r = 16;
    // bounding box size
    this.width = 20;
    this.height = 8;

    this.color = "black";
  }

  checkObstacleCollision(targetGroup) {
    // target is an array of obstacles
    targetGroup.forEach((target) => {
      if(rectsOverlap(this.pos.x, this.pos.y, this.r, this.r, 
        target.x, target.y, target.width, target.height)) {
        this.collided = true;
      }
    });
  }

  checkPlayerCollision(player){
    if (player.pos.x + player.size >= this.pos.x && player.pos.x <= this.pos.x + this.r) {
      if (player.pos.y + player.size >= this.pos.y && player.pos.y <= this.pos.y + this.r) {
       return true;
      }
    }
    return false;
  }

}

class MonsterFall extends Monster{
  constructor(x,y){
    super(x,y);
    this.color = '#A251FA'; // purple color
  }
  update() {
    this.pos.add(this.vel);
  }

  draw() {
    noStroke();
    strokeWeight(2);
    fill(this.color); 
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());

    rect(0, 0, this.width, this.height);
    pop();
  }
}

class MonsterTrack extends Monster{
  constructor(x, y){
    super(x,y);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
    this.maxForce = 0.25;
    this.r = 16;
    this.color = "red";
  }
  
  applyForce(force) {
    this.acc.add(force);
  }

  applyBehaviors(target) {
    let force1 = this.seek(target);
    this.applyForce(force1);
  }

  seek(target) {
    let force = p5.Vector.sub(target, this.pos);
    force.setMag(this.maxSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  draw() {
    noStroke();
    strokeWeight(2);
    fill(this.color);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }
}