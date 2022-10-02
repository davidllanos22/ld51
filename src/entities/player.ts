import { Container, IPoint, Point, Rectangle } from "pixi.js";
import { Input, Keys } from "../lib/input";
import { MathUtils } from "../lib/math";
import { SceneManager } from "../lib/scene-manager";
import { TiledAnimation, TiledAnimationSprite } from "../lib/tiled-animation-sprite";
import { GameScene, SCALE } from "../scenes/game";
import { Entity } from "./entity";
import { Item } from "./item";
import { Light } from "./light";

export class Player extends Entity{
  interactCollision: Rectangle;

  light: Light;

  constructor(sceneManager: SceneManager, position: IPoint){
    super(sceneManager, position);

    this.interactCollision = new Rectangle(0, 0, 400, 400);
    this.light = new Light(this.sceneManager, this);
    this.light.visible = false;

    let animations = new Map<string, TiledAnimation>();

    animations.set("idle", {
      // frames: [{x: 0, y: 0}, {x: 1, y: 0}],
      frames: [{x: 0, y: 0}],
      timePerFrame: 100,
      loop: true
    })

    this.initAnimationSprite(animations, "player", "idle");
    this.addChild(this.light);
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

    let mouseWorld = Input.getMouseWorld();

    let angle = MathUtils.angleFromTo(this.position, mouseWorld);

    this.light.rotate(angle);
    this.light.update(dt);
  }

  move(x: number, y: number){
    super.move(x, y, true);
  }

  updateCollisions(){
    super.updateCollisions();

    this.interactCollision.x = this.position.x - 200;
    this.interactCollision.y = this.position.y - 150;
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

  setLightVisible(visible: boolean){
    this.light.visible = visible;
  }
}