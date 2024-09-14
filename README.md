![](https://img.shields.io/badge/Foundry-v12-informational) 
![GitHub All Releases](https://img.shields.io/github/downloads/Syrious/foundryvtt-journal-font-scaler/total?label=Downloads+Total)
![GitHub Downloads (all assets, latest release)](https://img.shields.io/github/downloads/Syrious/foundryvtt-journal-font-scaler/latest/total?label=Downloads+Latest)
[![Support me on Patreon](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3DSyriousWorkshop%26type%3Dpatrons&style=flat)](https://patreon.com/SyriousWorkshop)

# FoundryVTT Journal-Scaler
Based on [Journal Scaler](https://github.com/jegasus/journal-scaler), which hasn't been updated since Foundry v9.
I reworked it to make it compatible with v10, v11 and v12.

### What is does
This module enables you to change the font and image sizes inside journal windows 
using `ctrl + mouseWheelUp` and `ctrl + mouseWheelDown`.

In the settings,
you can choose if you want to always scale images or only if you are holding both `ctrl + shift` when scaling.

It doesn't remember
the scaling settings when you close the entry and images and font size do not exactly scale the same.

### Installation and setup
This module requires [ruipin's libWrapper library](https://github.com/ruipin/fvtt-lib-wrapper).

## Acknowledgements
### Original Journal Scaler
This module is based on [Journal Scaler](https://github.com/jegasus/journal-scaler). Thanks for the earlier versions. Hope, you're doing well.

### ruipin's libWrapper
This module uses [ruipin's libWrapper library](https://github.com/ruipin/fvtt-lib-wrapper). Take a look at his stuff if you want to develop modules for FVTT that override its default behaviors.
