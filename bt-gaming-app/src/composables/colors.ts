import { randomInt } from "crypto"
import { ref } from 'vue'

export function useColors() {
    const possibleColors = [
        '#870000',
        '#874800',
        '#858700',
        '#3d8700',
        '#008734',
        '#006f87',
        '#004587',
        '#000f87',
        '#2c0087',
        '#870071',
        '#a752e2',
        '#e252cb',
        '#e2527f',
        '#e25252',
        '#e25252',
        '#e28b52']

    const usedColors = ref<number[]>([])

    function getNewColor() {
        let int = 0

        if (usedColors.value.length >= possibleColors.length)
            usedColors.value = []

        while (usedColors.value.some((c: number) => c == int)) {
            int = Math.floor(Math.random()*((possibleColors.length - 1)-0+1)+0)
        }
        
        usedColors.value.push(int)
        return possibleColors[int]
    }

    return {
        getNewColor
    }
}
