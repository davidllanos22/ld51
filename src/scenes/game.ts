import { Howl } from "howler";
import { Container, filters, Graphics, Point, Rectangle, SCALE_MODES, Sprite, Text } from "pixi.js";
import { Ghost } from "../entities/ghost";
import { Player } from "../entities/player";
import { Input, Keys } from "../lib/input";
import { MathUtils } from "../lib/math";
import { Scene } from "../lib/scene";
import { TiledMap } from "../lib/tiled-map";

const NUM_GHOSTS = 1;
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

  isGhostTurn: boolean = false;

  init(): void {
    let text = new Text('Game Scene', {
      fontFamily : 'Arial',
      fontSize: 24,
      fill : 0xFFFFFF,
    });

    this.scale.set(SCALE, SCALE);

    // this.addChild(text);
    this.map = new TiledMap(this.sceneManager, "map");
    this.addChild(this.map);

    //TODO: obtener posición inicial de tiled
    this.player = new Player(this.sceneManager, new Point(0, 0));
    this.addChild(this.player);

    this.spawnGhosts();
    
    this.addChild(this.ghostContainer);

    this.addChild(this.collisionsGraphics);

    this.initFlashLightMask();

    this.startTimers();

    this.sound = new Howl({
      src: ['assets/sounds/random.wav']
    });
  }

  initFlashLightMask(){
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
    this.focusSprite.visible = false;

    this.addChild(this.focusSprite);
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

    if(this.focusSprite){
      this.focusSprite.position.x = cameraX + screenWidth / 2;
      this.focusSprite.position.y = cameraY + screenHeight / 2;
      let r = 1 + Math.random() * 0.05;
      this.focusSprite.scale.set(r, r);
    }

    this.ghosts.forEach((ghost: Ghost)=>{
      ghost.update(dt);
    });

    this.drawCollisionsGraphics();
  }

  spawnGhosts(){
    //TODO hacer puntos de spawn por el mapa en vez de añadirlos en una posición random
    for(let i = 0; i < NUM_GHOSTS; i++){
      let x = 0;MathUtils.randomInt(-500, 1000);
      let y = 0;MathUtils.randomInt(-500, 1000);
      let ghost = new Ghost(this.sceneManager, new Point(x, y));
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

    if(this.isGhostTurn){
      this.showFlashlight();
    }else{
      this.hideFlashlight();
      this.showGhosts();
    }

  }

  onPreTimer(){
    if(this.isGhostTurn) {
      this.stopMovingGhosts();
      this.hideGhosts();
    }else{
      this.blinkFlashlight();
    }  
  }

  onPostTimer(){
    if(this.firstTimer){
      this.firstTimer = false;
      return;
    }

    if(!this.isGhostTurn) this.startMovingGhosts();

    this.isGhostTurn = !this.isGhostTurn;
  }

  showGhosts(){
    this.ghosts.forEach((ghost: Ghost)=>{
      ghost.show();
    });
  }

  hideGhosts(){
    this.ghosts.forEach((ghost: Ghost)=>{
      ghost.hide();
    });
  }

  startMovingGhosts(){
    this.ghosts.forEach((ghost: Ghost)=>{
      ghost.target = this.player;
    });
  }

  stopMovingGhosts(){
    this.ghosts.forEach((ghost: Ghost)=>{
      ghost.target = null;
    });
  }

  blinkFlashlight(){
    console.log("TODO: blinkFlashlight")
  }

  showFlashlight(){
    this.mask = null;
    this.focusSprite.visible = false;
  }

  hideFlashlight(){
    this.mask = this.focusSprite;
    this.focusSprite.visible = true;
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