import { Container, IPoint, Rectangle, Sprite } from "pixi.js";
import { MathUtils } from "../lib/math";
import { SceneManager } from "../lib/scene-manager";
import { TiledAnimation, TiledAnimationSprite } from "../lib/tiled-animation-sprite";
import * as createjs from 'createjs-module';

export class Ghost extends Container{
  tiledAnimationSprite?: TiledAnimationSprite;
  speed: number = 2;

  count: number = 0;
  target: Container;
  collision: Rectangle;

  constructor(private sceneManager: SceneManager, position: IPoint){
    super();
    this.position = position;

    let animations = new Map<string, TiledAnimation>();

    animations.set("idle", {
      frames: [{x: MathUtils.randomInt(0, 2), y: 0}],
      timePerFrame: 100,
      loop: true
    });

    this.tiledAnimationSprite = new TiledAnimationSprite(this.sceneManager.app.loader.resources["ghost"].texture, 400, 400, animations);
    this.tiledAnimationSprite.setAnimation("idle");
    this.tiledAnimationSprite.pivot.set(200, 200);
    this.tiledAnimationSprite.alpha = 0;

    this.collision = new Rectangle(0, 0, 200, 200);

    this.addChild(this.tiledAnimationSprite);
  }

  update(dt: number){
    this.tiledAnimationSprite.update();

    this.scale.x = 1 + Math.sin(this.count) * 0.04;
    this.scale.y = 1 + Math.cos(this.count) * 0.04;

    this.count += 0.1;

    // TODO: poder usar una velocidad concreta, diferente para cada uno?
    if(this.target) this.position = MathUtils.lerpPoint(this.position, this.target.position, 0.002);
    this.updateCollisions();
  }

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

    this.collision.x = this.position.x + 100;
    this.collision.y = this.position.y + 200;
  }
}