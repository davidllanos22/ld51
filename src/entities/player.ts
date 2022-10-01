import { Container, IPoint, Point, Rectangle } from "pixi.js";
import { Input, Keys } from "../lib/input";
import { MathUtils } from "../lib/math";
import { SceneManager } from "../lib/scene-manager";
import { TiledAnimation, TiledAnimationSprite } from "../lib/tiled-animation-sprite";
import { GameScene } from "../scenes/game";

export class Player extends Container{
  tiledAnimationSprite?: TiledAnimationSprite;
  speed: number = 10;
  collision: Rectangle;

  interactCollision: Rectangle;

  constructor(private sceneManager: SceneManager, position: IPoint){
    super();
    this.position = position;

    let animations = new Map<string, TiledAnimation>();

    animations.set("walk", {
      // frames: [{x: 0, y: 0}, {x: 1, y: 0}],
      frames: [{x: 0, y: 0}],
      timePerFrame: 100,
      loop: true
    })

    this.tiledAnimationSprite = new TiledAnimationSprite(this.sceneManager.app.loader.resources["player"].texture, 400, 400, animations);
    this.tiledAnimationSprite.setAnimation("walk");
    this.tiledAnimationSprite.pivot.set(200, 200);

    this.collision = new Rectangle(0, 0, 200, 200);
    this.interactCollision = new Rectangle(0, 0, 400, 400);

    this.addChild(this.tiledAnimationSprite);
  }

  update(dt: number){
    this.tiledAnimationSprite.update();

    if(Input.isKeyPressed(Keys.UP) || Input.isKeyPressed(Keys.W)){
      this.move(0, -1);
    }

    if(Input.isKeyPressed(Keys.DOWN) || Input.isKeyPressed(Keys.S)){
      this.move(0, 1);
    }

    if(Input.isKeyPressed(Keys.LEFT) || Input.isKeyPressed(Keys.A)){
      this.move(-1, 0);
    }

    if(Input.isKeyPressed(Keys.RIGHT) || Input.isKeyPressed(Keys.D)){
      this.move(1, 0);
    }

    if(Input.isKeyJustPressed(Keys.SPACE)){
      this.interact();
    }

    
  }


  move(x: number, y: number){
    //  Intenta mover a la posición, si hay colisión vuelve a la posición anterior
    let lastPosition = new Point(this.position.x, this.position.y);

    this.position.x += x * this.speed;
    this.position.y += y * this.speed;

    this.updateCollisions();

    if(!this.isPositionFree()){
      this.position = lastPosition;
      this.updateCollisions();
    }
  }

  updateCollisions(){
    this.collision.x = this.position.x - 100;
    this.collision.y = this.position.y;

    //TODO: posicionar correctamente
    this.interactCollision.x = this.position.x;
    this.interactCollision.y = this.position.y;
  }

  isPositionFree(){
    let isFree = true;

    let collisions = (this.sceneManager.getCurrentScene() as GameScene).map.collisions;
    
    isFree = collisions.find((collision: Rectangle)=>{
      return MathUtils.rectsCollide(collision, this.collision);
    }) == null;

    return isFree;
  }


  interact(){
    //TODO obtener entidades interactuables
    //TODO comprobar si está colisionando con alguno
    //TODO interactuar 
  }
}