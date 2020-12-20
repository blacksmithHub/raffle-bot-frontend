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
            v-text="`${mode} profile`"
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
              label="Profile Name (optional)"
              required
              outlined
              dense
              autocomplete="off"
              clearable
            />

            <v-row>
              <v-col class="pt-0 pb-0">
                <v-text-field
                  v-model="firstName"
                  label="First Name"
                  required
                  outlined
                  dense
                  autocomplete="off"
                  :error-messages="firstNameErrors"
                  clearable
                  @blur="$v.firstName.$touch()"
                />
              </v-col>

              <v-col class="pt-0 pb-0">
                <v-text-field
                  v-model="lastName"
                  label="Last Name"
                  required
                  outlined
                  dense
                  autocomplete="off"
                  :error-messages="lastNameErrors"
                  clearable
                  @blur="$v.lastName.$touch()"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col class="pt-0 pb-0">
                <v-text-field
                  v-model="email"
                  label="Email"
                  required
                  outlined
                  dense
                  autocomplete="off"
                  :error-messages="emailErrors"
                  clearable
                  @blur="$v.email.$touch()"
                />
              </v-col>

              <v-col class="pt-0 pb-0">
                <v-text-field
                  v-model="number"
                  label="Phone Number"
                  required
                  outlined
                  dense
                  autocomplete="off"
                  :error-messages="numberErrors"
                  clearable
                  @blur="$v.number.$touch()"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col class="pt-0 pb-0">
                <v-autocomplete
                  v-model="country"
                  required
                  :error-messages="countryErrors"
                  clearable
                  :items="countries"
                  outlined
                  dense
                  label="Country"
                  item-text="name"
                  return-object
                  @blur="$v.country.$touch()"
                  @change="onCountryChange"
                />
              </v-col>

              <v-col class="pt-0 pb-0">
                <v-autocomplete
                  v-model="region"
                  required
                  :error-messages="regionErrors"
                  clearable
                  :items="allRegions"
                  outlined
                  dense
                  label="Region"
                  item-text="name"
                  return-object
                  @blur="$v.region.$touch()"
                  @change="onRegionChange"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="address1"
              label="Address Line 1"
              required
              outlined
              dense
              autocomplete="off"
              :error-messages="address1Errors"
              clearable
              @blur="$v.address1.$touch()"
            />

            <v-text-field
              v-model="address2"
              label="Address Line 2"
              required
              outlined
              dense
              autocomplete="off"
              clearable
            />

            <v-row>
              <v-col class="pt-0 pb-0">
                <v-autocomplete
                  v-model="city"
                  required
                  :error-messages="cityErrors"
                  clearable
                  :items="allCities"
                  outlined
                  dense
                  label="City"
                  item-text="name"
                  return-object
                  @blur="$v.city.$touch()"
                  @change="onCityChange"
                />
              </v-col>

              <v-col class="pt-0 pb-0">
                <v-text-field
                  v-model="zipCode"
                  label="Zip Code"
                  required
                  outlined
                  dense
                  autocomplete="off"
                  :error-messages="zipCodeErrors"
                  clearable
                  @blur="$v.zipCode.$touch()"
                />
              </v-col>
            </v-row>

            <strong
              class="text-capitalize"
              v-text="'gender'"
            />
            <v-radio-group
              v-model="gender"
              row
              dense
            >
              <v-radio
                label="Male"
                :value="1"
              />
              <v-radio
                label="Female"
                :value="2"
              />
            </v-radio-group>
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
import { required, email, maxLength, minLength } from 'vuelidate/lib/validators'
import Constant from '@/config/constant'

