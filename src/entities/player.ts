import { Container, IPoint, Point, Rectangle } from "pixi.js";
import { Input, Keys } from "../lib/input";
import { MathUtils } from "../lib/math";
import { SceneManager } from "../lib/scene-manager";
import { TiledAnimation, TiledAnimationSprite } from "../lib/tiled-animation-sprite";
import { GameScene, SCALE } from "../scenes/game";
import { Item } from "./item";
import { Light } from "./light";

export class Player extends Container{
  tiledAnimationSprite?: TiledAnimationSprite;
  speed: number = 10;
  collision: Rectangle;

  interactCollision: Rectangle;

  light: Light;

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
    this.light = new Light(this);

    this.addChild(this.tiledAnimationSprite);
    this.addChild(this.light)
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

    let mouse = Input.getMouse();
    let gameContainerPosition = this.position;
    let screenWidth = this.sceneManager.app.view.width / SCALE;
    let screenHeight = this.sceneManager.app.view.height / SCALE;

    let mouseRelative = new Point(gameContainerPosition.x + (mouse.x * 2) - screenWidth / 2, gameContainerPosition.y + (mouse.y * 2) - screenHeight / 2);

    let angle = MathUtils.angleFromTo(this.position, mouseRelative);
    console.log("-----------")
    console.log(mouseRelative)
    console.log(this.position)
    console.log(MathUtils.toDegrees(angle))

    this.light.rotation = angle;
    this.light.update(dt);
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
    this.interactCollision.x = this.position.x - 200;
    this.interactCollision.y = this.position.y - 150;
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
    let items = (this.sceneManager.getCurrentScene() as GameScene).items; 

    let interactItem = items.find((item: Item)=>{
      return MathUtils.rectsCollide(item.collision, this.interactCollision);
    });

    if(interactItem){
      interactItem.interact();
    }
  }
}