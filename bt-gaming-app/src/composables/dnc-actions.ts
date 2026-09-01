import firstBy from "thenby";
import { 
    DNCActivity,
    DNCGameData,
    DNCTeamState,
    DNCCreateGame,
    DNCJoinGame,
    DNCPauseGame,
    DNCShopItem,
    DNCUpdateGameSettings,
    DNCUpdateGameScore
} from "../dnc-types.js"

import { useActions, UseActionsOptions, useDataUrl, useDialogNumber, useDialogSelect } from "bt-core-app/composables"
import { toast } from "vuetify-sonner";

// const WS_BASE = 'ws://127.0.0.1:8000/api/dnc/ws';


export function useDNCActions(options?: UseActionsOptions) {
    
    const { actionLoadingMsg, actionErrorMsg, apiPatch, apiGet, apiPost, apiUpload, deleteItem, doAction, expectArray, expectSingle, isLoading, saveItem } = useActions(options)
    let activeSocket: WebSocket | null = null;

    let allActivities: DNCActivity[] | undefined
    let allShopItems: DNCShopItem[] | undefined

    async function createGame(data: DNCCreateGame) {
        return await apiPost<DNCGameData>({ nav: 'base', additionalUrl: '/create', data: data })
    }

    async function joinGame(code: string) {
        return await apiPost<DNCGameData>({ nav: 'base', additionalUrl: 'join', data: { gameCode: code }})
    }

    async function startGame(id?: string) : Promise<void> {
        if (id == null)
            return
        return await apiPost({ nav: 'base', additionalUrl: `${id}/start` })
    }

    async function pauseGame(data: DNCPauseGame) {
        return await apiPost({ nav: 'base', additionalUrl: `${data.id}/pause`, data: data })
    }

    async function restartGame(id?: string) {
        if (id == null)
            return
        return await apiPost({ nav: 'base', additionalUrl: `${id}/restart` })
    }

    async function updateSettings(data: DNCUpdateGameSettings) {
        return await apiPatch({ nav: 'base', additionalUrl: `${data.id}/settings`, data: data })
    }

    async function createActivity(data: DNCActivity) {
        return await apiPost<DNCActivity>({ nav: 'base', additionalUrl: 'add-activity', data: data })
    }

    async function removeActivity(id?: string) {
        return await apiPost<DNCActivity>({ nav: 'base', additionalUrl: `remove-activity?id=${id}` })
    }

    async function getActivities() {
        if (allActivities == null)
            allActivities = await apiGet<DNCActivity[]>({
                additionalUrl: '/activities',
                nav: 'base'
            })

        return allActivities ?? []
    }
    
    async function createShopItem(data: DNCShopItem) {
        return await apiPost<DNCShopItem>({ nav: 'base', additionalUrl: 'add-shop-item', data: data })
    }

    async function removeShopItem(id?: string) {
        return await apiPost<DNCShopItem>({ nav: 'base', additionalUrl: `remove-shop-item?id=${id}` })
    }

    async function getShopItems() {
        if (allShopItems == null)
            allShopItems = await apiGet<DNCShopItem[]>({
                additionalUrl: '/shop-items',
                nav: 'base'
            })

        return allShopItems ?? []
    }

    async function updateScore(gameID: string, teamName: string, scoreAdjustment: number) {
        var r = await apiPatch({ nav: 'base', additionalUrl: `${gameID}/score`, data: { teamName, scoreAdjustment }})
        toast(`Added ${scoreAdjustment} point${scoreAdjustment == 1 ? '' : 's'}`)
        return r
    }

    async function addActivityToGame(game: DNCGameData) {
        var actOptions = (allActivities ?? []).filter(a => !game.activities.some(gAct => gAct.id == a.id))
        var aRes = await useDialogSelect<DNCActivity>({
            itemTitleProp: 'activityName',
            items: actOptions,
            selectMode: 'single',
            title: 'Add Activity'
        })

        if (aRes.isConfirmed && aRes.result != null) {
            game.activities.push(aRes.result)
            game.activities.sort(firstBy(x => x.activityName))
            await updateSettings(game)
        }
    }

    async function addShopItemToGame(game: DNCGameData) {
        var sOptions = (allShopItems ?? []).filter(a => !game.shopItems.some(s => a.id == s.id))
        var sRes = await useDialogSelect<DNCShopItem>({
            itemTitleProp: 'itemName',
            items: sOptions,
            selectMode: 'single',
            title: 'Add Shop Item'
        })

        if (sRes.isConfirmed && sRes.result != null) {
            game.shopItems.push(sRes.result)
            game.shopItems.sort(firstBy(x => x.cost))
            await updateSettings(game)
        }
    }

    async function addScore(game: DNCGameData, team: DNCTeamState, points: number) {
        return await apiPatch({ nav: 'base', additionalUrl: `${game.id}/score`, data: {
            id: game.id,
            teamName: team.teamName,
            scoreAdjustment: points
        } })
    }

    async function addTeam(game: DNCGameData, team: DNCTeamState) {
        game.teams.push(team)
        await updateSettings(game)
    }

    async function editActivity(game: DNCGameData, activity: DNCActivity) {
        var newPointsRes = await useDialogNumber({
            startValue: activity.points,
            title: 'Change Points'
        })

        if (newPointsRes.isConfirmed && newPointsRes.result != null) {
            activity.points = newPointsRes.result
            await updateSettings(game)
        }
    }

    async function editShopItem(game: DNCGameData, shopItem: DNCShopItem) {
        var newCostRes = await useDialogNumber({
            startValue: shopItem.cost,
            title: 'Change Cost'
        })

        if (newCostRes.isConfirmed && newCostRes.result != null) {
            shopItem.cost = newCostRes.result
            await updateSettings(game)
        }
    }

    async function removeActivityFromGame(game: DNCGameData, activity: DNCActivity) {
        var ind = game.activities.findIndex(x => x.id == activity.id)
        if (ind >= 0)
            game.activities.splice(ind, 1)

        await updateSettings(game)
    }

    async function removeShopItemFromGame(game: DNCGameData, shopItem: DNCShopItem) {
        var ind = game.shopItems.findIndex(x => x.id == shopItem.id)
        if (ind >= 0)
            game.shopItems.splice(ind, 1)

        await updateSettings(game)
    }

    async function removeTeam(game: DNCGameData, team: DNCTeamState) {
        var ind = game.teams.findIndex(x => x === team)
        if (ind >= 0)
            game.teams.splice(ind, 1)

        await updateSettings(game)
    }

    function connectWebSocket(gameID: string, onUpdate: (state: any) => void): WebSocket {
        // Close any existing connection before opening a new one
        disconnectWebSocket();

        const url = useDataUrl('websocket');
        activeSocket = new WebSocket(`${url}/${gameID}`);
        
        activeSocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'Update') {
                onUpdate(message.game);
            }
        };

        return activeSocket;
    }

    function disconnectWebSocket() {
        if (activeSocket) {
            activeSocket.close();
            activeSocket = null;
        }
    }

    return {
        actionErrorMsg,
        actionLoadingMsg,
        addActivityToGame,
        addScore,
        addShopItemToGame,
        addTeam,
        connectWebSocket,
        createActivity,
        createGame,
        createShopItem,
        disconnectWebSocket,
        editActivity,
        editShopItem,
        expectArray,
        expectSingle,
        getActivities,
        getShopItems,
        isLoading,
        joinGame,
        pauseGame,
        removeActivity,
        removeActivityFromGame,
        removeShopItem,
        removeShopItemFromGame,
        removeTeam,
        restartGame,
        startGame,
        updateScore,
        updateSettings
    }
}