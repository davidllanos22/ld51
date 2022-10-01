import { Container, IPoint, Rectangle, Sprite } from "pixi.js";
import { SceneManager } from "../lib/scene-manager";
import { GameScene } from "../scenes/game";
import * as createjs from 'createjs-module';

export class Item extends Container{
  
  collision: Rectangle;
  properties: any[];

  constructor(private sceneManager: SceneManager, position: IPoint, sprite: Sprite, properties: any[]){
    super();
    this.position = position;
    this.properties = properties;

    this.addChild(sprite);
    this.collision = new Rectangle(position.x + 100, position.y + 100, 200, 200);
  }

  interact(){
    if(!this.properties) return;

    this.processPropertiesWithPrefix("action");
  }

  processPropertiesWithPrefix(prefix: string){
    this.properties.forEach((property: any)=>{
      if(property.name.startsWith(prefix)) this.processAction(property);
    });
  }
  
  processAction(property: any){
    let game = (this.sceneManager.getCurrentScene() as GameScene);

    let name = property.name.replace("action_", "").replace("success_", "").replace("fail_", "");

    if(name == "obtain_item"){
      game.addItemToBag(property.value);
    }else if(name == "remove_item"){
      game.removeItemFromBag(property.value);
    }else if(name == "play_sound"){
      game.playSound(property.value);
    }else if(name == "shake"){
      game.playSound(property.value);
      // createjs.Tween.get(this.getChildAt(0)).to({alpha: 0}, 1000).call(callback);
    }else if(name == "required_item"){
      let hasItem = game.bag.includes(property.value)
      console.log(hasItem);
      if(hasItem){
        this.processPropertiesWithPrefix("success");
      }else{
        this.processPropertiesWithPrefix("fail");
      }
    }else if(name == "destroy"){
      if(property.value == "self"){
        game.removeItemSprite(this);
      }
    }
  }
}