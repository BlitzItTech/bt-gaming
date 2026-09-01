<template>
  <v-container v-if="game != null" class="fill-height" fluid :style="aStyle">
    <v-responsive class="fill-height">

      <!-- Main Tab Content Window -->
      <v-window v-model="mainScreenTab">
        <!-- Home / Dashboard Tab -->
        <v-window-item>
          <v-row justify="center">
            <v-col cols="12" class="d-flex align-center text-h3 font-weight-bold text-white">
              <div>
                <span v-if="isDay">
                  <span v-if="smAndDown"><v-icon left>$weather-sunny</v-icon></span>
                  <span v-else><v-icon left>$weather-sunny</v-icon> Day - Get Active!</span>
                </span>
                <span v-else>
                  <span v-if="smAndDown"><v-icon left>$weather-night</v-icon></span>
                  <span v-else><v-icon left>$weather-night</v-icon> Night - Be Safe!</span>
                </span>
              </div>
              <v-spacer />
              <!-- <span class="text-caption mx-5">Code: {{ game.gameCode }}</span> -->
              <v-slide-y-transition hide-on-leave>
                <v-btn v-if="game.startedOn == null" @click="startGame(game.id)">Start</v-btn>
                <v-btn v-else @click="pauseDNCGame">Pause</v-btn>
              </v-slide-y-transition>
              <v-slide-y-transition hide-on-leave>
                <v-btn v-if="!xs && playSounds" @click="playSounds = false">Mute</v-btn>
                <v-btn v-else-if="!xs" @click="playSounds = true">Unmute</v-btn>
              </v-slide-y-transition>
              
              <v-btn v-if="!xs" @click="mainScreenTab = 1" class="mx-1" text="Teams" />
              <v-btn v-if="!xs" @click="mainScreenTab = 2" class="mx-1" text="Shop" />
              <v-btn v-if="!mdAndDown" @click="mainScreenTab = 3" class="mx-1" text="Scoring" />
              <v-btn v-if="!mdAndDown" @click="mainScreenTab = 4" class="mx-1" text="Results" />

              <v-menu >
                <template #activator="{ props }">
                  <v-btn icon="$menu" v-bind="props" variant="text" />
                </template>
                <v-list>
                  <v-list-item @click="mainScreenTab = 0" title="Home" prepend-icon="$home" />
                  <v-list-item @click="mainScreenTab = 1" title="Setup & Teams" prepend-icon="$account-group" />
                  <v-list-item @click="mainScreenTab = 2" title="Shop" prepend-icon="$store" />
                  <v-list-item @click="mainScreenTab = 3" title="Scoring" prepend-icon="$scoreboard" />
                  <v-list-item @click="mainScreenTab = 4" title="Results" prepend-icon="$trophy" />
                  <v-divider class="my-1" />
                  <v-list-item @click="shareJoinCode" title="Share Game" prepend-icon="$share" />
                  <v-divider class="my-1" />
                  <v-list-item @click.stop="playSounds = !playSounds" 
                    :title="playSounds ? 'Mute' : 'Unmute'" 
                    :prepend-icon="playSounds ? '$volume-high' : '$volume-mute'" />
                  <v-list-item @click="restartGame(game.id)" title="Restart Game" />
                  <v-list-item @click="leaveDNCGame" title="Exit Game" />
                </v-list>
              </v-menu>
            </v-col>
            <v-col v-if="showSpecialDay" cols="12">
              <v-alert
                class="text-h5 text-center"
                color="error">
                <template #default>
                  <div>The leaders have taken flight!</div>
                  <div>Find them in the day but be back by night.</div>
                  <div>Just finding them will not float.</div>
                  <div>You must attach a sticky note.</div>
                </template>
              </v-alert>
            </v-col>
            <v-col v-if="!smAndDown" cols="12" sm="6" md="4">
              <v-list lines="two">
                <div class="d-flex justify-center align-center text-h4">
                  <v-spacer />
                  <v-icon start>$ticket</v-icon>Activities
                  <v-spacer />
                </div>
                <v-list-item 
                  v-for="(s, ind) in game.activities" :key="s.id"
                  :title="s.activityName"
                  :subtitle="s.description">
                  <template #append>
                    <div class="mx-3 text-h5 text-success">+ {{ s.points }}</div>
                  </template>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" sm="6" md="4" class="text-center font-weight-bold">
              <div style="font-size: 200px;" class="text-white">{{ second }}</div>
              <v-card class="pa-4">
                <div class="text-h6">Day {{ day }} of {{ game.days }}</div>
                <v-progress-linear
                  v-for="(s, ind) in winners"
                  :key="s.teamName"
                  class="my-1"
                  v-model="s.score"
                  :color="s.color"
                  height="50">
                  <template #default>
                    <span class="text-h5"><strong>{{ s.teamName }}: {{ s.score }}</strong></span>
                  </template>
                </v-progress-linear>
                <div class="text-h4">{{ bibleReference }}</div>
              </v-card>
            </v-col>
            <v-col v-if="!smAndDown" cols="12" sm="6" md="4">
              <v-list lines="two">
                <div class="d-flex justify-center align-center text-h4">
                  <v-spacer />
                  <v-icon start>$store</v-icon>Shop
                  <v-spacer />
                </div>
                <v-list-item 
                  v-for="(s, ind) in game.shopItems" :key="s.id"
                  :title="s.itemName"
                  :subtitle="s.description">
                  <template #append>
                    <div class="mx-3 text-h5 text-error">- {{ s.cost }}</div>
                  </template>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-window-item>

        <!-- Setup / Management Tab -->
        <v-window-item>
          <v-row>
            <v-col class="d-flex align-center" cols="12">
              <v-btn theme="light" @click="mainScreenTab = 0" text="Back" prepend-icon="$arrow-left" />
              <div class="ml-5 text-h5">Teams and Settings</div>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-card theme="light" class="pa-4">
                <template #title>Teams</template>
                <template #append>
                  <v-btn size="small" @click="createNewTeam">Add Team</v-btn>
                </template>
                <v-list>
                  <v-card v-for="(t, ind) in game.teams" class="my-1" :key="t.teamName" :title="t.teamName" :subtitle="'Score: ' + t.score">
                    <template #prepend>
                      <BTColorPickerMenu
                        @change="updateSettings(game)"
                        :color="t.color"
                        v-model="t.color" />
                    </template>
                    <template #append>
                      <v-btn icon="$delete" variant="plain" size="small" color="error" @click="removeTeam(game, t)" />
                    </template>
                  </v-card>
                </v-list>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-card v-if="game != null" theme="light" class="pa-4">
                <v-card-title>Settings</v-card-title>
                <v-text-field v-model.number="game.days" @update:model-value="updateSettings(game)" label="How many days?" type="number" hide-details class="mb-3" />
                <v-text-field v-model.number="game.dayLength" @update:model-value="updateSettings(game)" label="How many seconds per day?" type="number" hide-details class="mb-3" />
                <v-divider class="my-3" />
                <v-text-field v-model.number="game.specialDay" @update:model-value="updateSettings(game)" label="Hunt On Day (0 means no hunt)" type="number" hide-details class="mb-3" />
                <v-divider class="my-3" />
                <div><span>Game Length: {{ gameLength }} minute{{ gameLength == 1 ? '' : 's' }}</span></div>
                <div>Hunt: {{ (game.specialDay ?? 0) > 0 ? 'Yes' : 'No' }}</div>
                <!-- <v-btn class="my-3" @click="setGameSettings">Update Settings</v-btn> -->
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-card theme="light" class="pa-4">
                <template #title>Activities</template>
                <template #append>
                  <v-btn size="small" @click="addActivityToGame(game)">Add Activity</v-btn>
                </template>
                <v-list>
                  <v-card v-for="(activity, ind) in game.activities" 
                    class="my-1" 
                    :key="activity.id"
                    :text="activity.description" 
                    :title="activity.activityName">
                    <template #subtitle>
                      <v-btn size="x-small" icon="$pencil" @click.stop="editActivity(game, activity)" variant="text" />
                      <span>Points: {{ activity.points }}</span>
                    </template>
                    <template #append>
                      <v-btn icon="$delete" variant="plain" size="small" color="error" @click="removeActivityFromGame(game, activity)" />
                    </template>
                  </v-card>
                </v-list>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3">
              <v-card theme="light" class="pa-4">
                <template #title>Shop Items</template>
                <template #append>
                  <v-btn size="small" @click="addShopItemToGame(game)">Add Shop Item</v-btn>
                </template>
                <v-list>
                  <v-card v-for="(t, ind) in game.shopItems" 
                    class="my-1" 
                    :key="t.id" 
                    :text="t.description"
                    :title="t.itemName">
                    <template #subtitle>
                      <v-btn size="x-small" icon="$pencil" @click.stop="editShopItem(game, t)" variant="text" />
                      <span>Cost: {{ t.cost }}</span>
                    </template>
                    <template #append>
                      <v-btn icon="$delete" variant="plain" size="small" color="error" @click="removeShopItemFromGame(game, t)" />
                    </template>
                  </v-card>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>

        <!-- Shop -->
        <v-window-item>
          <v-row>
            <v-col class="d-flex align-center" cols="12">
              <v-btn theme="light" @click="mainScreenTab = 0" text="Back" prepend-icon="$arrow-left" />
              <div class="ml-5 text-h5">Shop</div>
            </v-col>
            <v-col cols="auto" v-for="(s, ind) in game.shopItems" :key="s.id">
              <v-card
                theme="light"
                :title="s.itemName"
                width="350">
                <template #default>
                  <div class="d-flex flex-wrap">
                    <v-btn v-for="(t, ind) in game.teams"
                      :disabled="t.score < (s.cost ?? 0)"
                      class="ma-1"
                      :color="t.color"
                      :key="t.teamName"
                      small
                      variant="outlined"
                      @click="addScore(game, t, 0 - (s.cost ?? 0))">{{ t.teamName }} ({{ t.score }})</v-btn>  
                  </div>
                </template>
                <template #append>
                  <div class="text-h5 text-error">-{{ s.cost }}</div>
                </template>
              </v-card>
            </v-col>
            <v-card
              height="150"
              theme="light"
              width="350" />
          </v-row>
        </v-window-item>

        <!-- Scoring -->
        <v-window-item>
            <v-row>
              <v-col class="d-flex align-center" cols="12">
                <v-btn theme="light" @click="mainScreenTab = 0" text="Back" prepend-icon="$arrow-left" />
                <div class="ml-5 text-h5">Scoring</div>
              </v-col>
              <v-col cols="auto" v-for="(s, ind) in game.activities" :key="s.id">
                <v-card
                  theme="light"
                  :title="s.activityName"
                  width="350">
                  <template #default>
                    <div class="d-flex flex-wrap">
                      <v-btn v-for="(t, ind) in game.teams" 
                        class="ma-1"
                        :color="t.color"
                        :key="t.teamName"
                        small
                        variant="outlined"
                        @click="addScore(game, t, s.points ?? 0)">{{ t.teamName }} ({{ t.score }})</v-btn>
                    </div>
                  </template>
                  <template #append>
                    <div class="text-h5 text-success">+{{ s.points }}</div>
                  </template>
                </v-card>
              </v-col>
              <v-card
                height="150"
                theme="light"
                width="350" />
            </v-row>
          </v-window-item>

        <!-- Results / Rankings Tab -->
        <v-window-item>
          <v-row>
            <v-col class="d-flex align-center" cols="12">
              <v-btn theme="light" @click="mainScreenTab = 0" text="Back" prepend-icon="$arrow-left" />
              <div class="ml-5 text-h5">Results</div>
            </v-col>
            <v-col cols="12" class="text-center">
              <div class="text-h3 my-4">Rankings</div>
              <v-card v-for="(w, ind) in winners" :key="w.teamName" class="ma-2 mx-auto pa-4" max-width="450" theme="light">
                <template #title><div class="text-h3">{{ w.teamName }}</div></template>
                <template #append><div class="text-h3">{{ w.score }}</div></template>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-responsive>
    <bt-loader :loadingMsg="actionLoadingMsg" />
    <bt-error :errorMsg="actionErrorMsg" />
  </v-container>

  <!-- Login / Join Screen -->
  <v-container v-else class="fill-height justify-center" :style="bStyle" fluid>
    <v-window v-model="stage">
      <v-window-item> <!--0-->
        <v-card class="pa-5 mx-auto" title="Day & Night" width="300">
          <v-btn block color="primary" class="mb-3" size="large" @click="stage = 1">Join Game</v-btn>
          <v-btn block color="primary" @click="stage = 2" size="large">Create New Game</v-btn>
        </v-card>
      </v-window-item>
      <v-window-item> <!--1-->
        <v-card class="pa-5 mx-auto" title="Day & Night" width="300">
          <template #prepend>
            <v-btn @click="stage = 0" icon="$arrow-left" variant="text" />
          </template>
          <v-text-field v-model="joinGameCode" label="Game Code" hide-details class="mb-3" />
          <v-btn block color="primary" class="mb-3" size="large" @click="joinDNCGame" :disabled="isNullOrEmpty(joinGameCode)">Join Game</v-btn>
        </v-card>
      </v-window-item>
      <v-window-item> <!--2-->
        <v-card class="pa-5 mx-auto" title="Day & Night Activities" width="300">
          <template #prepend>
            <v-btn @click="stage = 0" icon="$arrow-left" variant="text" />
          </template>
          <v-text-field v-model.number="newGame.days" label="How many days?" type="number" hide-details class="mb-3" />
          <v-text-field v-model.number="newGame.dayLength" label="How many seconds per day?" type="number" hide-details class="mb-3" />
          <v-divider class="my-3" />
          <v-text-field v-model.number="newGame.specialDay" label="Hunt On Day (0 means no hunt)" type="number" hide-details class="mb-3" />
          <v-divider class="my-3" />
          <div><span>Game Length: {{ newGameLength }} minute{{ newGameLength == 1 ? '' : 's' }}</span></div>
          <div>Hunt: {{ newGame.specialDay > 0 ? 'Yes' : 'No' }}</div>
          <v-divider class="my-3" />
          <v-btn block color="primary" @click="stage = 3">Next</v-btn>
        </v-card>
      </v-window-item>
      <v-window-item> <!--3-->
        <v-card class="pa-5 mx-auto" title="Select Activities" width="300">
          <template #prepend>
            <v-btn @click="stage = 2" icon="$arrow-left" variant="text" />
          </template>
          <bt-blade-items
            :items="allActivities"
            :max-height="400"
            variant="pure">
            <template #listItem="{ item }">
              <v-card
                class="ma-0 pa-0"
                @click.stop="item.isSelected = !item.isSelected"
                :subtitle="`Points: ${item.activity.points}`"
                :text="item.activity.description"
                :title="item.activity.activityName">
                <template #prepend>
                  <v-slide-y-reverse-transition hide-on-leave>
                    <v-btn v-if="item.isSelected" icon="$check" class="text-success" />
                    <v-btn v-else icon="$close" class="text-error" />
                  </v-slide-y-reverse-transition>
                </template>
              </v-card>
            </template>
          </bt-blade-items>
          <v-btn block @click="stage = 4">Create New Activity</v-btn>
          <v-divider class="my-3" />
          <v-btn block color="primary" @click="stage = 5">Next</v-btn>
        </v-card>
      </v-window-item>
      <v-window-item> <!--4-->
        <v-card class="pa-5 mx-auto" title="New Activity" width="300">
          <template #prepend>
            <v-btn @click="stage = 3" icon="$arrow-left" variant="text" />
          </template>
          <v-row>
            <v-col cols="12">
              <bt-field-string
                isEditing
                label="Activity Name"
                sm="12"
                v-model="newActivity.activityName" />

            <bt-field-text-area
                isEditing
                label="Description"
                sm="12"
                v-model="newActivity.description" />

            <bt-field-string
                isEditing
                label="Points (How much a team scores on completion)"
                sm="12"
                type="number"
                v-model.number="newActivity.points" />
            </v-col>
          </v-row>
          <v-divider class="my-3" />
          <v-btn block color="primary" @click="createNewActivity">Create</v-btn>
        </v-card>
      </v-window-item>
      <v-window-item> <!--5-->
        <v-card class="pa-5 mx-auto" title="Select Shop Items" width="300">
          <template #prepend>
            <v-btn @click="stage = 3" icon="$arrow-left" variant="text" />
          </template>
          <bt-blade-items
            :items="allShopItems"
            :max-height="400"
            variant="pure">
            <template #listItem="{ item }">
              <v-card
                class="ma-0 pa-0"
                @click.stop="item.isSelected = !item.isSelected"
                :subtitle="`Cost: ${item.shopItem.cost}`"
                :text="item.shopItem.description"
                :title="item.shopItem.itemName">
                <template #prepend>
                  <v-slide-y-reverse-transition hide-on-leave>
                    <v-btn v-if="item.isSelected" icon="$check" class="text-success" />
                    <v-btn v-else icon="$close" class="text-error" />
                  </v-slide-y-reverse-transition>
                </template>
              </v-card>
            </template>
          </bt-blade-items>
          <v-btn block @click="stage = 6">Create New Shop Item</v-btn>
          <v-divider class="my-3" />
          <v-btn block color="primary" @click="createDNCGame">Create Game</v-btn>
        </v-card>
      </v-window-item>
      <v-window-item> <!--6-->
        <v-card class="pa-5 mx-auto" title="New Shop Item" width="300">
          <template #prepend>
            <v-btn @click="stage = 5" icon="$arrow-left" variant="text" />
          </template>
          <v-row>
            <v-col cols="12">
              <bt-field-string
                isEditing
                label="Shop Item Name"
                sm="12"
                v-model="newShopItem.itemName" />

            <bt-field-text-area
                isEditing
                label="Description"
                sm="12"
                v-model="newShopItem.description" />

            <bt-field-string
                isEditing
                label="Cost Of Purchase"
                sm="12"
                type="number"
                v-model.number="newShopItem.cost" />
            </v-col>
          </v-row>
          <v-divider class="my-3" />
          <v-btn block color="primary" @click="createNewShopItem">Create</v-btn>
        </v-card>
      </v-window-item>
    </v-window>
    
    <!-- <new-activity-dialog :showToggle="newActivityToggle" @selected="addActivityToGame" /> -->
    <bt-loader :loadingMsg="actionLoadingMsg" />
    <bt-error :errorMsg="actionErrorMsg" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import { shopItemOptions, activityOptions, useDNCSounds } from '../composables/dnc'
