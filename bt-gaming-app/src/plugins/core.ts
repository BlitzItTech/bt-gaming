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
            data: 'http://127.0.0',
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