<template>
  <v-container :style="containerStyle" fluid>
    <v-container>
      <v-card style="background: rgba(0, 0, 0, 0.75);" class="ma-4 pa-4">
        <v-row>
          <v-col cols="12">
            <v-list-subheader>Games</v-list-subheader>
            <v-divider class="my-1" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-card
              title="Day & Night"
              text="A game of skill and teamwork.">
              <template #actions>
                <v-spacer />
                <v-btn :to="{ name: 'dnc' }" append-icon="$arrow-right">Play</v-btn>
              </template>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
      <v-card style="background: rgba(0, 0, 0, 0.75);" class="ma-4 pa-4">
        <v-row>
          <v-col cols="12">
            <v-list-subheader>Tools</v-list-subheader>
            <v-divider class="my-1" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-card
              title="Scorebard"
              text="For any kind of scoring on a screen.">
              <template #actions>
                <v-spacer />
                <v-btn :to="{ name: 'scoreboard' }" append-icon="$arrow-right">Open</v-btn>
              </template>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-container>
</template>

<script lang="ts" setup>
  const containerStyle = `background: url("/background-one.jpg") no-repeat top center fixed; -webkit-background-size: cover; -moz-background-size: cover; background-size: cover; -o-background-size: cover; min-height: 100%;`;
</script>