class Obstacle {
  constructor(x, y, width,height) {
    this.x = x;
    this.y = y;
    this.color = color(34, 139, 34);
    this.width = width;
    this.height = height;
  }

  draw() {
    push();
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}