/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from './pinia'
import router from '../router'
import core from './core'
import 'vuetify/styles'
// import 'bt-core-app/styles'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(core, { 
      vuetifyInstance: vuetify.theme,
      vuetifyDisplay: vuetify.display,
      router: router 
    })
}
