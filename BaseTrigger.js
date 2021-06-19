// import { AudioContext, OfflineAudioContext } from 'https://jspm.dev/standardized-audio-context';


class BaseTrigger{

  constructor(threshold, smoothing, samples){
    this.threshold = threshold;
    this.smoothing = smoothing;
    this.smpls = samples;
    this.bass_max = 150;
    this.bass_min = 100;
  }

  getBass(){
    let n = this.bass_analyser.fftSize;
    var buffer = new Float32Array(n);
    this.bass_analyser.getFloatTimeDomainData(buffer);

    let std = 0;
    for (var i = 0; i < n; i++){
      std += (buffer[i] * buffer[i])
    }
    std = Math.sqrt(std)/n;
    std *= 4000

    this.ema = std*(this.smoothing/(1 + this.smpls)) + this.ema * (1 - this.smoothing/(1 + this.smpls))


  }

  async playMP3File(name){
    var audio = new Audio(name);
    this.handleStream(audio);
    audio.play();
    await this.ctx.resume();
    return audio;
  }

  async handleStream(stream){
    // alert("handle stream")
    try{

      this.ctx = new AudioContext();
      this.src = this.ctx.createMediaElementSource(stream);

      this.bass_freq = this.ctx.createBiquadFilter()
      this.bass_freq.type = 'bandpass';

      let freq_center = (this.bass_min + this.bass_max)/2;
      this.bass_freq.frequency.value = freq_center;
      this.bass_freq.Q.value = freq_center/(this.bass_max - this.bass_min);

      // alert(this.ctx.audioWorklet)
      await this.ctx.audioWorklet.addModule('base-trigger-processor.js')
      this.base_trigger = new AudioWorkletNode(this.ctx, 'base-trigger-processor')


      // this.src.connect(this.bass_freq);
      // this.bass_freq.connect(this.ctx.destination);


      // this.bass_freq.connect(this.bass_trigger);

      // this.src.connect(gainNode);
      // this.base_trigger.connect(this.base_trigger);
      this.src.connect(this.base_trigger);
      this.src.connect(this.ctx.destination);
      this.base_trigger.port.onmessage = (e) => {
        if (this.onbass instanceof Function) {
          this.onbass(e);
        }
      }
    }catch(e) {
      alert(e);

    }

    return this.ctx;
  }
}

export {BaseTrigger}
