import { Howl } from "howler";
import { Text } from "pixi.js";
import { Input, Keys } from "../lib/input";
import { Vector2 } from "../lib/math";
import { Scene } from "../lib/scene";
import { TiledAnimation, TiledAnimationSprite } from "../lib/tiled-animation-sprite";

export class GameScene extends Scene{
  tiledAnimationSprite?: TiledAnimationSprite;
  sound?: Howl;

  playerPosition: Vector2 = new Vector2(0, 0);

  init(): void {
    let text = new Text('Game Scene', {
      fontFamily : 'Arial',
      fontSize: 24,
      fill : 0xFFFFFF,
    });

    this.addChild(text);

    let animations = new Map<string, TiledAnimation>();

    animations.set("walk", {
      frames: [{x: 0, y: 0}, {x: 1, y: 0}],
      timePerFrame: 100,
      loop: true
    })

    this.tiledAnimationSprite = new TiledAnimationSprite(this.sceneManager.app.loader.resources['assets/images/player.png'].texture, 400, 400, animations);
    this.tiledAnimationSprite.setAnimation("walk");
    this.tiledAnimationSprite.scale.set(0.5, 0.5);

    this.addChild(this.tiledAnimationSprite)

    this.sound = new Howl({
      src: ['assets/sounds/random.wav']
    });
  }

  update(dt: number): void {
    this.tiledAnimationSprite.update();

    if(Input.isKeyJustPressed(Keys.SPACE)){
      this.sound.play();
    }

    if(Input.isKeyJustPressed(Keys.ESC)){
      this.sceneManager?.changeScene("title");
    }

    let speed = 5;

    if(Input.isKeyPressed(Keys.UP)){
      this.playerPosition.y -= speed;
    }

    if(Input.isKeyPressed(Keys.DOWN)){
      this.playerPosition.y += speed;
    }

    if(Input.isKeyPressed(Keys.LEFT)){
      this.playerPosition.x -= speed;
    }

    if(Input.isKeyPressed(Keys.RIGHT)){
      this.playerPosition.x += speed;
    }

    if(this.tiledAnimationSprite) this.tiledAnimationSprite.position.set(this.playerPosition.x, this.playerPosition.y);
  }
}