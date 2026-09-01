<template>
  <v-app>
    <v-main>
      <router-view />
      <VSonner position="bottom-center" />
      <BTDialogSelect />
      <BTDialogNumber />
      <BTDialogDate />
      <BTDialogConfirm />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { VSonner } from 'vuetify-sonner'
  import { BTDialogConfirm, BTDialogDate, BTDialogSelect, BTDialogNumber } from 'bt-core-app/components'
  
</script>