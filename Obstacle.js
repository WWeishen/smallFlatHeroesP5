class Obstacle {
    constructor(x, y, width, height){
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;//Je propose de fiwed height =10;
    }

    draw() {
        fill(34, 139, 34); // Green color
        noStroke(); 
        rect(this.x, this.y, this.width, this.height);
    }
}