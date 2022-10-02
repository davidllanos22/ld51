import { IPoint } from "pixi.js";
import { SceneManager } from "../lib/scene-manager";
import { TiledAnimation } from "../lib/tiled-animation-sprite";
import { Entity } from "./entity";

export class Guard extends Entity{
  constructor(sceneManager: SceneManager, position: IPoint){
    super(sceneManager, position);

    let animations = new Map<string, TiledAnimation>();

    animations.set("idle", {
      // frames: [{x: 0, y: 0}, {x: 1, y: 0}],
      frames: [{x: 0, y: 0}],
      timePerFrame: 100,
      loop: true
    })

    this.initAnimationSprite(animations, "player", "idle");
  }
}