import { Container, IPoint } from "pixi.js";
import { Input, Keys } from "../lib/input";
import { SceneManager } from "../lib/scene-manager";
import { TiledAnimation, TiledAnimationSprite } from "../lib/tiled-animation-sprite";

export class Player extends Container{
  tiledAnimationSprite?: TiledAnimationSprite;
  speed: number = 10;

  constructor(private sceneManager: SceneManager, position: IPoint){
    super();
    this.position = position;

    let animations = new Map<string, TiledAnimation>();

    animations.set("walk", {
      frames: [{x: 0, y: 0}, {x: 1, y: 0}],
      timePerFrame: 100,
      loop: true
    })

    this.tiledAnimationSprite = new TiledAnimationSprite(this.sceneManager.app.loader.resources["player"].texture, 400, 400, animations);
    this.tiledAnimationSprite.setAnimation("walk");

    this.addChild(this.tiledAnimationSprite);
  }

  update(dt: number){
    this.tiledAnimationSprite.update();

    if(Input.isKeyPressed(Keys.UP) || Input.isKeyPressed(Keys.W)){
      this.position.y -= this.speed;
    }

    if(Input.isKeyPressed(Keys.DOWN) || Input.isKeyPressed(Keys.S)){
      this.position.y += this.speed;
    }

    if(Input.isKeyPressed(Keys.LEFT) || Input.isKeyPressed(Keys.A)){
      this.position.x -= this.speed;
    }

    if(Input.isKeyPressed(Keys.RIGHT) || Input.isKeyPressed(Keys.D)){
      this.position.x += this.speed;
    }
  }
}