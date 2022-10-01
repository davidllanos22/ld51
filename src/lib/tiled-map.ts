import { Container, Rectangle, RenderTexture, Sprite, TilingSprite } from "pixi.js";
import { SceneManager } from "./scene-manager";

export class TiledMap extends Container{
  sprite: Sprite;
  collisions: Rectangle[] = [];

  constructor(private sceneManager: SceneManager, map: string){
    super();

    let renderTexture = this.getRenderTextureFromMap(map);
    this.addChild(new Sprite(renderTexture))
  }

  getRenderTextureFromMap(map: string): RenderTexture{
    let mapJSON: any = this.sceneManager.app.loader.resources[map].data;
    console.log(mapJSON);

    let mapWidth = mapJSON.width;
    let mapHeight = mapJSON.height;
    let tileWidth = mapJSON.tilewidth;
    let tileHeight = mapJSON.tileheight;
    let numTilesX = 10;
    let numTilesY = 10;

    let renderTexture = RenderTexture.create({ width: tileWidth * mapWidth, height: tileHeight * mapHeight });
    let tilesTexture = this.sceneManager.app.loader.resources["tiles"].texture
    let container = new Container();

    mapJSON.layers.forEach((layer: any)=>{
      let data = layer.data;
      data.forEach((tile: number, index: number)=>{
        
        if(tile != 0){
          let tileX = (index % mapWidth) * tileWidth;
          let tileY = Math.floor(index / mapWidth) * tileHeight;
          let spriteX = ((tile - 1) % numTilesX) * tileWidth;
          let spriteY =  Math.floor((tile - 1) / numTilesX) * tileHeight;

          if(layer.name == "collisions"){
            let rectangle = new Rectangle(tileX, tileY, tileWidth, tileHeight);
            this.collisions.push(rectangle);
          }else{
            let tilesSprite = new TilingSprite(tilesTexture, tileWidth, tileHeight);
  
            tilesSprite.position.x = tileX;
            tilesSprite.position.y = tileY;
            
            tilesSprite.tilePosition.x = -spriteX;
            tilesSprite.tilePosition.y = -spriteY;
            
            container.addChild(tilesSprite);
          }
        }
      });
    });

    this.sceneManager.app.renderer.render(container, renderTexture);
    return renderTexture;
  }


}