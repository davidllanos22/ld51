import { Text } from "pixi.js";
import { Input, Keys } from "../lib/input";
import { Scene } from "../lib/scene";

export class TitleScene extends Scene{

  init(): void {
    let text = new Text('Title Scene', {
      fontFamily : 'Arial',
      fontSize: 24,
      fill : 0xFFFFFF,
    });

    this.addChild(text);
  }

  update(dt: number): void {
    if(Input.isKeyJustPressed(Keys.SPACE)){
      this.sceneManager?.changeScene("game");
    }
  }
}