# Dragon Fist X: Health and Energy Logic

Normal combat damage and energy are now independent. A successful standard punch, kick, sweep, throw squeeze, or ground slam lowers **health** but never resets the defender’s stored energy.

## Normal Damage

```ts
// Fighter.receiveHit()
this.health = Math.max(0, this.health - dmg);
this.hitFlash = 0.1;

// A hit breaks only the current combo streak.
// It deliberately does not modify this.energy.
this.consecutiveHits = 0;
```

The same removal was made in the direct sweep, Shuraku squeeze, and Galva ground-slam damage branches, which previously contained `defender.energy = 0` or equivalent resets.

## Meter Gain

```ts
// Fighter.onAttackLanded()
this.consecutiveHits = Math.min(10, this.consecutiveHits + 1);
this.energy = Math.min(MAX_ENERGY, this.energy + ENERGY_PER_LANDED_HIT);

if (this.energy >= MAX_ENERGY) {
  this.activateBoost();
}
```

Meter now grows additively by **5 points per successful hit** and is retained after the fighter takes damage. A full meter activates the existing boost state, which spends the full meter and displays the boost timer in the energy bar.

## Special Costs

```ts
export const LIGHT_SPECIAL_COST = 10;
export const HEAVY_SPECIAL_COST = 15;
export const FINISHER_SPECIAL_COST = 20;
```

```ts
// Fighter.spendSpecialEnergy(cost)
if (this.energy < cost) return false;
this.energy -= cost;
return true;
```

The method is called only after each ability passes its normal availability checks. The current categories are listed below.

| Ability | Cost |
|---|---:|
| Galva teleport, Kai Tempest Guard, Galva lightning blast | 10 |
| Shuraku grapple, Kai Tornado, Shadow Barrier | 15 |
| Galva ground slam finisher | 20 |

During a finite active boost, special moves consume the equivalent share of the remaining boost duration rather than a second energy bar. Galva’s infinite full-power boost retains its established identity and uses cooldown checks for its finisher.
