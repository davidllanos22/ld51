import { Howl } from "howler";
import { Container, filters, Graphics, Point, Rectangle, SCALE_MODES, Sprite, Text } from "pixi.js";
import { Ghost } from "../entities/ghost";
import { Player } from "../entities/player";
import { Input, Keys } from "../lib/input";
import { MathUtils } from "../lib/math";
import { Scene } from "../lib/scene";
import { TiledMap } from "../lib/tiled-map";

const NUM_GHOSTS = 5;
const SCALE = 0.3;
const EVERY_10_SECONDS = 10000;

export class GameScene extends Scene{
  sound?: Howl;

  player?: Player;
  ghosts: Ghost[] = [];
  ghostContainer: Container = new Container();
  map: TiledMap;

  mainTimeout: any;
  preTimeout: any;
  postTimeout: any;
  firstTimer: boolean = true;

  collisionsGraphics: Graphics = new Graphics();

  focusSprite: Sprite;

  init(): void {
    let text = new Text('Game Scene', {
      fontFamily : 'Arial',
      fontSize: 24,
      fill : 0xFFFFFF,
    });

    this.scale.set(SCALE, SCALE);

    this.addChild(text);
    this.map = new TiledMap(this.sceneManager, "map");
    this.addChild(this.map);

    this.player = new Player(this.sceneManager, new Point(12 * 400, 23 * 400));
    this.addChild(this.player);

    this.spawnGhosts();
    this.ghostContainer.visible = false;
    
    this.addChild(this.ghostContainer);

    this.addChild(this.collisionsGraphics);

    const radius = 700;
    const blurSize = 100;

    const circle = new Graphics()
        .beginFill(0xFF0000)
        .drawCircle(radius + blurSize + 50, radius + blurSize + 50, radius)
        .endFill();

    circle.filters = [new filters.BlurFilter(blurSize)];
    let size = (radius + blurSize + 20) * 2 + 50;

    const bounds = new Rectangle(0, 0, size, size);
    const texture = this.sceneManager.app.renderer.generateTexture(circle, SCALE_MODES.LINEAR, 2, bounds);
    this.focusSprite = new Sprite(texture);
    this.focusSprite.pivot.set(size / 2, size / 2);

    this.addChild(this.focusSprite);
    this.mask = this.focusSprite;

    this.startTimers();

    this.sound = new Howl({
      src: ['assets/sounds/random.wav']
    });
  }

  update(dt: number): void {

    if(Input.isKeyJustPressed(Keys.ESC)){
      this.sceneManager.changeScene("title");
    }

    this.player.update(dt);
    let screenWidth = this.sceneManager.app.view.width / SCALE;
    let screenHeight = this.sceneManager.app.view.height / SCALE;

    let cameraX = (this.player.x + 200) - screenWidth / 2;
    let cameraY = (this.player.y + 200) - screenHeight / 2;

    this.pivot.set(cameraX, cameraY);

    this.focusSprite.position.x = cameraX + screenWidth / 2;
    this.focusSprite.position.y = cameraY + screenHeight / 2;

    let r = 1 + Math.random() * 0.05;
    this.focusSprite.scale.set(r, r);


    this.ghosts.forEach((ghost: Ghost)=>{
      ghost.update(dt);
    });

    this.drawCollisionsGraphics();
  }

  spawnGhosts(){
    //TODO hacer puntos de spawn por el mapa en vez de añadirlos en una posición random
    for(let i = 0; i < NUM_GHOSTS; i++){
      let x = MathUtils.randomInt(-500, 1000);
      let y = MathUtils.randomInt(-500, 1000);
      let ghost = new Ghost(this.sceneManager, this.player, new Point(x, y));
      this.ghosts.push(ghost);
      this.ghostContainer.addChild(ghost);
    }
  }

  startTimers(){
    if(this.mainTimeout) clearTimeout(this.mainTimeout);
    if(this.preTimeout) clearTimeout(this.preTimeout);
    if(this.postTimeout) clearTimeout(this.postTimeout);

    this.mainTimeout = setTimeout(this.onMainTimer.bind(this), EVERY_10_SECONDS);
    this.preTimeout = setTimeout(this.onPreTimer.bind(this), EVERY_10_SECONDS - 1000);
    this.postTimeout = setTimeout(this.onPostTimer.bind(this), 1000);
  }

  onMainTimer(){
    this.startTimers();
    console.log("main");
    this.toggleFlashlight();
    this.showGhosts();
  }

  onPreTimer(){
    console.log("pre");
    this.blinkFlashlight();
    this.hideGhosts();
  }

  onPostTimer(){
    if(this.firstTimer){
      this.firstTimer = false;
      return;
    }
    console.log("post");
    this.startMovingGhosts();
  }

  showGhosts(){
    this.ghostContainer.visible = true;
  }

  hideGhosts(){
    this.ghostContainer.visible = false;
  }

  startMovingGhosts(){

  }

  blinkFlashlight(){

  }

  toggleFlashlight(){

  }


  drawCollisionsGraphics(){
    this.collisionsGraphics.clear();
    let collisions = [];

    if(this.map) collisions.push(...this.map.collisions);
    if(this.player) collisions.push(this.player.collision);

    this.collisionsGraphics.lineStyle(5, 0xFF0000);

    collisions.forEach((collision: Rectangle)=>{
      this.collisionsGraphics.drawRect(collision.x, collision.y, collision.width, collision.height);
    });
  }

}