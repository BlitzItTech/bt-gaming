import { createCore } from 'bt-core-app/core'

export default createCore({
    auth: {},
    cosmetics: {
        defaultTheme: 'dark'
    },
    includeComponents: true,
    navigation: {
        navItems: [
        {
            path: '',
            name: 'base'
        }]
    },
    urls: {
        production: {
            data: 'https://api.gaming.blitzitweb.com.au/api/dnc',
            origins: [
                'https://gaming.blitzitweb.com.au'
            ],
            other: {
                websocket: 'ws://api.gaming.blitzitweb.com.au/api/dnc/ws'
            }
        },
        staging: {
            data: 'http://127.0.0.1:8000/api/dnc',
            other: {
                websocket: 'ws://127.0.0.1:8000/api/dnc/ws'
            }
        },
        development: {
            data: 'http://127.0.0.1:8000/api/dnc',
            origins: [
                'http://localhost:3000'
            ],
            other: {
                websocket: 'ws://127.0.0.1:8000/api/dnc/ws'
            }
        }
    }
})