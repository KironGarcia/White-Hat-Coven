// Configuração padrão do Babel para Expo — sem plugins extras.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
