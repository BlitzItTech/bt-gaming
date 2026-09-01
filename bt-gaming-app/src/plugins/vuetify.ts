/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

import {
  mdiAccountGroup,
  mdiArrowLeft,
  mdiHome,
  mdiScoreboard,
  mdiShare,
  mdiStore,
  mdiTicket,
  mdiTrophy,
  mdiVolumeHigh,
  mdiVolumeMute,
  mdiWeatherNight,
  mdiWeatherSunny
} from '@mdi/js'

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { useIcons } from 'bt-core-app/composables'
import { createVuetify } from 'bt-core-app/core'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: useIcons({
    'account-group': mdiAccountGroup,
    'arrow-left': mdiArrowLeft,
    home: mdiHome,
    store: mdiStore,
    scoreboard: mdiScoreboard,
    share: mdiShare,
    ticket: mdiTicket,
    trophy: mdiTrophy,
    'volume-high': mdiVolumeHigh,
    'volume-mute': mdiVolumeMute,
    'weather-night': mdiWeatherNight,
    'weather-sunny': mdiWeatherSunny
  }),
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
        },
      },
    },
  },
})
