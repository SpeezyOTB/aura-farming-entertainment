// Gamepad support — PS5 DualSense / Xbox / standard mapping
// Button indices (standard gamepad):
//   0=Cross/A, 1=Circle/B, 2=Square/X, 3=Triangle/Y
//   4=L1, 5=R1, 6=L2, 7=R2
//   8=Share, 9=Options, 10=L3, 11=R3
//   12=DpadUp, 13=DpadDown, 14=DpadLeft, 15=DpadRight
// Axes: 0=LeftX, 1=LeftY, 2=RightX, 3=RightY

export interface GamepadState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  punch: boolean;   // Square/X
  kick: boolean;    // Triangle/Y
  block: boolean;   // L1 or Circle/B
  punchJust: boolean;
  kickJust: boolean;
  upJust: boolean;
  specialJust: boolean;
}

export class GamepadManager {
  private prev: boolean[] = [];

  getState(padIndex: number): GamepadState | null {
    const pads = navigator.getGamepads();
    const pad = pads[padIndex];
    if (!pad) return null;

    const btn = (i: number) => pad.buttons[i]?.pressed ?? false;
    const axis = pad.axes;
    const deadzone = 0.3;

    const left  = btn(14) || (axis[0] ?? 0) < -deadzone;
    const right = btn(15) || (axis[0] ?? 0) > deadzone;
    const up    = btn(12) || (axis[1] ?? 0) < -deadzone;
    const down  = btn(13) || (axis[1] ?? 0) > deadzone;
    const punch = btn(2);  // Square
    const kick  = btn(3);  // Triangle
    const block = btn(4) || btn(1); // L1 or Circle

    const special = btn(5); // R1
    const prevPunch   = this.prev[padIndex * 10 + 0] ?? false;
    const prevKick    = this.prev[padIndex * 10 + 1] ?? false;
    const prevUp      = this.prev[padIndex * 10 + 2] ?? false;
    const prevSpecial = this.prev[padIndex * 10 + 3] ?? false;
    this.prev[padIndex * 10 + 0] = punch;
    this.prev[padIndex * 10 + 1] = kick;
    this.prev[padIndex * 10 + 2] = up;
    this.prev[padIndex * 10 + 3] = special;
    return {
      left, right, up, down, punch, kick, block,
      punchJust:   punch   && !prevPunch,
      kickJust:    kick    && !prevKick,
      upJust:      up      && !prevUp,
      specialJust: special && !prevSpecial,
    };
  }
}
