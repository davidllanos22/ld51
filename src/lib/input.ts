import { IPoint, Point } from "pixi.js";

export enum Keys {
  W = "KeyW",
  A = "KeyA",
  S = "KeyS",
  D = "KeyD",
  SPACE = "Space",
  ENTER = "Enter",
  ESC = "Escape",
  UP = "ArrowUp",
  DOWN = "ArrowDown",
  LEFT = "ArrowLeft",
  RIGHT = "ArrowRight",
}

export class Input{
  private static keysPressed: Map<string, boolean> = new Map();
  private static keysJustPressed: Map<string, boolean> = new Map();
  private static keysJustReleased: Map<string, boolean> = new Map();

  private static mouse: IPoint = new Point(0, 0);
  private static mouseWorld: IPoint = new Point(0, 0);

  static init(){
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));
  }

  static isKeyPressed(code: string){
    return this.keysPressed.has(code);
  }
  
  static isKeyJustPressed(code: string){
    let result = this.keysJustPressed.has(code);
    this.keysJustPressed.delete(code);
    return result;
  }

  static isKeyReleased(code: string){
    return !this.keysPressed.has(code);
  }

  static isKeyJustReleased(code: string){
    let result = this.keysJustReleased.has(code);
    this.keysJustReleased.delete(code);
    return result;
  }

  static setMouse(x: number, y: number){
    this.mouse = new Point(x, y);
  }

  static setMouseWorld(x: number, y: number){
    this.mouseWorld = new Point(x, y);
  }

  static getMouse(){
    return this.mouse;
  }

  static getMouseWorld(){
    return this.mouseWorld;
  }

  private static keyDown(event: any){
    let code = event.code;
    if(!this.keysPressed.has(code)) this.keysJustPressed.set(code, true);
    this.keysPressed.set(code, true);
  }

  // TODO: any key pressed

  private static keyUp(event: any){
    let code = event.code;
    this.keysJustReleased.set(code, true);
    this.keysPressed.delete(code);
    this.keysJustPressed.delete(code);
  }
}