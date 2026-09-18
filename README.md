# StoneShard Character Builder

A build planner for [StoneShard](https://store.steampowered.com/app/625960/STONESHARD/). Plan stat allocations, map out ability trees, and share your builds with others.

![Stoneshard-Main-Page](src\assets\readme-screenshots\image.png)

---

## Features

- **8 characters** with their unique traits, starting stats and unnlocked treatises
- **Level 1-30 planner** with full stat and ability point tracking
- **All ability trees** Weaponry, Utility, and Sorcery
- **Pin trees** side by side and create your build
- **Share builds** via compressed URL
- **AI prompt export** to discuss builds with any AI agent
- **Level-by-level route** showing exactly when each choice for ability and stat was made

---

## How to Use

### 1. Choose Your Character

Pick any character in the left panel. Each one has its unique trait, stats and unlocked treatises.

![Character-Selector](src\assets\readme-screenshots\image-1.png)  
![Unlocked-Treatises](src\assets\readme-screenshots\image-2.png)

### 2. Set Your Level

Use the level controls to set your build level. You can go up or down by 1 or 5 at a time.

Spend stat points across STR, AGI, PER, VIT, and WIL. The counters show how many Ability Points (AP) and Stat Points (SP) you have left.  

![Character-Stats](src\assets\readme-screenshots\image-3.png)

### 3. Pick Your Trees

Browse trees in the main area by category (Weaponry, Utility, Sorcery). Click a tree to pin it to your build.

![Tree-Selector](src\assets\readme-screenshots\image-4.png)

### 4. Obtain Abilities

**Click ability** icons to unlock them.  
**Right-click to refund**.  

Each ability displays its requirements, energy cost, cooldown, and what stats it scales with.

![Ability-Tooltip](src\assets\readme-screenshots\image-5.png)

### 5. Follow Your Route

The right panel shows a level-by-level breakdown of your build, so you know exactly when to assign each stat and ability as you level up in-game.

![Route-Display](src\assets\readme-screenshots\image-6.png)

### 6. Share Your Build

Click the share button to copy a URL that encodes your entire build.  
Send it to anyone.  

There's also an option to ask your preferred AI agent how the build works, strengths/weaknesses and overall insights of the build via a prompt.

![Share-Build](src\assets\readme-screenshots\image-7.png)
![AI-Prompt](src\assets\readme-screenshots\image-8.png)
---

## For Developers

Built with Angular 22, TypeScript, and SCSS. Uses signals for state management and CDK Overlay for UI layers.

```
src/app/
  models/              # Domain types and data guards
  features/
    ability-trees/     # Tree rendering, ability icons, pin management
    build/             # Build state, URL sharing, AI prompt, route display
    character/         # Character selection, level/stat controls
  layout/              # Left and right sidenav, footer
  shared/              # Services, directives, animations, styles, UI components
```

### Commands

```bash
npm start          # Dev server at localhost:4200
npm run build      # Production build
npm test           # Run unit tests (Vitest)
npm run lint       # ESLint
npm run format     # Prettier
```

### Architecture

State is managed through a signal-based store pattern (`BuildStore` coordinates `LevelStore`, `StatStore`, `AbilityStore`) with no external state library. Data loads reactively via `httpResource`. URL sharing serializes build state as gzip-compressed base64url.

---

## Acknowledgements

Thanks to the Stoneshard community for the feedback, and shared knowledge.  
Thanks to [@nstratos](https://github.com/nstratos/stoneshard-talent-calculator) for his previous work on the Stoneshard Talent Calculator, inspiration and assets <3.