import { useDNCActions } from '@/composables/dnc-actions'
import { firstBy } from 'thenby'
import { toast } from 'vuetify-sonner'
import { DNCActivity, DNCGameData, DNCCreateGame, DNCShopItem } from '@/dnc-types'
import { DateTime } from 'luxon'
import { getRandomBibleReference } from '../composables/bible'
import { isNullOrEmpty, StoreGetAllReturn, useColorizer, useDialogString } from 'bt-core-app/composables'
import { useRoute, useRouter } from 'vue-router'
import { BTColorPickerMenu } from 'bt-core-app/components'

const theme = useTheme();
theme.change('dark')

const newActivity = ref<DNCActivity>({})
const newShopItem = ref<DNCShopItem>({})

const game = ref<DNCGameData | undefined>();
const mainScreenTab = ref(0)
const stage = ref(0)
const joinGameCode = ref<string | undefined>();
const newTeamName = ref<string | undefined>();
const newTeamColor = ref<string | undefined>();
const newGame = ref<DNCCreateGame>({ 
  activities: [], 
  days: 10, 
  dayLength: 120,
  shopItems: [], 
  specialDay: 0,
  teams: []
});
const newGameLength = computed(() => Math.round((newGame.value.days * newGame.value.dayLength)/60))
const gameLength = computed(() => Math.round(((game.value?.days ?? 0) * (game.value?.dayLength ?? 0))/60))
const { mdAndDown, smAndDown, xs } = useDisplay()
const showSpecialDay = ref(false)

