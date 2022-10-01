import { Container, Point, Rectangle, RenderTexture, Sprite, Texture, TilingSprite } from "pixi.js";
import { Item } from "../entities/item";
import { GameScene } from "../scenes/game";
import { SceneManager } from "./scene-manager";

export class TiledMap extends Container{
  sprite: Sprite;
  collisions: Rectangle[] = [];
  tilesTexture: Texture;

  constructor(private sceneManager: SceneManager, map: string){
    super();
    this.tilesTexture = this.sceneManager.app.loader.resources["tiles"].texture

    this.loadMap(map);
  }

  loadMap(map: string){
    let mapJSON: any = this.sceneManager.app.loader.resources[map].data;
    console.log(mapJSON);

    let mapWidth = mapJSON.width;
    let mapHeight = mapJSON.height;
    let tileWidth = mapJSON.tilewidth;
    let tileHeight = mapJSON.tileheight;

    let renderTexture = RenderTexture.create({ width: tileWidth * mapWidth, height: tileHeight * mapHeight });
    let container = new Container();

    mapJSON.layers.forEach((layer: any)=>{

      if(layer.name == "items"){
        let objects = layer.objects;

        objects.forEach((object: any)=>{
          let sprite = this.getSprite(object.gid);

          let position = new Point(object.x, object.y - 400);

          console.log({id:object.id, sprite, position});

          (this.sceneManager.getCurrentScene() as GameScene).items.push(new Item(this.sceneManager, position, sprite, object.properties));
        });
      }else{
        let data = layer.data;
        data.forEach((tile: number, index: number)=>{
          
          if(tile != 0){
            let position = this.getPositionFromIndex(index, mapWidth);
  
            if(layer.name == "collisions"){
              let rectangle = new Rectangle(position.x, position.y, tileWidth, tileHeight);
              this.collisions.push(rectangle);
            }else{
              let sprite = this.getSprite(tile);
    
              sprite.position.x = position.x;
              sprite.position.y = position.y;
              
              container.addChild(sprite);
            }
          }
        });
      }
    });

    this.sceneManager.app.renderer.render(container, renderTexture);
    this.addChild(new Sprite(renderTexture))
  }

  getSpriteXYFromId(id: number){
    let tileWidth = 400;
    let tileHeight = 400;
    let numTilesX = 10;
    let numTilesY = 10;
    
    return {
      x: ((id - 1) % numTilesX) * tileWidth,
      y: Math.floor((id - 1) / numTilesX) * tileHeight
    }
  }

  getPositionFromIndex(index: number, mapWidth: number){
    let tileWidth = 400;
    let tileHeight = 400;

    return {
      x: (index % mapWidth) * tileWidth,
      y: Math.floor(index / mapWidth) * tileHeight
    }
  }

  getSprite(id: number){
    let xy = this.getSpriteXYFromId(id);

    let sprite = new TilingSprite(this.tilesTexture, 400, 400);
    
    sprite.tilePosition.x = -xy.x;
    sprite.tilePosition.y = -xy.y;

    return sprite;
  }


}