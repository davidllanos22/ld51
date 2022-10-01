import { TilingSprite } from "pixi.js";

export type TiledAnimation = {
  frames: TiledAnimationFrame[],
  timePerFrame: number,
  loop: boolean
}

export type TiledAnimationFrame = {
  x: number,
  y: number,
  time?: number
}

export class TiledAnimationSprite extends TilingSprite{
  animations: Map<string, TiledAnimation> = new Map();
  startTime?: number;
  animationName?: string;
  currentFrame: number = 0;

  constructor(texture: PIXI.Texture, width: number, height: number, animations: Map<string, TiledAnimation>){
    super(texture, width, height);
    this.animations = animations;
  }

  update(): void{
    if(this.animationName == null){};

    if(!this.startTime) this.startTime = Date.now();

    let now = Date.now();

    let animation = this.getAnimation(this.animationName);

    let diff = now - this.startTime;
    let frame = this.getAnimationFrame(animation, this.currentFrame);
    let frameTime = frame.time || animation.timePerFrame;

    if(diff > frameTime){
      this.currentFrame = this.getNextFrameIndex(this.currentFrame, animation);
      this.startTime = now;
    }

    this.tilePosition.x = this.width * frame.x;
    this.tilePosition.y = this.height * frame.y;
  }

  getAnimation(animationName: string): TiledAnimation | undefined{
    if(animationName == null) return;
    return this.animations.get(animationName);
  }
  
  getAnimationFrame(animation: TiledAnimation, frame: number){
    return animation.frames[frame];
  }

  getNextFrameIndex(currentFrame: number, animation: TiledAnimation){
    if(animation == null) return null;

    let loop = animation.loop;
    let totalFrames = animation.frames.length;
    let lastFrame = currentFrame == totalFrames - 1;
    
    if(lastFrame && loop) return 0;
    if(currentFrame < totalFrames - 1) return currentFrame + 1;
    return currentFrame;
  }

  setAnimation(animation: string): void {
    this.animationName = animation;
    this.currentFrame = 0;
  }
}