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

  static angleFromTo(a: IPoint, b: IPoint){
    return Math.atan2(b.y - a.y, b.x - a.x);
  }

  static toDegrees(radians: number){
    return radians * (180 / Math.PI);
  }

  static rotatePoint(origin: Point, point: Point, angle: number){
    let result = point.clone();
    result.x = Math.cos(angle) * (point.x - origin.x) - Math.sin(angle) * (point.y - origin.y) + origin.x;
    result.y = Math.sin(angle) * (point.x - origin.x) + Math.cos(angle) * (point.y - origin.y) + origin.y;
    return result;
  }
}

export class Triangle{
  _b: Point;
  _c: Point;

  constructor(public a: Point, public b: Point, public c: Point){
    this._b = b.clone();
    this._c = c.clone();
  }

  intersectsPoint(point: Point){
    let cx = point.x, cy = point.y,
      t0 = this.a, t1 = this.b, t2 = this.c,
      v0x = t2.x-t0.x, v0y = t2.y-t0.y,
      v1x = t1.x-t0.x, v1y = t1.y-t0.y,
      v2x = cx-t0.x, v2y = cy-t0.y,
      dot00 = v0x*v0x + v0y*v0y,
      dot01 = v0x*v1x + v0y*v1y,
      dot02 = v0x*v2x + v0y*v2y,
      dot11 = v1x*v1x + v1y*v1y,
      dot12 = v1x*v2x + v1y*v2y

    // Compute barycentric coordinates
    let b = (dot00 * dot11 - dot01 * dot01),
      inv = b === 0 ? 0 : (1 / b),
      u = (dot11*dot02 - dot01*dot12) * inv,
      v = (dot00*dot12 - dot01*dot02) * inv

    return u>=0 && v>=0 && (u+v < 1)
  }

  intersectsRect(rect: Rectangle){
    return this.intersectsPoint(new Point(rect.x, rect.y)) ||
      this.intersectsPoint(new Point(rect.x + rect.width, rect.y)) ||
      this.intersectsPoint(new Point(rect.x + rect.width, rect.y + rect.height)) ||
      this.intersectsPoint(new Point(rect.x, rect.y + rect.height));
  }

  rotate(angle: number){
    this.b = MathUtils.rotatePoint(this.a, this._b, angle);
    this.c = MathUtils.rotatePoint(this.a, this._c, angle);
  }
  
}