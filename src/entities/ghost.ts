import { Container, IPoint } from "pixi.js";
import { MathUtils } from "../lib/math";
import { SceneManager } from "../lib/scene-manager";
import { TiledAnimation, TiledAnimationSprite } from "../lib/tiled-animation-sprite";
import { Player } from "./player";

export class Ghost extends Container{
  tiledAnimationSprite?: TiledAnimationSprite;
  speed: number = 2;

  constructor(private sceneManager: SceneManager, private player: Player, position: IPoint){
    super();
    this.position = position;

    let animations = new Map<string, TiledAnimation>();

    animations.set("walk", {
      frames: [{x: 0, y: 0}, {x: 1, y: 0}],
      timePerFrame: 100,
      loop: true
    });

    this.tiledAnimationSprite = new TiledAnimationSprite(this.sceneManager.app.loader.resources["ghost"].texture, 400, 400, animations);
    this.tiledAnimationSprite.setAnimation("walk");

    this.addChild(this.tiledAnimationSprite);
  }

  update(dt: number){
    this.tiledAnimationSprite.update();
    // TODO: poder usar una velocidad concreta, diferente para cada uno?
    this.position = MathUtils.lerpPoint(this.position, this.player.position, 0.002);
  }
}