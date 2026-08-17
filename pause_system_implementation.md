# Dragon Fist X Pause System

The pause system is implemented across `client/src/game/GameEngine.ts` and `client/src/components/FighterGame.tsx`. It freezes the simulation without treating a paused match as a completed match.

## Engine Pause State

```ts
// GameEngine.ts
private paused = false;

togglePause() {
  if (!this.countdownDone || !this.gameState.running || this.roundEnded) return this.paused;
  this.paused = !this.paused;
  this.input.flush();
  return this.paused;
}

private loop = (now: number) => {
  if (this.paused) {
    this.lastTime = now;
    this.rafId = requestAnimationFrame(this.loop);
    return;
  }
  const dt = Math.min((now - this.lastTime) / 1000, 0.05);
  this.lastTime = now;
  this.update(dt);
  // Render normal countdown or match state.
};
```

> Because the game loop does not call `update()` while paused, the timer, AI, fighters, collision checks, projectiles, combo timers, active effects, and input-driven attacks stay frozen.

## Keyboard Configuration

```ts
// FighterGame.tsx
useEffect(() => {
  if (screen !== 'fight') return;
  const onKeyDown = (event: KeyboardEvent) => {
    // P remains Player 2's special move in local player-versus-player mode.
    const canUsePForPause = currentMode !== 'pvp';
    if (event.repeat || (event.code !== 'Escape' && !(event.code === 'KeyP' && canUsePForPause))) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    togglePause();
  };
  window.addEventListener('keydown', onKeyDown, { capture: true });
  return () => window.removeEventListener('keydown', onKeyDown, { capture: true });
}, [screen, currentMode, togglePause]);
```

| Mode | Pause keys |
|---|---|
| Player vs CPU | `Esc` or `P` |
| Spectator / CPU vs CPU | `Esc` or `P` |
| Player vs Player | `Esc` only, because `P` remains Player 2's special move |

## Mobile Pause Button and Menu

The game now renders a persistent round pause button in the upper-right of every active match, including spectator mode. It uses the same `togglePause()` callback as the keyboard listener.

```tsx
<button
  type="button"
  aria-label={isPaused ? 'Resume game' : 'Pause game'}
  onClick={togglePause}
>
  {isPaused ? '▶' : 'Ⅱ'}
</button>
```

When paused, the menu provides **Resume**, **Restart**, **Select**, and **Controls**. Touch-game action buttons ignore presses while the `paused` property is true, ensuring they cannot alter a frozen match.
