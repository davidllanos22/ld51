import { BLEND_MODES, Container, filters, Graphics } from "pixi.js";

export class Light extends Container{
  
  constructor(private owner: any){
    super();

    let size = 500;

    let graphics = new Graphics();

    graphics.beginFill(0xFFFF00);
    graphics.moveTo(0, 0);
    graphics.lineTo(size, -size / 2);
    graphics.lineTo(size, size / 2);
    graphics.endFill();

    graphics.blendMode = BLEND_MODES.SCREEN;
    graphics.alpha = 0.5;
    // graphics.filters = [new filters.BlurFilter(5)]
    this.addChild(graphics);
  }

  update(dt: number){
  }

}