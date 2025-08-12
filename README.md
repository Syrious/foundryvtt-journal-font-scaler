![](https://img.shields.io/badge/Foundry-v12-informational)
![GitHub All Releases](https://img.shields.io/github/downloads/Syrious/foundryvtt-journal-font-scaler/total?label=Downloads+Total)
![GitHub Downloads (all assets, latest release)](https://img.shields.io/github/downloads/Syrious/foundryvtt-journal-font-scaler/latest/total?label=Downloads+Latest)
[![Support me on Patreon](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3DSyriousWorkshop%26type%3Dpatrons&style=flat)](https://patreon.com/SyriousWorkshop)

# FoundryVTT Journal-Scaler
Based on [Journal Scaler](https://github.com/jegasus/journal-scaler), which hasn't been updated since Foundry v9.
I reworked it to make it compatible with v10, v11 and v12.

### What is does
This module enables you to change the font and image sizes inside journal windows using `Ctrl + Mouse Wheel Up` and `Ctrl + Mouse Wheel Down`.

In the settings, you can choose whether you want to always scale images or only scale them when you are holding both `Ctrl + Shift`.

Please note that it doesn’t remember the scaling settings when you close the entry, and the images and font sizes do not scale exactly the same way.

### Installation and setup
For FoundryVTT 12 and earlier, this module requires [ruipin's libWrapper library](https://github.com/ruipin/fvtt-lib-wrapper).

## Acknowledgements

### Original Journal Scaler
This module is based on [Journal Scaler](https://github.com/jegasus/journal-scaler). Thanks for the earlier versions. Hope, you're doing well.

## Development
This module uses Vite for development and building. This provides hot module reloading during development and optimized builds for production.

### Setup
1. Clone this repository
2. Install dependencies with `npm install`

### Development
Run the development server with:
```
npm run dev
```
This will start a development server with hot module reloading. Changes to your code will be immediately reflected in Foundry VTT without needing to refresh.

### Building for Production
Build the module for production with:
```
npm run build
```
This will create a `dist` directory containing all the files needed for distribution.
