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
            v-text="`${mode} account`"
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
            <v-text-field
              v-model="name"
              label="Account Name (optional)"
              required
              outlined
              dense
              autocomplete="off"
              clearable
            />

            <v-textarea
              v-model="accounts"
              label="Accounts"
              required
              outlined
              dense
              hint="Insert account per line"
              autocomplete="off"
              auto-grow
              :error-messages="accountsErrors"
              placeholder="email:password"
              @blur="$v.accounts.$touch()"
              @change="onChange"
            />
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
import { mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      id: null,
      dialog: false,
      name: '',
      mode: 'new',
      pool: [],
      accounts: ''
    }
  },
  computed: {
    /**
     * Error messages for accounts.
     *
     */
    accountsErrors () {
      const errors = []

      if (!this.$v.accounts.$dirty) return errors

      this.$v.accounts.required || errors.push('Required')

      return errors
    }
  },
  watch: {
    pool () {
      if (this.pool.length) {
        this.accounts = []

        const pool = this.pool.slice().map((val) => {
          return `${val.email}:${val.password}`
        })

        this.accounts = pool.join('\n')
      }
    }
  },
  methods: {
    ...mapActions('account', { addAccount: 'addItem', updateAccount: 'updateItem' }),
    /**
     * map selected task
     */
    mapData (item) {
      this.id = item.id
      this.mode = 'edit'
      this.name = item.name
      this.pool = item.accounts

      this.accounts = []

      const pool = this.pool.slice().map((val) => {
        return `${val.email}:${val.password}`
      })

      this.accounts = pool.join('\n')

      this.dialog = true
    },
    /**
     * on submit event
     */
    submit () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        const params = {
          name: (this.name) ? this.name.trim() : '',
          accounts: this.pool
        }

        if (this.mode === 'new') {
          this.addAccount(params)
        } else {
          params.id = this.id
          this.updateAccount(params)
        }

        this.onClose()
      }
    },
    /**
     * on close dialog event
     */
    onClose () {
      this.reset()

      this.dialog = false
    },
    /**
     * reset all fields
     */
    reset () {
      this.$v.$reset()

      this.id = null
      this.mode = 'new'
      this.name = ''
      this.accounts = []
    },
    /**
     * on change event
     */
    onChange () {
      let accounts = this.accounts.split('\n')
      this.pool = []

      accounts = accounts.map(element => {
        const account = element.split(':')

        if (account.length === 2) {
          this.pool.push({
            email: account[0],
            password: account[1]
          })
        } else {
          element = ''
        }

        return element
      })

      if (accounts.length) {
        accounts = accounts.filter((val) => val)
        this.accounts = accounts.join('\n')
      }
    }
  },
  validations: {
    accounts: { required }
  }
}
</script>
