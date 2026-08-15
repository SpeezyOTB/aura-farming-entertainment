export class InputManager {
  private keys: Set<string> = new Set();
  private justPressed: Set<string> = new Set();
  private justReleased: Set<string> = new Set();

  constructor() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }
  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.keys.has(e.code)) this.justPressed.add(e.code);
    this.keys.add(e.code);
    if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault();
  };
  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
    this.justReleased.add(e.code);
  };
  isDown(c: string) { return this.keys.has(c); }
  wasPressed(c: string) { return this.justPressed.has(c); }
  wasReleased(c: string) { return this.justReleased.has(c); }
  flush() { this.justPressed.clear(); this.justReleased.clear(); }
  dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }
}
