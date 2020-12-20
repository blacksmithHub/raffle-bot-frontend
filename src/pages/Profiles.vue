<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-btn
          rounded
          class="primary"
          small
          @click="addProfile"
        >
          <v-icon
            left
            v-text="'mdi-plus'"
          />
          add profile
        </v-btn>
      </v-card-title>

      <v-card-text style="max-height: 49vh; overflow: auto">
        <v-data-table
          :headers="headers"
          :items="profiles"
          hide-default-footer
        >
          <template v-slot:item.gender="{ item }">
            <span v-text="getGender(item)" />
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              fab
              x-small
              class="mr-2 primary"
              @click="editProfile(item)"
            >
              <v-icon
                small
                v-text="'mdi-pencil'"
              />
            </v-btn>

            <v-btn
              fab
              x-small
              class="mr-2 error"
              @click="deleteProfile(item)"
            >
              <v-icon
                small
                v-text="'mdi-delete'"
              />
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <ProfileDialog ref="profileDialog" />
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import ProfileDialog from '@/components/Dialogs/Profile'
import Constant from '@/config/constant'

export default {
  components: { ProfileDialog },
  data () {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Country', value: 'country.name' },
        { text: 'Gender', value: 'gender', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ]
    }
  },
  computed: {
    ...mapState('profile', { profiles: 'items' })
  },
  methods: {
    ...mapActions('profile', { deleteProfile: 'deleteItem', reset: 'reset' }),
    /**
     * return gender
     */
    getGender (item) {
      return (item.gender === Constant.PROFILE.GENDER.MALE) ? 'Male' : 'Female'
    },
    /**
     * on add profile event
     */
    addProfile () {
      this.$refs.profileDialog.dialog = true
    },
    /**
     * on edit profile event
     */
    editProfile (item) {
      this.$refs.profileDialog.mapData(item)
    }
  }
}
</script>
