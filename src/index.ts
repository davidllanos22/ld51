import * as PIXI from 'pixi.js';
import { Input } from './lib/input';
import { Scene } from './lib/scene';
import { SceneManager } from './lib/scene-manager';
import { GameScene } from './scenes/game';
import { TitleScene } from './scenes/title';

let sceneManager: SceneManager;

const load = (app: PIXI.Application) => {
  return new Promise<void>((resolve) => {
    app.loader
    .add("player", "assets/images/player.png")
    .add("ghost", "assets/images/ghost.png")
    .add("map", "assets/tiled/map.json")
    .add("tiles", "assets/images/tiles.png")
    .load(() => {
      resolve();
    });
  });
};

const main = async () => {
  // Main app
  let app = new PIXI.Application();

  // Display application properly
  document.body.style.margin = '0';
  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.display = 'block';

  // View size = windows
  app.renderer.resize(window.innerWidth, window.innerHeight);
  window.addEventListener('resize', (e) => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });

  // Load assets
  await load(app);
  document.body.appendChild(app.view);

  Input.init();

  sceneManager = new SceneManager(app);

  let scenes = new Map<string, Scene>();
  scenes.set("title", new TitleScene());
  scenes.set("game", new GameScene());

  sceneManager.setScenes(scenes);

  sceneManager.changeScene("game")

  app.ticker.add(update);
};

const update = (_: any, dt: number) => {
  // TODO!: moverlo a scene manager
  let currentScene = sceneManager.getCurrentScene();
  if(currentScene) currentScene.update(dt);
}

main();