const day = ref(0)
const second: Ref<number> = ref(0)
const isPaused = ref(false)

const allActivities = ref<{ isSelected: boolean, activity: DNCActivity }[]>([])
const allShopItems = ref<{ isSelected: boolean, shopItem: DNCShopItem }[]>([])

const isDay = ref(false)
const {
      stopSounds,
      playSounds,
      tryPlayBellSound,
      tryPlayDaySound,
      tryPlayHuntSound,
      tryPlayNightSound,
      tryPlayWolfSound
    } = useDNCSounds()

const {
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
      getActivities,
      getShopItems,
      joinGame,
      pauseGame,
      removeActivity,
      removeActivityFromGame,
      removeShopItemFromGame,
      removeShopItem,
      removeTeam,
      restartGame,
      startGame,
      updateScore,
      updateSettings
  } = useDNCActions()

  const colorizer = useColorizer()
  const router = useRouter()
  const route = useRoute()

let ws: WebSocket | null = null;

const aStyle = computed(() => {
  const bg = (isDay.value || mainScreenTab.value != 0) ? 'day.jpg' : 'night.jpg';
  return `background: url("/${bg}") no-repeat top center fixed; background-size: cover; min-height: 100%;`;
});

const bStyle = computed(() => {
  return `background: url("/background-one.jpg") no-repeat top center fixed; background-size: cover; min-height: 100%;`;
});

