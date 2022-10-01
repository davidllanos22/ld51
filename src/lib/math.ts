import { IPoint, Point, Rectangle } from "pixi.js";

export class Vector2{
  x: number = 0;
  y: number = 0;

  constructor(x: number, y: number){
    this.x = x;
    this.y = y;
  }
}

export class MathUtils{
  static lerp(x: number, y: number, a: number): number{
    return x * (1 - a) + y * a;
  }

  static lerpPoint(x: IPoint, y: IPoint, a: number){
    return new Point(this.lerp(x.x, y.x, a), this.lerp(x.y, y.y, a));
  }

  static randomInt(min: number, max: number){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  static randomAngle(){
    return Math.random() * Math.PI * 2;
  }

  static rectsCollide(a: Rectangle, b: Rectangle){
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.height + a.y > b.y;
  }
}