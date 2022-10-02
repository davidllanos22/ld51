import { Container, IPoint, Point, Rectangle, Sprite } from "pixi.js";
import { MathUtils } from "../lib/math";
import { SceneManager } from "../lib/scene-manager";
import { TiledAnimation, TiledAnimationSprite } from "../lib/tiled-animation-sprite";
import * as createjs from 'createjs-module';
import { GameScene } from "../scenes/game";
import { Entity } from "./entity";

export class Ghost extends Entity{

  count: number = 0;
  target: Container;

  constructor(sceneManager: SceneManager, position: IPoint){
    super(sceneManager, position);

    this.speed = MathUtils.randomInt(1, 3);

    let animations = new Map<string, TiledAnimation>();

    animations.set("idle", {
      frames: [{x: MathUtils.randomInt(0, 2), y: 0}],
      timePerFrame: 100,
      loop: true
    });

    this.initAnimationSprite(animations, "ghost", "idle");
    this.tiledAnimationSprite.alpha = 0;
  }

  update(dt: number){
    this.tiledAnimationSprite.update();

    this.scale.x = 1 + Math.sin(this.count) * 0.04;
    this.scale.y = 1 + Math.cos(this.count) * 0.04;

    this.count += 0.1;

    if(this.target) {
      let angle = MathUtils.angleFromTo(this.position, this.target.position);
      let directionVector = new Point(Math.cos(angle), Math.sin(angle))
      this.move(directionVector.x, directionVector.y);
    }
  }

  // isPositionFree(){
  //   let isFree = true;

  //   let ghosts = (this.sceneManager.getCurrentScene() as GameScene).ghosts;
  //   let collisions = ghosts.map((ghost: Ghost)=>ghost.collision).filter((collision: Rectangle)=>collision != null);
    
  //   isFree = collisions.find((collision: Rectangle)=>{
  //     if(collision == this.collision) return false;
  //     return MathUtils.rectsCollide(collision, this.collision);
  //   }) == null;

  //   return isFree;
  // }

  show(){
    //TODO: tiempo random
    createjs.Tween.get(this.tiledAnimationSprite).to({alpha: 1}, 1000);
  }

  hide(callback: any){
    //TODO: tiempo random
    createjs.Tween.get(this.tiledAnimationSprite).to({alpha: 0}, 1000).call(callback);
  }

  updateCollisions(){
    if(!this.collision) return;

    this.collision.x = this.position.x - 100;
    this.collision.y = this.position.y - 100;
  }
}