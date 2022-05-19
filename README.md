# PokePatcher
Analogue Pocket Pokemon Game Patcher

I'm really tired of patching Pokemon ROM variants to the .Pocket format. Luckily, they're not too complicated to patch for Pocket, so the process can be automated! *I Hope!*

This javascript program will run locally on your PC. The file you create is local to your PC and will not be sent anywhere over the internet.

It will patch any GB/GBC Pokemon game for use on the Analogue Pocket, including hacked games and randomized games. If there are bugs, or if you have any issues, please report them on the github page for this code.

A copy of this utility that's ready to run [can be found here](http://josejx.net/PokePatcher/).

# FAQ

## Can this be used to patch arbitrary GB/GBC games for Pocket?
No, that's basically impossible due to the halting problem. This is designed specifically for the Pokemon games and hacks based on them. It is only going to work for those games.

## Can you add support for another game?
No, make a request at the [Wishing Well](https://docs.google.com/forms/d/e/1FAIpQLSeqEnkT_ZebRavAPEUZd53PuGJCzYRssvwaGRoY7naucPtRyg/viewform) for other games. Pokemon games are "special" in that people have the full source and are generating code where things have moved around. This makes it hard to target without a tool like this. Most other patches are one and done!

# Known Issues

 * Possible Save Game Corruption due to RTC? - I've tried to fix this, but haven't tested it
 * Lack of RTC setting option makes some games difficult - You can patch yourself before if there's a patch available.