const bibleReference = ref<string | undefined>()

const winners = computed(() => {
  if (!game.value?.teams) return [];
  return [...game.value.teams].sort(firstBy(x => x.score, 'desc'));
});

function initWebSocket(gameId: string) {
  if (ws) ws.close();
  ws = connectWebSocket(gameId, (updatedState) => {
    let cGame = game.value

    if (cGame == null)
      startTimer(updatedState)
    else {
      if (cGame.startedOn == null && updatedState.startedOn != null)
        startTimer(updatedState)
      else if (cGame.startedOn != null && updatedState.startedOn == null)
        isPaused.value = true
    }

    game.value = updatedState;
  });
}

async function createDNCGame() {
  try {
    newGame.value.activities = allActivities.value.filter(x => x.isSelected).map(z => z.activity).sort(firstBy(x => x.activityName))
    newGame.value.shopItems = allShopItems.value.filter(x => x.isSelected).map(z => z.shopItem).sort(firstBy(x => x.cost))

    game.value = await createGame(newGame.value)
    
    if (game.value != null) {
      initWebSocket(game.value.id);
      toast('Game created successfully!');
    }
  } catch (err) {
    toast('Failed to create game');
  }
}

async function createNewActivity() {
  var activity = await createActivity(newActivity.value)
  if (activity != null) {
    var nAct = { activity: activity, isSelected: true }
    allActivities.value.unshift(nAct)
  }
    
  newActivity.value = {}
  stage.value = 3
}

