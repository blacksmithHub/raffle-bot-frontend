<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-btn
          rounded
          class="primary"
          small
          @click="addAccount"
        >
          <v-icon
            left
            v-text="'mdi-plus'"
          />
          add account
        </v-btn>
      </v-card-title>

      <v-card-text style="max-height: 49vh; overflow: auto">
        <v-data-table
          :headers="headers"
          :items="accounts"
          hide-default-footer
        >
          <template v-slot:item.actions="{ item }">
            <v-btn
              fab
              x-small
              class="mr-2 primary"
              @click="editAccount(item)"
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
              @click="deleteAccount(item)"
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

    <AccountDialog ref="accountDialog" />
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import AccountDialog from '@/components/Dialogs/Account'

export default {
  components: { AccountDialog },
  data () {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ]
    }
  },
  computed: {
    ...mapState('account', { accounts: 'items' })
  },
  methods: {
    ...mapActions('account', { deleteAccount: 'deleteItem', reset: 'reset' }),
    /**
     * on add account event
     */
    addAccount () {
      this.$refs.accountDialog.dialog = true
    },
    /**
     * on edit account event
     */
    editAccount (item) {
      this.$refs.accountDialog.mapData(item)
    }
  }
}
</script>
