<template>
    <v-container v-if="game != null" class="fill-height" fluid :style="aStyle">
      <v-responsive class="fill-height">
        <v-row>
          <v-col cols="12" class="d-flex align-center text-h3 font-weight-bold text-white">
            <div v-if="!$vuetify.display.mobile">
              <span v-if="isDay">
                <v-icon left>mdi-weather-sunny</v-icon> Day - Get Active!
              </span>
              <span v-else>
                <v-icon left>mdi-weather-night</v-icon> Night - Be Safe!
              </span>
            </div>
            
            <v-spacer />
            <span class="text-caption mx-5">Code: {{ game.gameCode }}</span>
            <v-slide-x-transition group hide-on-leave>
              <v-btn v-if="game.startedOn == null" @click="startGame" key="1">Start</v-btn>
              <v-btn v-if="game.startedOn != null" icon="mdi-pause" @click="pauseGame" variant="text" key="2" />
            </v-slide-x-transition>
            <v-slide-x-transition group hide-on-leave>
              <v-btn v-if="playSounds" icon="mdi-volume-high" @click="playSounds = false" variant="text" key="1" />
              <v-btn v-else icon="mdi-volume-mute" @click="playSounds = true" variant="text" key="2" />
            </v-slide-x-transition>
            <v-menu>
              <template #activator="{ props }">
                <v-btn icon="mdi-menu" v-bind="props" variant="text" />
              </template>
              <v-list>
                <v-list-item @click="mainScreenTab = 0" title="Home" prepend-icon="mdi-home" />
                <v-list-item @click="mainScreenTab = 1" title="Teams | Activities | Shopable Items" prepend-icon="mdi-account-group" />
                <v-list-item @click="mainScreenTab = 2" title="Shop" prepend-icon="mdi-store" />
                <v-list-item @click="mainScreenTab = 3" title="Scoring" prepend-icon="mdi-scoreboard" />
                <v-list-item @click="mainScreenTab = 4" title="Results" prepend-icon="mdi-trophy" />
                <v-divider class="my-1" />
                <v-list-item @click="reset" title="Restart Game" />
                <v-list-item @click="leaveGame" title="Exit Game" />
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
        <v-window v-model="mainScreenTab">
          <v-window-item>
            <v-row>
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

              <v-col v-if="!$vuetify.display.mobile" cols="12" sm="6" md="4">
                <v-list lines="two">
                  <div class="d-flex justify-center text-h4">
                    <v-spacer />
                    <v-icon start>mdi-ticket</v-icon>Activities
                    <v-spacer />
                  </div>
                  <v-list-item 
                    v-for="(s, ind) in game.activities" :key="ind"
                    :title="s.activityName"
                    :subtitle="s.description">
                    <template #append>
                      <div class="mx-3 text-h5 text-success">+ {{ s.points }}</div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="6" md="4" class="text-center font-weight-bold">
                <div style="font-size: 250px;" class="text-white">{{ second }}</div>
                <v-card class="pa-4">
                  <div class="text-h6">Day {{ day }} of {{ game.days }}</div>
                  <v-progress-linear
                    v-for="(s, ind) in winners"
                    :ind="ind"
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
              <v-col v-if="!$vuetify.display.mobile" cols="12" sm="6" md="4">
                <v-list lines="two">
                  <div class="d-flex justify-center text-h4">
                    <v-spacer />
                    <v-icon start>mdi-store</v-icon>Shop
                    <v-spacer />
                  </div>
                  <v-list-item 
                    v-for="(s, ind) in game.shopItems" :key="ind"
                    :title="s.itemName"
                    :subtitle="s.description">
                    <template #append>
                      <div class="mx-3 text-h5 text-error">- {{ s.cost }}</div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>
              <!-- <v-col cols="12" sm="6" class="font-weight-bold">
                <v-card v-if="!isDay && color != null && color.length > 0" :color="color">
                  <div class="text-h3 text-center">Go To Jail</div>
                </v-card>
              </v-col> -->
              <!-- <v-col cols="12" sm="6" class="font-weight-bold text-right">
                <span class="text-h4">Bible Reference: {{ bibleReference }}</span>
              </v-col> -->
            </v-row>
          </v-window-item>
          <v-window-item>
            <v-row>
              <v-col cols="12">
                <v-divider class="my-1" />
              </v-col>
              <v-col cols="12" md="4">
                <v-card theme="light">
                  <template #title>
                    <div class="d-flex align-center">
                      <v-card-title>Settings</v-card-title>
                      <v-spacer />
                      <v-btn class="my-3" @click="setGameSettings">Update</v-btn>
                    </div>
                  </template>
                  <v-text-field v-model.number="game.days" hide-details label="Days" />
                  <v-text-field v-model.number="game.dayLength" hide-details label="Day Length (seconds)" placeholder="Seconds" />
                  <v-text-field v-model.number="game.specialDay" hide-details label="Special Day" placeholder="(Day Leaders Hide)" />
                </v-card>
                <v-list lines="two" theme="light">
                  <div class="d-flex justify-center text-h4">
                    <v-spacer />
                    <v-icon start>mdi-account-group</v-icon>Teams
                    <v-spacer />
                  </div>
                  <v-list-item 
                    v-for="(t, ind) in game.teams" :key="ind"
                    :title="t.teamName"
                    :subtitle="'Score: ' + t.score">
                    <template #prepend>
                      <v-menu :close-on-content-click="false">
                        <template #activator="{ props }">
                          <v-btn :color="t.color" icon="mdi-invert-colors" small class="mr-1" v-bind="props" />
                        </template>
                        <v-color-picker v-model="t.color" mode="rgb" />
                        <v-btn @click="addScore(t, 0)">Apply</v-btn>
                      </v-menu>
                    </template>
                    <template #append>
                      <v-btn icon="mdi-delete" class="text-error" variant="plain" @click="removeTeam(t)" />
                    </template>
                  </v-list-item>
                  <v-card class="ma-1 pa-1 mx-auto" variant="flat">
                    <v-text-field 
                      hide-details
                      label="New Team Name"
                      v-model="newTeamName">
                      <template #prepend>
                        <v-menu :close-on-content-click="false">
                          <template #activator="{ props }">
                            <v-btn :color="newTeamColor" icon="mdi-invert-colors" v-bind="props" />
                          </template>
                          <v-color-picker v-model="newTeamColor" mode="rgb" />
                        </v-menu>
                      </template>
                      <template #append>
                        <v-fade-transition>
                          <v-btn v-if="newTeamName != null && newTeamName.length > 0" @click="addTeam">Add</v-btn>
                        </v-fade-transition>
                      </template>
                    </v-text-field>

                  </v-card>
                </v-list>
              </v-col>
              
              <v-col cols="12" md="4">
                <v-list lines="two" theme="light">
                  <div class="d-flex justify-center text-h4">
                    <v-spacer />
                    <v-icon start>mdi-ticket</v-icon>Activities
                    <v-spacer />
                    <!-- <v-btn @click="mainScreenTab = 1">Score</v-btn> -->
                  </div>
                  <v-list-item 
                    v-for="(s, ind) in activityOptions" :key="ind"
                    class="ma-0 pa-0 mr-1 pr-1"
                    :title="s.activityName"
                    :subtitle="s.description">
                    <template #prepend>
                      <v-btn class="mx-2" :class="(game != null && game.activities != null && game.activities.some(x => x.activityName == s.activityName)) ? 'text-success' : ''" size="small" @click="toggleActivity(s)">Use</v-btn>
                    </template>
                    <template #append>
                      <span class="ml-2">+{{ s.points }}</span>
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-col cols="12" md="4">
                <v-list lines="two" theme="light">
                  <div class="d-flex justify-center text-h4">
                    <v-spacer />
                    <v-icon start>mdi-store</v-icon>Shop
                    <v-spacer />
                    <!-- <v-btn @click="mainScreenTab = 2">Score</v-btn> -->
                  </div>
                  <v-list-item 
                    v-for="(s, ind) in shopItemOptions" :key="ind"
                    class="ma-0 pa-0 mr-1 pr-1"
                    :title="s.itemName"
                    :subtitle="s.description">
                    <template #prepend>
                      <v-btn class="mx-2" :class="game != null && game.shopItems != null && game.shopItems.some(x => x.itemName == s.itemName) ? 'text-success' : ''" size="small" @click="toggleShopItem(s)">Use</v-btn>
                    </template>
                    <template #append>
                      <span class="ml-2">-{{ s.cost }}</span>
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>
              
            </v-row>
          </v-window-item>
          <v-window-item>
            <v-row>
              <v-col cols="auto" v-for="(s, ind) in game.shopItems" :key="ind">
                <v-card
                  theme="light"
                  :title="s.itemName"
                  width="350">
                  <template #actions>
                    <v-btn v-for="(t, ind) in game.teams"
                      :disabled="t.score < s.cost"
                      class="mx-1"
                      :color="t.color"
                      :key="ind"
                      small
                      variant="outlined"
                      @click="addScore(t, 0 - s.cost)">{{ t.teamName }} ({{ t.score }})</v-btn>  
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
          <v-window-item>
            <v-row>
              <v-col cols="auto" v-for="(s, ind) in game.activities" :key="ind">
                <v-card
                  theme="light"
                  :title="s.activityName"
                  width="350">
                  <template #actions>
                    <v-btn v-for="(t, ind) in game.teams" 
                      class="mx-1"
                      :color="t.color"
                      :key="ind"
                      small
                      variant="outlined"
                      @click="addScore(t, s.points)">{{ t.teamName }} ({{ t.score }})</v-btn>
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
          <v-window-item>
            <v-row>
              <v-col cols="12" class="text-center">
                <div class="text-h3 my-4">Rankings</div>
                <v-card v-for="(w, ind) in winners" :key="ind"
                    class="ma-2 mx-auto pa-4"
                    max-width="450"
                    theme="light">
                    <template #prepend>
                      <v-icon :color="w.color" size="x-large">mdi-circle</v-icon>
                    </template>
                    <template #title>
                      <div class="text-h3">{{ w.teamName }}</div>
                    </template>
                    <template #append>
                      <div class="text-h3">{{ w.score }}</div>
                    </template>
                  </v-card>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
        <!-- <v-snackbar v-model="showMsg" timeout="3000">{{ msg }}</v-snackbar> -->
      </v-responsive>
    </v-container>
    <v-container v-else class="fill-height" :style="bStyle" fluid>
      <v-card class="pa-5 mx-auto" title="Day & Night">
        <v-slide-x-transition hide-on-leave>
          <v-card v-if="showNewGame" width="250" variant="flat">
            <template #title>
              <div class="d-flex align-center">
                <v-btn icon="mdi-arrow-left" variant="plain" @click="showNewGame = false" />
                <v-card-title>New Game</v-card-title>
              </div>
            </template>
              <v-text-field v-model.number="newGame.days" hide-details label="Days" />
              <v-text-field v-model.number="newGame.dayLength" hide-details label="Day Length (seconds)" placeholder="Seconds" />
              <v-text-field v-model.number="newGame.specialDay" hide-details label="Leader Hide Day" placeholder="Day Leaders Hide" />
              <v-btn class="my-3" block @click="create">Create</v-btn>
          </v-card>
          <v-card v-else width="250" class="pa-5 mx-auto" variant="flat">
              <v-btn class="my-3" block @click="showNewGame = true">New Game</v-btn>
              <v-divider class="my-3" />
              <v-text-field v-model="joinGameCode" label="Game Code" hide-details />
              <v-btn class="my-3" :disabled="joinGameCode == null || joinGameCode.length == 0" block @click="joinGame">Join Game</v-btn>
          </v-card>
      </v-slide-x-transition>
      <v-overlay
          v-model="showNewGameMsg"
          class="align-center justify-center text-center"
          persistent
          theme="light">
          <v-progress-circular indeterminate />
          <div>{{ newGameMsg }}</div>
        </v-overlay>
      </v-card>
      <v-overlay
          v-model="showLoadingMsg"
          class="align-center justify-center text-center"
          persistent
          theme="light">
          <v-progress-circular indeterminate />
          <div>{{ loadingMsg }}</div>
      </v-overlay>
    </v-container>
