<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600px"
  >
    <v-form @submit.prevent="submit">
      <v-card>
        <v-card-title>
          <span
            class="headline text-capitalize"
            v-text="`${mode} task`"
          />

          <v-spacer />

          <v-btn
            icon
            @click="onClose"
          >
            <v-icon v-text="'mdi-close'" />
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col class="pt-0 pb-0">
                <v-autocomplete
                  v-model="store"
                  required
                  :error-messages="storeErrors"
                  clearable
                  :items="stores"
                  outlined
                  dense
                  label="Store"
                  item-text="name"
                  return-object
                  @blur="$v.store.$touch()"
                  @change="onStoreChange"
                />
              </v-col>

              <v-col class="pt-0 pb-0">
                <v-autocomplete
                  v-model="proxy"
                  required
                  clearable
                  :items="proxies"
                  outlined
                  dense
                  label="Proxies (optional)"
                  item-text="name"
                  return-object
                  @change="onProxyChange"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col class="pt-0 pb-0">
                <v-autocomplete
                  v-model="profile"
                  required
                  :error-messages="profileErrors"
                  clearable
                  :items="profiles"
                  outlined
                  dense
                  label="Profile"
                  item-text="name"
                  return-object
                  @blur="$v.profile.$touch()"
                  @change="onProfileChange"
                />
              </v-col>

              <v-col class="pt-0 pb-0">
                <v-autocomplete
                  v-model="account"
                  required
                  :error-messages="accountErrors"
                  clearable
                  :items="accounts"
                  outlined
                  dense
                  label="Accounts"
                  item-text="name"
                  return-object
                  @blur="$v.account.$touch()"
                  @change="onAccountChange"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="url"
              label="URL"
              required
              outlined
              dense
              autocomplete="off"
              :error-messages="urlErrors"
              clearable
              @blur="$v.url.$touch()"
            />

            <div v-if="Object.keys(store).length">
              <Titan22
                v-if="store.id === 1"
                ref="titan22"
              />
            </div>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-container class="text-right">
            <v-btn
              class="mr-2"
              rounded
              small
              @click="onClose"
              v-text="'Close'"
            />
            <v-btn
              class="primary"
              rounded
              type="submit"
              small
              v-text="'Save'"
            />
          </v-container>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { required, url } from 'vuelidate/lib/validators'

import Titan22 from '@/components/Forms/Titan22'

export default {
  components: {
    Titan22
  },
  data () {
    return {
      id: null,
      dialog: false,
      store: {},
      proxy: {},
      profile: {},
      account: {},
      url: '',
      mode: 'new'
    }
  },
  computed: {
    ...mapState('store', { stores: 'items' }),
    ...mapState('proxy', { proxies: 'items' }),
    ...mapState('profile', { profiles: 'items' }),
    ...mapState('account', { accounts: 'items' }),
    /**
     * Error messages for store.
     *
     */
    storeErrors () {
      const errors = []

      if (!this.$v.store.$dirty) return errors

      this.$v.store.required || errors.push('Required')

      return errors
    },
    /**
     * Error messages for profile.
     *
     */
    profileErrors () {
      const errors = []

      if (!this.$v.profile.$dirty) return errors

      this.$v.profile.required || errors.push('Required')

      return errors
    },
    /**
     * Error messages for account.
     *
     */
    accountErrors () {
      const errors = []

      if (!this.$v.account.$dirty) return errors

      this.$v.account.required || errors.push('Required')

      return errors
    },
    /**
     * Error messages for url.
     *
     */
    urlErrors () {
      const errors = []

      if (!this.$v.url.$dirty) return errors

      this.$v.url.required || errors.push('Required')
      this.$v.url.url || errors.push('Invalid URL')

      return errors
    }
  },
  methods: {
    ...mapActions('task', { addTask: 'addItem', updateTask: 'updateItem' }),
    /**
     * map selected task
     */
    mapData (item) {
      this.id = item.id
      this.store = item.store
      this.proxy = item.proxy
      this.profile = item.profile
      this.account = item.account
      this.url = item.url
      this.mode = 'edit'
      this.dialog = true
    },
    /**
     * on submit event
     */
    submit () {
      this.$v.$touch()

      if (this.$refs.titan22) this.$refs.titan22.$v.$touch()

      if (!this.$v.$invalid &&
      (this.$refs.titan22 && !this.$refs.titan22.$v.$invalid)) {
        const params = {
          url: this.url,
          store: this.store,
          proxy: this.proxy,
          profile: this.profile,
          account: this.account,
          success: 0,
          delays: 3200,
          status: {
            id: 1,
            msg: 'stopped',
            class: 'grey'
          },
          elapse: '00:00:00'
        }

        if (this.mode === 'new') {
          this.addTask(params)
        } else {
          params.id = this.id
          this.updateTask(params)
        }
      }
    },
    /**
     * on close dialog event
     */
    onClose () {
      this.$v.$reset()
      this.id = null
      this.store = {}
      this.store = {}
      this.proxy = {}
      this.profile = {}
      this.account = {}
      this.url = ''
      this.mode = 'new'

      if (this.$refs.titan22) {
        this.$refs.titan22.$v.$reset()
        this.$refs.titan22.sequence = []
      }

      this.dialog = false
    },
    /**
     * on store field change event
     */
    onStoreChange () {
      if (!this.store) this.store = {}
    },
    /**
     * on proxy field change event
     */
    onProxyChange () {
      if (!this.proxy) this.proxy = {}
    },
    /**
     * on profile field change event
     */
    onProfileChange () {
      if (!this.profile) this.profile = {}
    },
    /**
     * on account field change event
     */
    onAccountChange () {
      if (!this.account) this.account = {}
    }
  },
  validations: {
    store: { required },
    profile: { required },
    account: { required },
    url: { required, url }
  }
}
</script>
