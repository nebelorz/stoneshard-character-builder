import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorDiscordLogo,
  phosphorGithubLogo,
  phosphorInfo,
  phosphorHeart,
} from '@ng-icons/phosphor-icons/regular';
import { TooltipDirective } from '@shared/directives/tooltip/tooltip';

const VERSION = 'v0.0.1b';
const DISCORD_URL = 'https://discord.com/users/neBelorz%238759';
const GITHUB_URL = 'https://github.com/nebelorz/stoneshard-character-builder';
const STONESHARD_DATA_VERSION = 'Data extracted from Stoneshard v0.9.4.25';
const NSTRATOS_THANKS_TO = 'Thanks to @nstratos for his previous work <3';
const NSTRATOS_URL = 'https://github.com/nstratos/stoneshard-talent-calculator';

@Component({
  selector: 'app-footer',
  imports: [NgIcon, TooltipDirective],
  providers: [
    provideIcons({
      phosphorDiscordLogo,
      phosphorGithubLogo,
      phosphorInfo,
      phosphorHeart,
    }),
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  readonly version = VERSION;
  readonly discordUrl = DISCORD_URL;
  readonly githubUrl = GITHUB_URL;
  readonly stoneshardDataVersion = STONESHARD_DATA_VERSION;
  readonly nstratosThanksTo = NSTRATOS_THANKS_TO;
  readonly nstratosUrl = NSTRATOS_URL;
}