</template>

<script setup lang="ts">
    import { computed, ref, watch, type Ref } from 'vue'
    import { useTheme } from 'vuetify'
    import { useSignalR } from '@dreamonkey/vue-signalr'
    import { DateTime } from 'luxon'
    import { toValue } from 'vue'
    import { firstBy } from 'thenby'
    import { useRouter } from 'vue-router'
    import { toast } from 'vuetify-sonner'
import { useSound } from '@vueuse/sound'

    interface DNCGameData {
        id: string,
        isRunning: boolean,
        startedOn: any,
        gameCode: string,
        days: number,
        dayLength: number,
        currentDay: number,
        currentSecond: number,
        specialDay: number,
        isDay: boolean,
        teams?: DNCTeamState[],
        activities?: DNCActivity[],
        shopItems?: DNCShopItem[]
    }

    interface DNCTeamState {
        teamName: string,
        color: string,
        score: number,
        scoringFactor: number
    }

    interface DNCActivity {
      activityName: string,
      description: string,
      points: number
    }

    interface DNCShopItem {
      itemName: string,
      description: string,
      cost: number
    }

    //start
    const joinGameCode: Ref<string | null> = ref(null)
    const showNewGame = ref(false)
    const newGame: Ref<any> = ref({ days: 30, dayLength: 180 })
    const newGameMsg: Ref<string | null> = ref(null)
    const showNewGameMsg = computed(() => newGameMsg.value != null)
    const theme = useTheme()
    theme.global.name.value = 'dark'
    const game: Ref<DNCGameData | null> = ref(null)
    const newTeamColor: Ref<string> = ref('#ffffff')
    const newTeamName: Ref<string | null> = ref(null)
    const mainScreenTab = ref(0)
    const router = useRouter()
    const loadingMsg: Ref<string | null> = ref(null)
    const playSounds = ref(false)
    const showLoadingMsg = computed(() => loadingMsg.value != null)
    const showSpecialDay = ref(false)
    
    const aStyle = computed(() => {
      if (mainScreenTab.value != 0) {
        return `background: url("/day.jpg") no-repeat top center fixed; -webkit-background-size: cover; -moz-background-size: cover; background-size: cover; -o-background-size: cover; min-height: 100%;`
      }

      return `background: url("${isDay.value ? 'day.jpg' : '/night.jpg'}") no-repeat top center fixed; -webkit-background-size: cover; -moz-background-size: cover; background-size: cover; -o-background-size: cover; min-height: 100%;`
    })
    const bStyle = computed(() => {
      return `background: url("/background-one.jpg") no-repeat top center fixed; -webkit-background-size: cover; -moz-background-size: cover; background-size: cover; -o-background-size: cover; min-height: 100%;`
    })
    const sfxNight = useSound('/night.mp3')
    const sfxBells = useSound('/bells.mp3')
    const sfxHunt = useSound('/hunt.mp3')
    const sfxMorning = useSound('/morning.mp3')
    const sfxWolf = useSound('/night-wolf.mp3')

    const bibleReference: Ref<string | null> = ref(null)
    const color: Ref<string | null> = ref(null)

  const day = ref(0)
  const second: Ref<number> = ref(0)
  const isPaused = ref(false)
  
  const isDay = ref(false)
  const signalr = useSignalR()
  
  const shopItemOptions: Ref<DNCShopItem[]> = ref([
    {
      itemName: 'Sheet of Paper',
      description: 'If it has lines on it, you might fill those lines in with color.  If plain, could help set a scene.',
      cost: 2
    },
    {
      itemName: 'A4 Paper In Team Colour',
      description: 'Good for creating hats with.  Hats give you powers.',
      cost: 2
    },
    {
      itemName: '1 X Sticky Note',
      description: 'Handy for launching into your team jug.',
      cost: 1
    },
    {
      itemName: 'Nerf Gun',
      description: 'Foam-shooting gun.  Useful for scoring points.  But you will go to jail if you shoot other players.',
      cost: 10
    },
    {
      itemName: 'Table Tennis Ball',
      description: 'Fully-enclosed plastic circle.  Good for bouncing 5 times on a table and moving around with a spoon.',
      cost: 5
    },
    {
      itemName: '5 X Playing Cards',
      description: 'They say if you place 2 cards together like a teepee and then another 2 cards beside them, you can lay 1 card horizontally on top and score some points.',
      cost: 5
    },
    {
      itemName: '1 X Wooden Skewer',
      description: 'For building tall towers',
      cost: 2
    },
    {
      itemName: '1 X Rubber Band',
      description: 'For building tall towers',
      cost: 1
    },
    { 
      itemName: '3 X Pencils',
      description: 'Apparently pencils can be used to color things in.',
      cost: 5
    },
    {
      itemName: '1 X Small Bubble Dispenser',
      description: 'Good for distracting other players with.',
      cost: 5
    },
    {
      itemName: '1 X Large Bubble Dispenser',
      description: 'Good for distracting other players with.',
      cost: 15
    },
    {
      itemName: '1 X Playdough',
      description: '1 small tub of playdough is pretty cool for setting scenes.',
      cost: 5
    },
    {
      itemName: 'Spoon',
      description: 'A favourite tool for consuming dessert.  ...and also moving balls to the wall and back to score points.',
      cost: 5
    },
    {
      itemName: 'Straw',
      description: 'Suck it up!  No.  Really.  Straws are handy when turning book pages or moving balls around.',
      cost: 5
    },
    {
      itemName: 'Nocturnal Hat',
      description: 'Apparently wearing this hat makes you nocturnal - hiding in day and active at night.',
      cost: 15
    }
  ])

  const activityOptions: Ref<DNCActivity[]> = ref([
    {
      activityName: 'Wall Tap - 1 Per Person Per Day',
      description: 'Tap the wall on the other side of the building',
      points: 1
    },
    {
      activityName: 'Ball In A Box - Unlimited',
      description: 'Throw the ball in the box from behind the line',
      points: 1
    },
    {
      activityName: 'Ball In A Jug',
      description: 'Throw the table tennis ball in your team jug from behind the line.  Do not retrieve your ball once in the jug.',
      points: 10
    },
    {
      activityName: 'Sticky Note In A Jug',
      description: 'Throw a sticky note into your team jug from behind the line.  Do not retrieve your note once in the jug.',
      points: 7
    },
    {
      activityName: 'Ball Bouncer - Unlimited',
      description: 'Launch table tennis ball so it bounces on the table 5 times and then lands off the table',
      points: 3
    },
    {
      activityName: 'Bad Colouring In',
      description: 'Colour in a number section of a page like a 2-year-old - not very neatly at all.  You can do it at nighttime too!',
      points: 3
    },
    {
      activityName: 'Fly, sticky note, fly!',
      description: 'Using the fan, launch a sticky note into an area to score points',
      points: 5
    },
    {
      activityName: 'OK Colouring In',
      description: 'Colour in a number section of a page like a 5-year-old - you respect the lines, but have room for improvement.  You can do it at nighttime too!',
      points: 7
    },
    {
      activityName: 'Michelangelo!',
      description: 'Colour in a number section of a page like a Michelangelo - your use of color and neatness cannot be surpassed.  You can do it at nighttime too!',
      points: 20
    },
    {
      activityName: 'The Devourer of Foodstuffs',
      description: 'Each item you devour in given order gives you points',
      points: 5
    },
    {
      activityName: 'Nerf Shooter',
      description: 'Shoot nerf bullets into your team container.  Do not retrive the bullets once in container.  Return gun once all bullets in container.',
      points: 10
    },
    {
      activityName: 'Card Pyramid Building - End Of Day',
      description: 'Tallest pyramid by end of day scores 10 points for team. Equal height divides points up.',
      points: 10
    },
    {
      activityName: 'Tower Building - End Of Game',
      description: 'Build a tower that stands tallest at the end of the game.',
      points: 50
    },
    {
      activityName: 'Bible Verse Search - 1 Per Day',
      description: 'Find the Bible Reference in the Bible',
      points: 10
    },
    {
      activityName: 'Ball & Spoon - Unlimited',
      description: 'Put a ball on your spoon and walk to the old church door and back',
      points: 2
    },
    {
      activityName: 'Paper Plane Landing',
      description: 'Land a paper plane on the runway.',
      points: 7
    },
    {
      activityName: 'Origami',
      description: 'Make something unique and spectacular from an A4 sheet of paper and place on your team table',
      points: 6
    },
    {
      activityName: 'Straw Transport - Unlimited',
      description: 'Turn the pages of your team book.  At the end of the game the amount of pages turned (divided by 5) will be added to your score.',
      points: 0
    },
    {
      activityName: 'Jail Break! - 1 Per Day',
      description: 'Free your teammates from jail by scoring over 120 points without internet',
      points: 0
    },
    {
      activityName: 'Scene Building - First Place!',
      description: 'Create the scene of Nehemiah 8.  Coming in at first place.',
      points: 100
    },
    {
      activityName: 'Scene Building - Second Place!',
      description: 'Create the scene of Nehemiah 8.  Coming in at second place.',
      points: 50
    },
    {
      activityName: 'Scene Building - Third Place!',
      description: 'Create the scene of Nehemiah 8.  Coming in at third place.',
      points: 25
    }
  ])

  // const msg = ref('')
  // const showMsg = ref(false)

  const winners = computed(() => {
    var vGame = toValue(game)

    if (vGame != null) {
      const teams = [...(vGame.teams ?? [])]
      return teams.sort(firstBy(x => x.score, 'desc'))
    }
    
    return []
  })
  
  signalr.on('Update', (state: DNCGameData) => {
    newGameMsg.value = null
    newTeamName.value = null
    loadingMsg.value = null

    const vGame = toValue(game)

    if (vGame == null) {
      //joined game
      startTimer(state)
    }
    else {
      if (vGame.startedOn == null && state.startedOn != null) {
        //start timer
        startTimer(state)
      }
      else if (vGame?.startedOn != null && state.startedOn == null) {
        isPaused.value = true;
      }
    }
    
    game.value = state;
  })

  const possibleReferences = [
    'Genesis 34:7',
    'Psalm 119:103',
    'Matthew 24:6',
    '1 Thessalonians 3:1',
    '2 Samuel 4:6',
    '1 Samuel 17:59',
    '1 Kings 8:9',
    'Ezekiel 18:31',
    'Acts 2:28',
    'Nehemiah 1:1',
    'Revelation 17:8',
    'Hosea 2:20',
    '1 Peter 1:3',
    'Proverbs 4:5',
    'Joshua 24:15'
  ]

  const colors = [
    'blue',
    'green',
    'red'
  ]

  function create() {
    signalr.invoke('CreateGame', newGame.value);
    newGameMsg.value = 'Creating Game'
  }

  async function leaveGame() {
    if (game.value) {
      try {
        await signalr.invoke('ExitGame', game.value.id);
        router.push({ name: 'home' })
      }
      catch (err) {
        toast(JSON.stringify(err))
        // msg.value = err as string
      }
    }
    
  }

  function joinGame() {
    signalr.invoke('JoinGame', { gameCode: joinGameCode.value })
    newGameMsg.value = 'Joining Game'
  }

  function setGameSettings() {
    const vGame = toValue(game)

    if (vGame != null) {
      signalr.invoke('UpdateSettings', { id: vGame.id, days: vGame.days, dayLength: vGame.dayLength, specialDay: vGame.specialDay });
      loadingMsg.value = 'Updating Settings';
    }
    
  }

  function startGame() {
    if (game.value) {
      loadingMsg.value = 'Starting Game'
      signalr.invoke('StartGame', game.value.id)
    }

  }

  function pauseGame() {
    if (game.value) {
      loadingMsg.value = 'Pausing Game'
      signalr.invoke('PauseGame', { id: game.value.id, currentDay: day.value, currentSecond: second.value ?? 0, isDay: isDay.value })
    }
  }

  function changeBible() {
    if (isDay.value) {
      bibleReference.value = possibleReferences[random(0, possibleReferences.length - 1)]
    }
    else {
      bibleReference.value = '(.....)'
    }
  }

  function changeColor() {
    if (!isDay.value) {
      color.value = colors[random(0, colors.length - 1)]
    }
    else {
      color.value = 'transparent'
    }
  }

  function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function toggleToDay() {
    isDay.value = true
    theme.global.name.value = 'light'
    
    stopSounds()
    tryPlayDaySound()

    changeBible()
    changeColor()
  }

  function toggleToNight() {
    isDay.value = false
    theme.global.name.value = 'dark'

    showSpecialDay.value = false

    stopSounds()
    tryPlayNightSound()
    tryPlayWolfSound()
  
    changeBible()
    changeColor()
  }

  function addTeam() {
    const vGame = toValue(game)
    // const myColors = ['blue', 'green', 'red', 'yellow']
    if (vGame) {
      // var newColor = myColors.filter(c => vGame.teams?.some(t => t.color == c))
      signalr.invoke('AddTeam', { gameID: vGame.id, teamName: newTeamName.value, color: newTeamColor.value })
    }
  }

  function removeTeam(team: DNCTeamState) {
    if (game.value)
    signalr.invoke('RemoveTeam', { gameID: game.value?.id, teamName: team.teamName })
  }

  function toggleActivity(activity: DNCActivity) {
    if (game.value) {
      if (game.value.activities?.some(x => x.activityName == activity.activityName)) {
        //remove
        signalr.invoke('RemoveActivity', { gameID: game.value?.id, ...activity });
      }
      else {
        //add
        signalr.invoke('AddActivity', { gameID: game.value?.id, ...activity });
      }
    }
  }

  function toggleShopItem(shopItem: DNCShopItem) {
    if (game.value) {
      if (game.value.shopItems?.some(x => x.itemName == shopItem.itemName)) {
        //remove
        signalr.invoke('RemoveShopItem', { gameID: game.value?.id, ...shopItem });
      }
      else {
        //add
        signalr.invoke('AddShopItem', { gameID: game.value?.id, ...shopItem });
      }
    }
  }

  function addScore(team: DNCTeamState, points: number) {
    signalr.invoke('UpdateScore', {
      color: team.color,
      teamName: team.teamName,
      scoreAdjustment: points,
      id: game.value?.id
    })
    
    toast(`Added ${points} point${points == 1 ? '' : 's'} to ${team.teamName}`)

    // msg.value = 'Done'
    // showMsg.value = true
  }

  function reset() {
    const vGame = toValue(game)
    if (vGame != null)
      signalr.invoke('RestartGame', { id: vGame.id })
  }

  function startTimer(vGame: DNCGameData) {
    if (vGame != null) {
      var d = DateTime.fromISO(vGame.startedOn)
      var dif = DateTime.now().diff(d, 'seconds').toObject().seconds
      
      var diffSeconds = Math.ceil(dif ?? 0);
      vGame.currentSecond ??= 0

      // dayGoal.value = vGame.days
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

  function stopSounds() {
    sfxBells.stop()
    sfxNight.stop()
    sfxHunt.stop()
    sfxMorning.stop()
    sfxWolf.stop()
  }

  function tryPlayNightSound() {
    if (playSounds.value)
      sfxNight.play()
  }

  function tryPlayBellSound() {
    if (playSounds.value)
      sfxBells.play()
  }

  function tryPlayDaySound() {
    if (playSounds.value)
      sfxMorning.play()
  }

  function tryPlayHuntSound() {
    if (playSounds.value)
      sfxHunt.play()
  }

  function tryPlayWolfSound() {
    if (playSounds.value)
      sfxWolf.play()
  }

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