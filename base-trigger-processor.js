class BassTriggerProcessor extends AudioWorkletProcessor {
  //
  // static get parameterDescriptors () {
  //   return [{
  //     name: 'customGain',
  //     defaultValue: 1,
  //     minValue: 0,
  //     maxValue: 1,
  //   }]
  // }
  // set params(params){
  //   try{
  //     this.threshold = params.threshold;
  //     this.smpls = params.samples;
  //     this.smoothing = params.smoothing;
  //     console.log(this);
  //   } catch(e) {
  //     console.log(e);
  //   }
  // }
  process (inputs, outputs, parameters) {
    if (!this.init) {
      this.init = true;
    }

    this.smoothing = 1;
    this.smpls = 10;
    this.ema = 0;
    this.threshold = 175;
    if (inputs.length == 0) return;

    let input = inputs[0][0];
    let n = input.length;

    let std = 0;
    for (let val of input){
      std += val*val;
    }
    std = n > 0 ? Math.sqrt(std)/n : 0;
    std *= 4000



    this.ema = std*(this.smoothing/(1 + this.smpls)) + this.ema * (1 - this.smoothing/(1 + this.smpls))
    let delta = std - this.ema;
    if (delta > this.threshold){
      // console.log(`std: ${this.ema}, n: ${delta}`);
      this.port.postMessage({
        std: std,
        delta: delta,
      })
    }
    return true
  }
}

console.log(sampleRate);

registerProcessor('base-trigger-processor', BassTriggerProcessor)
