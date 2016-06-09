import PIXI from 'pixi.js';
import bunnyImage from './assets/bunny.png';

export default class Bunny extends PIXI.Sprite{
  constructor(){
    super(PIXI.Texture.fromImage(bunnyImage));
    this.anchor.set(0.5);
  }

  update(delta){
    this.rotation += 5*delta;
  }
}