async function createNewShopItem() {
  var shopItem = await createShopItem(newShopItem.value)
  if (shopItem != null) {
    var nShop = { shopItem: shopItem, isSelected: true }
    allShopItems.value.unshift(nShop)
  }

  newShopItem.value = {}
  stage.value = 5
}

async function createNewTeam() {
  var teamName = await useDialogString({
    title: 'Team Name'
  })

  if (game.value != null && teamName.isConfirmed && teamName.result != null)
    await addTeam(game.value, {
      teamName: teamName.result,
      score: 0,
      scoringFactor: 1,
      color: colorizer.getColor()
    })
}

async function joinDNCGame() {
  try {
    if (joinGameCode.value == null)
      return

    game.value = await joinGame(joinGameCode.value)

    if (game.value != null) {
      initWebSocket(game.value.id)
      toast('Joined game!')

      startTimer(game.value)
    }
  } catch (err) {
    toast('Invalid game code');
  }
}

async function pauseDNCGame() {
  try {
    if (game.value == null)
      return

    await pauseGame({
      id: game.value.id,
      currentDay: day.value,
      currentSecond: second.value,
      isDay: isDay.value
    })
  } catch (err) {
    toast('Pause failed')
  }
}

async function setGameSettings() {
  if (game.value) {
    await updateSettings(game.value);
    toast('Settings updated');
  }
}

