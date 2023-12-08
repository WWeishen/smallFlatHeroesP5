class Monster {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 2);
    this.collided = false;
  }

  checkObstacleCollision(targetGroup) {
    // target is an array of obstacle
    targetGroup.forEach((target,index) => {
      if (
        this.pos.y + this.r >= target.y &&
        this.pos.x + this.r >= target.x &&
        this.pos.x <= target.x + target.width
      ) {
        this.collided = true;
      }
      if (this.pos.y > canvaHeight || this.collided) {
        if(this.constructor.name == "MonsterFall"){
          monstersFall.splice(index, 1);
        }else{
          monstersTrack.splice(index, 1);
        }
        
      }
    });
  }

  checkPlayerCollision(player){
    // Collision detection between player and monster
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
  }
  update() {
    this.pos.add(this.vel);
  }

  // On dessine le monstre
  draw() {
    // formes fil de fer en blanc
    noStroke();
    // épaisseur du trait = 2
    strokeWeight(2);
    // formes pleines
    fill('#A251FA'); // purple color
    // sauvegarde du contexte graphique (couleur pleine, fil de fer, épaisseur du trait, 
    // position et rotation du repère de référence)
    push();
    // on déplace le repère de référence.
    translate(this.pos.x, this.pos.y);
    // et on le tourne. heading() renvoie l'angle du vecteur vitesse (c'est l'angle du véhicule)
    rotate(this.vel.heading());

    rect(0, 0, 20, 8);
    // Que fait cette ligne ?
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


  // On dessine le véhicule
  draw() {
    // formes fil de fer en blanc
    noStroke();
    // épaisseur du trait = 2
    strokeWeight(2);

    // formes pleines
    fill(255, 0, 0); // Red color

    // sauvegarde du contexte graphique (couleur pleine, fil de fer, épaisseur du trait, 
    // position et rotation du repère de référence)
    push();
    // on déplace le repère de référence.
    translate(this.pos.x, this.pos.y);
    // et on le tourne. heading() renvoie l'angle du vecteur vitesse (c'est l'angle du véhicule)
    rotate(this.vel.heading());

    // Dessin d'un véhicule sous la forme d'un triangle. Comme s'il était droit, avec le 0, 0 en haut à gauche
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);

    pop();
  }

  update() {
    // on ajoute l'accélération à la vitesse. L'accélération est un incrément de vitesse
    // (accélératiion = dérivée de la vitesse)
    this.vel.add(this.acc);
    // on contraint la vitesse à la valeur maxSpeed
    this.vel.limit(this.maxSpeed);
    // on ajoute la vitesse à la position. La vitesse est un incrément de position, 
    // (la vitesse est la dérivée de la position)
    this.pos.add(this.vel);
    // on remet l'accélération à zéro
    this.acc.set(0, 0);
  }
}