export default {
  data () {
    return {
      id: null,
      dialog: false,
      name: '',
      mode: 'new',
      email: '',
      firstName: '',
      lastName: '',
      gender: Constant.PROFILE.GENDER.MALE,
      number: '',
      country: {},
      region: {},
      city: {},
      address1: '',
      address2: '',
      zipCode: ''
    }
  },
  computed: {
    ...mapState('country', { countries: 'items' }),
    ...mapState('city', { cities: 'items' }),
    ...mapState('region', { regions: 'items' }),
    /**
     * Return all cities
     */
    allCities () {
      return (Object.keys(this.region).length) ? this.cities.filter((val) => val.region_id === this.region.id) : []
    },
    /**
     * Return all regions
     */
    allRegions () {
      return (Object.keys(this.country).length) ? this.regions.filter((val) => val.country_id === this.country.id) : []
    },
    /**
     * Error messages for email.
     *
     */
    emailErrors () {
      const errors = []

      if (!this.$v.email.$dirty) return errors

      this.$v.email.required || errors.push('Required')
      this.$v.email.email || errors.push('Invalid email')

      return errors
    },
    /**
     * Error messages for firstName.
     *
     */
    firstNameErrors () {
      const errors = []

      if (!this.$v.firstName.$dirty) return errors

      this.$v.firstName.required || errors.push('Required')

      return errors
    },
    /**
     * Error messages for lastName.
     *
     */
    lastNameErrors () {
      const errors = []

      if (!this.$v.lastName.$dirty) return errors

      this.$v.lastName.required || errors.push('Required')

      return errors
    },
    /**
     * Error messages for number.
     *
     */
    numberErrors () {
      const errors = []

      if (!this.$v.number.$dirty) return errors

      this.$v.number.required || errors.push('Required')
      this.$v.number.maxLength || errors.push('Accepts only 11 digits')
      this.$v.number.minLength || errors.push('Accepts only 11 digits')

      return errors
    },
    /**
     * Error messages for zipCode.
     *
     */
    zipCodeErrors () {
      const errors = []

      if (!this.$v.zipCode.$dirty) return errors

      this.$v.zipCode.required || errors.push('Required')
      this.$v.zipCode.maxLength || errors.push('Accepts only 4 digits')
      this.$v.zipCode.minLength || errors.push('Accepts only 4 digits')

      return errors
    },
    /**
     * Error messages for country.
     *
     */
    countryErrors () {
      const errors = []

      if (!this.$v.country.$dirty) return errors

      this.$v.country.required || errors.push('Required')

      return errors
    },
    /**
     * Error messages for city.
     *
     */
    cityErrors () {
      const errors = []

      if (!this.$v.city.$dirty) return errors

      this.$v.city.required || errors.push('Required')

      return errors
    },
    /**
     * Error messages for region.
     *
     */
    regionErrors () {
      const errors = []

      if (!this.$v.region.$dirty) return errors

      this.$v.region.required || errors.push('Required')

      return errors
    },
    /**
     * Error messages for address1.
     *
     */
    address1Errors () {
      const errors = []

      if (!this.$v.address1.$dirty) return errors

      this.$v.address1.required || errors.push('Required')

      return errors
    }
  },
  methods: {
    ...mapActions('profile', { addProfile: 'addItem', updateProfile: 'updateItem' }),
    /**
     * map selected task
     */
    mapData (item) {
      this.id = item.id
      this.mode = 'edit'
      this.name = item.name
      this.email = item.email
      this.firstName = item.firstName
      this.lastName = item.lastName
      this.gender = item.gender
      this.number = item.number
      this.country = item.country
      this.region = item.region
      this.city = item.city
      this.address1 = item.address1
      this.address2 = item.address2
      this.zipCode = item.zipCode
      this.dialog = true
    },
    /**
     * on submit event
     */
    submit () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        const params = {
          name: this.name,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          gender: this.gender,
          number: this.number,
          country: this.country,
          region: this.region,
          city: this.city,
          address1: this.address1,
          address2: this.address2,
          zipCode: this.zipCode
        }

        if (this.mode === 'new') {
          this.addProfile(params)
        } else {
          params.id = this.id
          this.updateProfile(params)
        }

        this.onClose()
      }
    },
    /**
     * on close dialog event
     */
    onClose () {
      this.$v.$reset()

      this.id = null
      this.mode = 'new'
      this.name = ''
      this.email = ''
      this.firstName = ''
      this.lastName = ''
      this.gender = Constant.PROFILE.GENDER.MALE
      this.number = ''
      this.country = {}
      this.region = {}
      this.city = {}
      this.address1 = ''
      this.address2 = ''
      this.zipCode = ''
      this.dialog = true

      this.dialog = false
    },
    /**
     * on country field change event
     */
    onCountryChange () {
      if (!this.country) this.country = {}
    },
    /**
     * on city field change event
     */
    onCityChange () {
      if (!this.city) this.city = {}
    },
    /**
     * on region field change event
     */
    onRegionChange () {
      if (!this.region) this.region = {}
    }
  },
  validations: {
    email: { required, email },
    firstName: { required },
    lastName: { required },
    number: { required, maxLength: maxLength(11), minLength: minLength(11) },
    zipCode: { required, maxLength: maxLength(4), minLength: minLength(4) },
    country: { required },
    city: { required },
    address1: { required },
    region: { required }
  }
}
</script>
