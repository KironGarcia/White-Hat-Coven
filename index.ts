import React from 'react';
import { registerRootComponent } from 'expo';

import App from './App';

/** Demo standalone. Metro só no Dev Client — nunca Expo Go (plugins nativos da APK). */
function RaizStandalone() {
  return React.createElement(App, null);
}

registerRootComponent(RaizStandalone);
