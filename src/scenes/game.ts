import { Howl } from "howler";
import { Container, Point, Text } from "pixi.js";
import { Ghost } from "../entities/ghost";
import { Player } from "../entities/player";
import { Input, Keys } from "../lib/input";
import { MathUtils } from "../lib/math";
import { Scene } from "../lib/scene";
import { TiledMap } from "../lib/tiled-map";

const NUM_GHOSTS = 5;

export class GameScene extends Scene{
  sound?: Howl;

  player?: Player;
  ghosts: Ghost[] = [];
  ghostContainer: Container = new Container();
  map: TiledMap;

  init(): void {
    let text = new Text('Game Scene', {
      fontFamily : 'Arial',
      fontSize: 24,
      fill : 0xFFFFFF,
    });

    this.scale.set(0.3, 0.3);

    this.addChild(text);
    this.map = new TiledMap(this.sceneManager, "map");
    this.addChild(this.map);

    this.player = new Player(this.sceneManager, new Point(400, 0));
    this.addChild(this.player);


    //this.spawnGhosts();

    this.addChild(this.ghostContainer);

    this.sound = new Howl({
      src: ['assets/sounds/random.wav']
    });
  }

  update(dt: number): void {

    if(Input.isKeyJustPressed(Keys.SPACE)){
      this.sound.play();
    }

    if(Input.isKeyJustPressed(Keys.ESC)){
      this.sceneManager.changeScene("title");
    }

    this.player.update(dt);

    this.ghosts.forEach((ghost: Ghost)=>{
      ghost.update(dt);
    });
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
}