/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
// import { VueSignalR } from '@dreamonkey/vue-signalr'
// import { HubConnectionBuilder } from '@microsoft/signalr'
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// const connection = new HubConnectionBuilder()
//     // .withUrl('https://daynightcountdown.azurewebsites.net/gamehub')
//     .withUrl('https://localhost:44355/gamehub')
//     .build();
// /* eslint-disable no-alert no-console */

const app = createApp(App) //.use(VueSignalR, { connection })

/* eslint-enable no-alert */

registerPlugins(app)

app.mount('#app')
