import {SvgPlus, SvgPath, Vector, CPoint} from './3.5.js'


class LighteningPath extends SvgPath{
  constructor(direction, start){
    super("path");
    if (direction instanceof Vector && start instanceof Vector) {
      this.dir = direction.dir();
      this.start = start;
    }else{
      throw 'LighteningPath constructor requires direction Vector.'
    }

    this.avg_length = 50;
    this.std_length = 30;
    this.length = Math.round(10 + Math.random() * 10);
    this.i = 0;
    this.re();
  }

  onclick(){
    this.re();
  }

  re(){
    this.clear();
    while(this.next());
  }

  next(){
    if (this.i == 0) {
      this.M(new Vector)
    }else{
      let np = this.start.add(this.dir.rotate((Math.random() - 0.5)*Math.PI/2).mul((Math.random() - 0.5)*this.std_length +this.avg_length));
      this.start = np;
      this.L(np);
    }

    this.i++;

    if (this.i > this.length){
      return false
    }

    return true;

  }
}


export {LighteningPath};
