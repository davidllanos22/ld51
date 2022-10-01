import { Howl } from "howler";
import { Container, DisplayObject, filters, Graphics, Point, Rectangle, SCALE_MODES, Sprite, Text } from "pixi.js";
import { Ghost } from "../entities/ghost";
import { Player } from "../entities/player";
import { Input, Keys } from "../lib/input";
import { MathUtils } from "../lib/math";
import { Scene } from "../lib/scene";
import { TiledMap } from "../lib/tiled-map";
import * as createjs from 'createjs-module';
import { Item } from "../entities/item";

const NUM_GHOSTS = 10;
const SCALE = 0.5;
const EVERY_10_SECONDS = 10000;
const GHOST_R = 1000;

export class GameScene extends Scene{
  sounds: any;

  bag: string[] = [];

  player: Player;
  ghosts: Ghost[] = [];
  items: Item[] = [];
  ghostContainer: Container = new Container();
  map: TiledMap;

  mainTimeout: any;

  collisionsGraphics: Graphics = new Graphics();

  focusSprite: Sprite;
  focusSpriteScale: number = 3;

  isGhostTurn: boolean = false;

  init(): void {
    let text = new Text('Game Scene', {
      fontFamily : 'Arial',
      fontSize: 24,
      fill : 0xFFFFFF,
    });

    this.scale.set(SCALE, SCALE);

    this.map = new TiledMap(this.sceneManager, "map");
    this.player = new Player(this.sceneManager, new Point(12 * 400 + 200, 23 * 400 + 200));
    
    this.addChild(this.map);
    this.addChild(this.player);
    this.addChild(this.ghostContainer);
    
    this.loadItems();
    
    this.addChild(this.collisionsGraphics);

    this.initFlashLightMask();
    this.startTimers();

    this.sounds = {
      random: new Howl({src: ["assets/sounds/random.wav"]}),
      door: new Howl({src: ["assets/sounds/door.wav"]}),
      pickup: new Howl({src: ["assets/sounds/pickup.wav"]}),
      error: new Howl({src: ["assets/sounds/error.wav"]}),
    };
  }

  initFlashLightMask(){
    const radius = 500;
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

    this.mask = this.focusSprite;

    this.addChild(this.focusSprite);
  }

  update(dt: number): void {

    if(Input.isKeyJustPressed(Keys.ESC)){
      this.sceneManager.changeScene("title");
    }

    this.player.update(dt);
    let screenWidth = this.sceneManager.app.view.width / SCALE;
    let screenHeight = this.sceneManager.app.view.height / SCALE;

    let cameraX = this.player.x - screenWidth / 2;
    let cameraY = this.player.y - screenHeight / 2;

    this.pivot.set(cameraX, cameraY);

    if(this.focusSprite){
      this.focusSprite.position.x = cameraX + screenWidth / 2;
      this.focusSprite.position.y = cameraY + screenHeight / 2;
      let r = this.focusSpriteScale + Math.random() * 0.05;
      this.focusSprite.scale.set(r, r);
    }

    this.ghosts.forEach((ghost: Ghost)=>{
      ghost.update(dt);
    });

    this.ghostContainer.children.sort((a: DisplayObject, b: DisplayObject) => {
      return a.y - b.y;
    });

    this.drawRectables();
  }

  spawnGhosts(){
    for(let i = 0; i < NUM_GHOSTS; i++){
      let r = MathUtils.randomAngle();
      let x = this.player.x + Math.cos(r) * GHOST_R;
      let y = this.player.y + Math.sin(r) * GHOST_R;
      let ghost = new Ghost(this.sceneManager, new Point(x, y));
      ghost.target = this.player;
      ghost.show();
      this.ghosts.push(ghost);
      this.ghostContainer.addChild(ghost);
    }
  }

  removeGhost(ghost: Ghost){
    this.ghosts.splice(this.ghosts.indexOf(ghost), 1);
    this.ghostContainer.removeChild(ghost);
  }

  startTimers(){
    if(this.mainTimeout) clearTimeout(this.mainTimeout);

    this.mainTimeout = setTimeout(this.onMainTimer.bind(this), EVERY_10_SECONDS);
  }

  onMainTimer(){
    this.startTimers();

    if(this.isGhostTurn){
      this.hideGhosts();
      this.showFlashlight();
    }else{
      this.showGhosts();
      this.hideFlashlight();
    }

    this.isGhostTurn = !this.isGhostTurn;
  }

  showGhosts(){
    this.spawnGhosts();
  }

  hideGhosts(){
    this.ghosts.forEach((ghost: Ghost)=>{
      ghost.collision = null;
      ghost.target = null;
      ghost.hide(()=>{this.removeGhost(ghost);});
    });
  }

  showFlashlight(){
    createjs.Tween.get(this).to({focusSpriteScale: 3}, 1000);
  }

  hideFlashlight(){
    createjs.Tween.get(this).to({focusSpriteScale: 1}, 1000);
  }

  drawRectables(){
    this.collisionsGraphics.clear();

    let colors: any = {
      collision: 0xFF0000,
      collectable: 0x0000FF,
      interact: 0x00FF00
    }

    let rectangles: any = {
      collision: [],
      collectable: [],
      interact: []
    };

    if(this.map) rectangles.collision.push(...this.map.collisions);
    if(this.player) rectangles.collision.push(this.player.collision);

    rectangles.collision.push(...this.ghosts.map((ghost: Ghost)=>ghost.collision).filter((collision)=>collision != null));

    rectangles.collectable.push(...this.items.map((container: any)=>container.collision));
    
    rectangles.interact.push(this.player.interactCollision);

    Object.keys(rectangles).forEach((key: string)=>{
      this.collisionsGraphics.lineStyle(5, colors[key]);
      rectangles[key].forEach((collision: Rectangle)=>{
        this.collisionsGraphics.drawRect(collision.x, collision.y, collision.width, collision.height);
      });
    });
  }


  loadItems(){
    this.items.forEach((item: Item)=>{
      this.addChild(item);
    });
  }

  removeItemSprite(item: Item){
    this.items.splice(this.items.indexOf(item), 1);
    this.removeChild(item);
  }

  addItemToBag(item: string){
    this.bag.push(item);
    console.log(this.bag);
  }

  removeItemFromBag(item: string){
    this.bag.splice(this.bag.indexOf(item), 1);
    console.log(this.bag);
  }

  playSound(id: string){
    this.sounds[id].play();
  }

}