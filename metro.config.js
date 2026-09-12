// Metro na raiz do WHC: código, midia/ e sprites-piskel/ no mesmo projeto.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// wav/mp3 já vêm no padrão; ogg não — sem isto o require da boss-music quebra o bundle (500).
if (!config.resolver.assetExts.includes('ogg')) {
  config.resolver.assetExts.push('ogg');
}

module.exports = config;
