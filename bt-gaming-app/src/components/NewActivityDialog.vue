<template>
    <v-dialog
        fullscreen
        transition="dialog-bottom-transition"
        v-model="dialog">
        <v-toolbar color="primary">
            <v-btn icon="$close" @click="dialog = false"/>
            <div class="text-h6">New Activity</div>
            <v-spacer />
            <v-btn text="Done" @click.stop="finishActivity" />
        </v-toolbar>
        <v-card>
            <v-row>
                <v-col cols="12" sm="6">
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
                <v-col cols="12" sm="6">
                    <v-list>
                        <v-list-subheader>Shop Items</v-list-subheader>
                        <v-col>
                            <div class="text-caption mb-2">(Items that are needed in order to complete this activity)</div>
                            <v-btn block prepend-icon="$plus" text="Add Shop Item" @click="newActivity.shopItems?.unshift({ itemName: `Shop Item ${(newActivity.shopItems.length ?? 0) + 1}`, cost: 0 })" />
                        </v-col>
                        <v-slide-y-transition hide-on-leave group>
                            <v-card v-for="(shopItem, ind) in newActivity.shopItems" :key="ind"
                                class="my-1"
                                :title="shopItem.itemName">
                                <template #append>
                                    <div class="d-flex flex-column align-center">
                                        <bt-span class="text-body-1" :value="shopItem.cost" filter="toDisplayNumber" />
                                        <div class="text-caption">Points</div>
                                    </div>
                                </template>
                                <template #prepend>
                                    <v-btn
                                        @click="remove(shopItem)"
                                        class="text-error"
                                        icon="$delete"
                                        size="small"
                                        variant="text" />
                                </template>
                                <template #text>
                                    <bt-field-string
                                        isEditing
                                        label="Shop Item Name"
                                        sm="12"
                                        v-model="shopItem.itemName" />

                                    <bt-field-string
                                        isEditing
                                        label="Cost"
                                        sm="12"
                                        type="number"
                                        v-model.number="shopItem.cost" />

                                    <bt-field-text-area
                                        isEditing
                                        label="Description"
                                        sm="12"
                                        v-model="shopItem.description" />

                                </template>
                            </v-card>
                        </v-slide-y-transition>
                    </v-list>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { DNCActivity, DNCShopItem } from '@/dnc-types';
import { ref, watch } from 'vue';


    const props = defineProps<{
        showToggle?: boolean
    }>()

    const emits = defineEmits(['selected'])
    
    const dialog = ref(false)
    const newActivity = ref<DNCActivity>({})

    function finishActivity() {
        emits('selected', newActivity.value)
        dialog.value = false
    }

    function remove(sItem: DNCShopItem) {
        newActivity.value.shopItems = newActivity.value.shopItems?.filter(x => x !== sItem)
    }

    watch(() => props.showToggle, () => {
        dialog.value = true
        newActivity.value = {
            points: 5,
            shopItems: []
        }
    })
</script>