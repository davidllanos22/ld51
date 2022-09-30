import { Container } from "pixi.js";
import { SceneManager } from "./scene-manager";

export abstract class Scene extends Container {

  sceneManager?: SceneManager;

  setSceneManager(sceneManager: SceneManager){
    this.sceneManager = sceneManager;
  }

  abstract init(): void;
  abstract update(dt: number): void;
}