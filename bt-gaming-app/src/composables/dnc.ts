import { DNCActivity, DNCShopItem } from "@/dnc-types"
import { useSound } from "@vueuse/sound"
import { ref } from "vue"

// // src/services/dncService.ts
// const API_BASE = 'http://127.0.0.1:8000/api/dnc';
// const WS_BASE = 'ws://127.0.0.1:8000/api/dnc/ws';

// export const dncService = {
//   async createGame(payload: DNCNewGame): Promise<DNCGameData> {
//     const res = await fetch(`${API_BASE}/create`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });
//     return await res.json() as DNCGameData;
//   },

//   async joinGame(gameCode: string): Promise<DNCGameData> {
//     const res = await fetch(`${API_BASE}/join`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ gameCode })
//     });
//     return res.json() as Promise<DNCGameData>;
//   },

//   async updateSettings(payload: DNCUpdateGameSettings) {
//     return fetch(`${API_BASE}/settings`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });
//   },

//   async startGame(id: string) {
//     console.log('starting')
//     return fetch(`${API_BASE}/${id}/start`, { method: 'POST' });
//   },

//   async pauseGame(payload: DNCPauseGame) {
//     return fetch(`${API_BASE}/${payload.id}/pause`, { 
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });
//   },

//   async restartGame(id: string) {
//     return fetch(`${API_BASE}/${id}/restart`, { method: 'POST' });
//   },

//   async exitGame(id: string) {
//     return fetch(`${API_BASE}/${id}/exit`, { method: 'POST' });
//   },

//   async addTeam(gameID: string, teamName: string, color: string) {
//     return fetch(`${API_BASE}/${gameID}/teams`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ teamName, color })
//     });
//   },

//   async removeTeam(gameID: string, teamName: string) {
//     return fetch(`${API_BASE}/${gameID}/teams`, {
//       method: 'DELETE',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ teamName })
//     });
//   },

//   async updateScore(gameID: string, teamName: string, color: string, scoreAdjustment: number) {
//     return fetch(`${API_BASE}/${gameID}/score`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ teamName, color, scoreAdjustment })
//     });
//   },

//   connectWebSocket(gameId: string, onUpdate: (state: any) => void): WebSocket {
//     const ws = new WebSocket(`${WS_BASE}/${gameId}`);
//     ws.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       if (message.type === 'Update') {
//         onUpdate(message.game);
//       }
//     };
//     return ws;
//   }
// };

export const shopItemOptions: DNCShopItem[] = [
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
  ]

  export const activityOptions: DNCActivity[] = [
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
  ]

export function useDNCSounds() {
  const sfxNight = useSound('/night.mp3')
  const sfxBells = useSound('/bells.mp3')
  const sfxHunt = useSound('/hunt.mp3')
  const sfxMorning = useSound('/morning.mp3')
  const sfxWolf = useSound('/night-wolf.mp3')
  const playSounds = ref(false)

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

  return {
    stopSounds,
    playSounds,
    tryPlayBellSound,
    tryPlayDaySound,
    tryPlayHuntSound,
    tryPlayNightSound,
    tryPlayWolfSound
  }
  
}