async function leaveDNCGame() {
  if (game.value) {
    disconnectWebSocket()
    router.push({ name: 'home' })
  }
}

async function refreshActivities() {
  allActivities.value = (await getActivities()).map(x => { return { activity: x, isSelected: false }})
}

async function refreshShopItems() {
  allShopItems.value = (await getShopItems()).map(x => { return { shopItem: x, isSelected: false }})
}

  function startTimer(vGame: DNCGameData) {
    if (vGame.startedOn != null) {
      var d = DateTime.fromISO(vGame.startedOn)
      var dif = DateTime.now().diff(d, 'seconds').toObject().seconds
      
      var diffSeconds = Math.ceil(dif ?? 0);
      vGame.currentSecond ??= 0

      day.value = vGame.currentDay
      isDay.value = vGame.isDay
      isPaused.value = vGame.startedOn == null
      
      if (diffSeconds == 0) {
        second.value += (isDay.value ? -1 : 1)
      }
      else {
        var mSec = vGame.currentSecond
        var mDay = vGame.currentDay
        var mIsDay = vGame.isDay

        for (let i = 0; i < diffSeconds; i++) {
          mSec += (mIsDay ? -1 : 1)

          if (mSec <= 0) {
            mIsDay = false
            mDay++
          }
          else if (mSec >= vGame.dayLength) {
            mIsDay = true
          }

          if (mDay >= vGame.days) {
            mainScreenTab.value = 4
            return
          }
        }

        day.value = mDay
        isDay.value = mIsDay
        if (second.value == mSec) {
          second.value += (isDay.value ? -1 : 1)
        }
        else {
          second.value = mSec
        }
      }
    }
  }

  function startSpecialDay() {
    showSpecialDay.value = true

    stopSounds()
    tryPlayHuntSound()
  }

  function toggleToDay() {
    isDay.value = true
    theme.change('light')
    
    stopSounds()
    tryPlayDaySound()

    changeBible()
  }

  function toggleToNight() {
    isDay.value = false
    theme.change('dark')

    showSpecialDay.value = false

    stopSounds()
    tryPlayNightSound()
    tryPlayWolfSound()
  
    changeBible()
    // changeColor()
  }

  function changeBible() {
    bibleReference.value = isDay.value ? getRandomBibleReference().reference : '(...)'
  }
  
  async function shareJoinCode() {
      if (navigator.share != null && game.value != null) {
        var url = location.href
        if (!url.includes('?'))
          url = `${url}?join=${game.value.gameCode}`

        await navigator.share({
          text: `Here's the link for the game: \n\n${url}`
        })
      }
  }
  onMounted(async () => {
    refreshActivities()
    refreshShopItems()
    
    if (game.value == null) {
      var j = route.query.join as string
      if (j != null && j.length > 0) {
        joinGameCode.value = j
        await joinDNCGame()
      }
    }
  })

  watch(second, (v) => {
    if (v <= 0) {
      toggleToNight()
      day.value++
    }
    else if (game.value && v >= game.value.dayLength) {
      toggleToDay()
    }

    if (isDay.value && v == 10) {
      stopSounds()
      tryPlayBellSound()
    }
    
    if (day.value != 0 && day.value == game.value?.specialDay && v == 10) {
      startSpecialDay()
    }

    if (game.value && day.value >= game.value.days) {
      mainScreenTab.value = 4
      isPaused.value = true
    }

    setTimeout(() => {
      if (!isPaused.value && second.value != null) {
        second.value += (isDay.value ? -1 : 1)
      }
    }, 1000)
  }, { immediate: false })

</script>