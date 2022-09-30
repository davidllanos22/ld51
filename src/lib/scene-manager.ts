import { Scene } from "./scene";

export class SceneManager {
  scenes: Map<string, Scene> = new Map();
  currentSceneName: string = "";
  app: PIXI.Application;

  constructor(app: PIXI.Application){
    this.app = app;
  }

  setScenes(scenes: Map<string, Scene>){
    this.scenes = scenes;
  }

  changeScene(scenename: string, fadeInTransition: any = null, fadeOutTransition: any = null){
    this.currentSceneName = scenename;
    let currentScene = this.getCurrentScene();
    if(!currentScene) throw(`No existe la escena ${currentScene}`);

    currentScene.setSceneManager(this);
    currentScene.init();
    this.app.stage.removeChildren();
    this.app.stage.addChild(currentScene);
  }

  getCurrentScene(): Scene | undefined{
    return this.getScene(this.currentSceneName);
  }


  private getScene(sceneName: string): Scene | undefined{
    return this.scenes.get(sceneName);
  }
  
}