// Simple Audio Synthesizer for SE and Ambient BGM

class AudioSystem {
  private ctx: AudioContext | null = null;
  private bgmOsc1: OscillatorNode | null = null;
  private bgmOsc2: OscillatorNode | null = null;
  private bgmGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isPlayingBgm: boolean = false;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  toggleMute(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBGM();
    } else {
      this.init();
      this.playBGM();
    }
  }

  playPop() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playMessage() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playPhoneRing() {
    if (this.isMuted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.setValueAtTime(450, this.ctx.currentTime + 0.05);
    // basic ringing pattern
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.setValueAtTime(0, this.ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  private playBGM() {
    if (this.isPlayingBgm || !this.ctx) return;
    this.isPlayingBgm = true;

    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    this.bgmGain.connect(this.ctx.destination);

    this.bgmOsc1 = this.ctx.createOscillator();
    this.bgmOsc1.type = 'sine';
    this.bgmOsc1.frequency.setValueAtTime(220, this.ctx.currentTime); // A3
    this.bgmOsc1.connect(this.bgmGain);
    this.bgmOsc1.start();

    this.bgmOsc2 = this.ctx.createOscillator();
    this.bgmOsc2.type = 'sine';
    this.bgmOsc2.frequency.setValueAtTime(277.18, this.ctx.currentTime); // C#4
    this.bgmOsc2.connect(this.bgmGain);
    this.bgmOsc2.start();
  }

  private stopBGM() {
    if (!this.isPlayingBgm) return;
    this.isPlayingBgm = false;
    if (this.bgmOsc1) this.bgmOsc1.stop();
    if (this.bgmOsc2) this.bgmOsc2.stop();
    if (this.bgmGain) this.bgmGain.disconnect();
  }
}

export const audio = new AudioSystem();
