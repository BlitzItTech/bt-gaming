<template>
    <v-container class="fill-height" fluid :style="aStyle">
        <v-card style="background: rgba(0, 0, 0, 0.75);" class="ma-4 pa-4" height="100%" width="100%">
            <div class="d-flex justify-center">
                <v-spacer />
                <v-tabs align-tabs="center" v-model="tab">
                    <v-tab>Teams</v-tab>
                    <v-tab>Settings</v-tab>
                </v-tabs>
                <v-spacer />
                <v-btn 
                    @click="sortTeams"
                    prepend-icon="$sort"
                    size="small"
                    text="Sort" />
            </div>
            <v-window v-model="tab">
                <v-window-item>
                    <v-list bg-color="transparent">
                        <v-slide-x-transition group hide-on-leave>
                            <template v-for="(team, ind) in teams" :key="ind">
                                <v-list-item>
                                    <v-list-item-subtitle>
                                        <div class="d-flex justify-center mb-1">
                                            <div class="text-h6">{{ team.teamName }}</div>
                                            <v-spacer />
                                            <v-btn
                                                class="mx-2 text-error"
                                                @click="adjustScore(team, -10)"
                                                icon
                                                size="x-small"
                                                text="-10"
                                                variant="tonal" />

                                            <v-btn
                                                class="mx-2 text-error"
                                                @click="adjustScore(team, -1)"
                                                icon
                                                size="x-small"
                                                text="-1"
                                                variant="tonal" />

                                            <v-btn
                                                class="mx-2 text-success"
                                                icon
                                                @click="adjustScore(team, 1)"
                                                size="x-small"
                                                text="+1"
                                                variant="tonal" />

                                            <v-btn
                                                class="mx-2 text-success"
                                                icon
                                                @click="adjustScore(team, 10)"
                                                size="x-small"
                                                text="+10"
                                                variant="tonal" />

                                        </div>
                                    </v-list-item-subtitle>
                                    <v-list-item-title>
                                        <v-progress-linear
                                            :color="team.color"
                                            v-model="team.progress"
                                            height="50">
                                            <template #default>{{ team.teamName }}</template>
                                        </v-progress-linear>
                                    </v-list-item-title>
                                    <template #append>
                                        <div style="width: 100px;" class="text-right mr-3 text-h5">
                                            {{ team.score }}
                                        </div>
                                    </template>
                                </v-list-item>
                                <v-divider class="mb-3" />
                            </template>
                        </v-slide-x-transition>
                    </v-list>
                    <div class="d-flex justify-end">
                        <v-btn 
                            @click="clearScores"
                            prepend-icon="$null"
                            size="small"
                            text="Clear" />
                    </div>
                </v-window-item>
                <v-window-item>
                    <v-list bg-color="transparent">
                        <v-slide-x-transition group hide-on-leave>
                            <template v-for="(team, ind) in teams" :key="ind">
                                <v-list-item>
                                    <v-list-item-title>
                                        <div class="d-flex align-center">
                                            <v-btn
                                                class="ml-4 text-error"
                                                @click="team.score -= 10"
                                                icon
                                                size="small"
                                                text="-10"
                                                variant="tonal" />

                                            <v-btn
                                                class="text-error"
                                                @click="team.score -= 1"
                                                icon
                                                size="small"
                                                text="-1"
                                                variant="tonal" />

                                            <v-btn
                                                class="text-success"
                                                icon
                                                @click="team.score += 1"
                                                size="small"
                                                text="+1"
                                                variant="tonal" />

                                            <v-btn
                                                class="text-success"
                                                icon
                                                @click="team.score += 10"
                                                size="small"
                                                text="+10"
                                                variant="tonal" />

                                            <v-text-field 
                                                class="mx-5"
                                                hide-details
                                                label="Name"
                                                v-model="team.teamName" />

                                        </div>
                                    </v-list-item-title>
                                    <template #append>
                                        <div class="d-flex align-center">
                                            <div style="min-width: 100px;">
                                                <v-text-field
                                                    hide-details
                                                    label="Score"
                                                    v-model="team.score" />
                                            </div>
                                            <v-btn
                                                class="text-error"
                                                icon="$delete"
                                                @click="removeTeam(ind)"
                                                variant="plain" />
                                        </div>
                                    </template>
                                </v-list-item>
                            </template>
                            <v-list-item @click="addTeam" title="Add New Team" key="-1" />
                        </v-slide-x-transition>
                    </v-list>
                </v-window-item>
            </v-window>
                    <!-- <v-row>
                    <v-col cols="12">
                        <v-list-subheader>Teams</v-list-subheader>
                        <v-divider class="my-1" />
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-card
                        title="Day & Night"
                        text="A game of skill and teamwork.">
                        <template #actions>
                            <v-spacer />
                            <v-btn :to="{ name: 'dnc' }" append-icon="$arrow-right">Play</v-btn>
                        </template>
                        </v-card>
                    </v-col>
                    </v-row> -->
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
    import { templateElement } from '@babel/types';
import { useStorage, watchDebounced } from '@vueuse/core';
import { firstBy } from 'thenby';
import { computed, ref } from 'vue'
import { useColors } from '@/composables/colors'

    interface Team {
        color: string
        teamName: string
        score: number
        progress: number
    }

    const { getNewColor } = useColors()
    const tab = ref(0)
    const teams = useStorage<Team[]>('bt-gaming-scoreboard', [])
    const teamsChanged = ref(false)

    const aStyle = computed(() => {
      return `background: url("/background-one.jpg") no-repeat top center fixed; -webkit-background-size: cover; -moz-background-size: cover; background-size: cover; -o-background-size: cover; min-height: 100%;`
    })

    function adjustScore(team: Team, val: number) {
        team.score += val
        teamsChanged.value = !teamsChanged.value

        refreshProgress()
    }

    function addTeam() {
        teams.value.push({
            color: getNewColor(),
            teamName: `Team ${teams.value.length + 1}`,
            score: 0,
            progress: 0
        })
    }

    function clearScores() {
        teams.value.forEach(x => {
            x.score = 0
        })
        refreshProgress()
    }

    function refreshProgress() {
        const max = Math.max(...teams.value.map((x: Team) => x.score))
        const min = Math.min(...teams.value.map((x: Team) => x.score))
        let div = max - min

        if (div == 0)
            div = 100

        teams.value.forEach((x: Team) => {
            x.progress = Math.round((x.score / div) * 100)
        })
    }

    function removeTeam(ind: number) {
        teams.value.splice(ind, 1)
    }

    function sortTeams() {
        teams.value.sort(firstBy(x => x.score, 'desc'))
    }

    // watchDebounced(teamsChanged, () => {
    //     teams.value.sort(firstBy(x => x.score, 'desc'))
    // }, { debounce: 1000, maxWait: 1000 })

</script>