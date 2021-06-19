import {SvgPlus, SvgPath, Vector, CPoint} from './3.5.js'

class LighteningPath extends SvgPath{
  constructor(direction, start, depth = 6){
    super("path");


    if (direction instanceof Vector && start instanceof Vector) {
      this.dir = direction.dir();
      this.ogstart = start;
      this.start = start;
    }else{
      throw 'LighteningPath constructor requires direction Vector.'
    }

    this.depth = depth;

    this.avg_length = 2;
    this.std_length = 1;

    this.std_dir = Math.PI/2;


    this.avg_split = Math.PI/6;
    this.std_split = Math.PI/10;


    this.length = Math.round(10 + Math.random() * 10);
    this.i = 0;

    // this.re();
  }


  re(){
    this.i = 0;
    this.r = this.depth;
    this.start = this.ogstart;
    this.getViewBox();
    this.d.clear();
    while(this.next());
  }

  getViewBox(){
    let viewBox = this.ownerSVGElement.getAttribute('viewBox').split(' ');
    this.v0 = new Vector(viewBox);
    this.size = new Vector(viewBox, 2);
    this.vs = this.v0.add(this.size);
  }

  next(){
    if (this.i == 0) {
      this.M(new Vector(this.ogstart))
    }else{
      let np = this.start.add(this.dir.rotate((Math.random() - 0.5)*this.std_dir).mul((Math.random() - 0.5)*this.std_length +this.avg_length));
      if (this.canmove instanceof Function) {
        if (!this.canmove(np)) {
          this.styles = {stroke: 'purple'}
          return false;
        }
      }
      if (np.x < this.v0.x || np.x > this.vs.x || np.y < this.v0.y || np.y > this.vs.y) {
        // this.styles = {stroke: 'red'}
        return false;
      }
      this.start = np;
      this.L(np);
    }

    this.i++;
    if (this.i > this.length){
      if (this.depth - 1 < 0) {
        // this.styles = {stroke: 'green'}
        return false;
      }
      let dirA = this.dir.rotate(this.avg_split + (Math.random() - 0.5) * this.std_split);
      let dirB = this.dir.rotate((Math.random() - 0.5) * this.std_split - this.avg_split);
      if (dirA.y > 0) {
        let a = new LighteningPath(dirA, this.start.clone(), this.depth - 1)
        this.parentNode.appendChild(a);
        a.re();
      }
      if (dirB.y > 0) {
        let b = new LighteningPath(dirB, this.start.clone(), this.depth - 1)
        this.parentNode.appendChild(b);
        b.re();
      }
      return false
    }

    return true;

  }
}


export {LighteningPath};
