export interface DNCActivity {
  id?: string
  activityName?: string
  description?: string
  points?: number
  // shopItems?: DNCShopItem[]
}

export interface DNCShopItem {
  id?: string
  itemName?: string
  description?: string
  cost?: number
}

export interface DNCTeamState {
  teamName?: string
  score: number
  scoringFactor: number
  color?: string
}

export interface DNCGameData {
  id: string
  gameCode?: string
  days: number
  dayLength: number
  specialDay?: number
  startedOn?: string
  currentDay: number
  currentSecond: number
  isDay: boolean
  createdOn?: string
  teams: DNCTeamState[]
  activities: DNCActivity[]
  shopItems: DNCShopItem[]
}

export interface DNCCreateGame {
  days: number
  dayLength: number
  specialDay: number
  activities: DNCActivity[]
  shopItems: DNCShopItem[]
  teams: DNCTeamState[]
}

export interface DNCJoinGame {
  gameCode?: string
}

export interface DNCPauseGame {
  id?: string
  currentDay: number
  currentSecond: number
  isDay: boolean
}

export interface DNCUpdateGameSettings {
  id?: string
  days: number
  dayLength: number
  specialDay?: number
  activities: DNCActivity[]
  shopItems: DNCShopItem[]
  teams: DNCTeamState[]
}

export interface DNCUpdateGameScore {
  id?: string
  teamName?: string
  scoreAdjustment: number
}