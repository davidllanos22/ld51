import { Container, IPoint, Rectangle, Sprite } from "pixi.js";
import { SceneManager } from "../lib/scene-manager";
import { GameScene } from "../scenes/game";
import * as createjs from 'createjs-module';

export class Item extends Container{
  
  collision: Rectangle;
  properties: any[];

  name: string;

  constructor(private sceneManager: SceneManager, position: IPoint, sprite: Sprite, properties: any[], name: string){
    super();
    this.position = position;
    this.properties = properties;
    this.name = name;

    this.setConfigFromProperties();

    this.addChild(sprite);
    this.collision = new Rectangle(position.x + 100, position.y + 100, 200, 200);
  }

  interact(){
    if(!this.properties) return;
    this.processPropertiesWithPrefix("action");
  }

  processPropertiesWithPrefix(prefix: string){
    this.getPropertiesWithPrefix(prefix).forEach((property: any)=>{
      this.processAction(property);
    });
  }

  getPropertiesWithPrefix(prefix: string){
    return this.properties.filter((property: any)=>property.name.startsWith(prefix));
  }

  setConfigFromProperties(){
    if(!this.properties) return;
    let game = (this.sceneManager.getCurrentScene() as GameScene);
    
    this.getPropertiesWithPrefix("config").forEach((property: any)=>{
      let name = this.getRealPropertyName(property.name);
      if(name == "solid"){
        //TODO: añadir colision
      }
    });
  }
  
  processAction(property: any){
    let game = (this.sceneManager.getCurrentScene() as GameScene);
    let name = this.getRealPropertyName(property.name);

    if(name == "obtain_item"){
      game.addItemToBag(property.value);
    }else if(name == "remove_item"){
      game.removeItemFromBag(property.value);
    }else if(name == "play_sound"){
      game.playSound(property.value);
    }else if(name == "shake"){
      createjs.Tween.get(this.getChildAt(0))
      .to({x: 5}, 100)
      .to({x: -5}, 100)
      .to({x: 5}, 100)
      .to({x: -5}, 100)
      .to({x: 0}, 100)

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

  getRealPropertyName(name: string){
    return name.replace("action_", "").replace("success_", "").replace("fail_", "").replace("config_", "");
  }
}