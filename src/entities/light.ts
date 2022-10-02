import { BLEND_MODES, Container, filters, Graphics, Point, Rectangle } from "pixi.js";
import { Triangle } from "../lib/math";
import { SceneManager } from "../lib/scene-manager";
import { GameScene } from "../scenes/game";
import { Ghost } from "./ghost";

export class Light extends Container{
  
  triangle: Triangle;
  graphics: Graphics;

  constructor(private sceneManager: SceneManager, private owner: any){
    super();

    let size = 500;

    this.triangle = new Triangle(new Point(0, 0), new Point(size,  -size / 2), new Point(size, size / 2));

    this.graphics = new Graphics();

    this.graphics.blendMode = BLEND_MODES.SCREEN;
    this.graphics.alpha = 0.5;
    this.addChild(this.graphics);
  }

  update(dt: number){
    let ghosts = (this.sceneManager.getCurrentScene() as GameScene).ghosts;

    ghosts.forEach((ghost: Ghost)=>{
      if(ghost && ghost.collision){
        let triangle = new Triangle(
          new Point(this.triangle.a.x + this.owner.position.x, this.triangle.a.y + this.owner.position.y),
          new Point(this.triangle.b.x + this.owner.position.x, this.triangle.b.y + this.owner.position.y),
          new Point(this.triangle.c.x + this.owner.position.x, this.triangle.c.y + this.owner.position.y),
        );
  
        let intersects = triangle.intersectsRect(ghost.collision);
  
        //TODO: si toca más de X segundos desaparece
        if(intersects){
          ghost.hide(()=>{});
        }
      }
    });

    this.drawTriangle();
  }

  drawTriangle(){
    this.graphics.clear();
    this.graphics.beginFill(0xFFFF00);
    this.graphics.moveTo(this.triangle.a.x, this.triangle.a.y);
    this.graphics.lineTo(this.triangle.b.x, this.triangle.b.y);
    this.graphics.lineTo(this.triangle.c.x, this.triangle.c.y);
    this.graphics.endFill();
  }

  rotate(angle: number){
    this.triangle.rotate(angle);
  }

}