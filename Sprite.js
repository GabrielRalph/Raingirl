import {SvgPlus, SvgPath, Vector, CPoint} from './3.5.js'

class Sprite extends SvgPlus{
  constructor(el) {
    super(el);


    if (!(this instanceof SVGGElement)) {
      throw 'Sprite must be svg group element';
    }

    this.updateOnSet = false;
  }

  get center(){
    if (!(this._center instanceof Vector)) {
      let bbox = this.getBBox();
      let pos = new Vector(bbox);
      this._center = pos.add(this.size.div(2));
    }
    return this._center;
  }

  get size(){
    if (!(this._size instanceof Vector)) {
      let bbox = this.getBBox();
      this._size = new Vector(bbox.width, bbox.height);
    }
    return this._size;
  }

  set dir(dir) {
    if (typeof dir === 'string') {
      dir = parseFloat(dir);
    }
    if (!Number.isNaN(dir) && typeof dir === 'number') {
      this._dir = dir;
      this.update();
    }
  }
  get dir(){
    if (typeof this._dir !== 'number') {
      this._dir = 0;
    }
    return this._dir;
  }

  set pos(pos){
    if (pos instanceof Vector) {
      this._pos = pos;
      this.update();
    }else{
      throw 'Sprite position (pos) should be set to a Vector';
    }
  }
  get pos(){
    if (!(this._pos instanceof Vector)) {
      this._pos = new Vector;
    }
    return this._pos
  }

  set scale(scale){
    if (typeof scale === 'string') {
      scale = parseFloat(scale);
    }
    if (!Number.isNaN(scale) && typeof scale === 'number' && scale !== 0) {
      this._scale = scale;
      this.update();
    }
  }
  get scale(){
    if (typeof this._scale !== 'number') {
      this._scale = 1;
    }
    return this._scale;
  }

  update(){
    if (this.updateOnSet) {
      this.draw();
    }
  }

  draw(){
    let d = this.dir;
    let s = this.scale;
    let z = new Vector;

    let r_t = (v) => {return v.rotate(-d)}
    let s_t = (v) => {return v.div(s)}

    let t0 = r_t(this.center.sub(this.center.rotate(d)));
    t0 = t0.add(r_t(this.center.div(s).sub(this.center)));
    t0 = t0.add( r_t(s_t(this.pos.sub(this.center))) );

    this.props = {
      transform: `scale(${s}) rotate(${d*180/Math.PI}) translate(${t0.x} ${t0.y})`
    }
  }
}

export {Sprite}
