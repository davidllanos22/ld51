import { Container, IPoint, Point, Rectangle } from "pixi.js";
import { MathUtils } from "../lib/math";
import { SceneManager } from "../lib/scene-manager";
import { TiledAnimation, TiledAnimationSprite } from "../lib/tiled-animation-sprite";
import { GameScene } from "../scenes/game";

export class Entity extends Container{
  tiledAnimationSprite?: TiledAnimationSprite;
  speed: number = 10;
  collision: Rectangle;

  constructor(protected sceneManager: SceneManager, position: IPoint){
    super();

    this.position = position;

    this.collision = new Rectangle(0, 0, 200, 200);
  }

  initAnimationSprite(animations: Map<string, TiledAnimation>, textureName: string, defaultAnimation: string){
    this.tiledAnimationSprite = new TiledAnimationSprite(this.sceneManager.app.loader.resources[textureName].texture, 400, 400, animations);
    this.tiledAnimationSprite.setAnimation(defaultAnimation);
    this.tiledAnimationSprite.pivot.set(200, 200);
    this.addChild(this.tiledAnimationSprite);
  }

  move(x: number, y: number, reposition: boolean = false){
    //  Intenta mover a la posición, si hay colisión vuelve a la posición anterior
    let lastPosition = new Point(this.position.x, this.position.y);

    this.position.x += x * this.speed;
    this.position.y += y * this.speed;

    this.updateCollisions();

    if(reposition && !this.isPositionFree()){
      this.position = lastPosition;
      this.updateCollisions();
    }
  }

  update(dt: number){
    
  }

  updateCollisions(){
    this.collision.x = this.position.x - 100;
    this.collision.y = this.position.y;
  }

  isPositionFree(){
    let isFree = true;

    let collisions = (this.sceneManager.getCurrentScene() as GameScene).map.collisions;
    
    isFree = collisions.find((collision: Rectangle)=>{
      return MathUtils.rectsCollide(collision, this.collision);
    }) == null;

    return isFree;
  }
}