<template>
  <div>
    <v-combobox
      v-model="sequence"
      chips
      small-chips
      deletable-chips
      clearable
      label="Sequence"
      multiple
      outlined
      dense
      append-icon=""
      :error-messages="sequenceErrors"
      hint="Press Enter/Tab per input to apply"
      @blur="$v.sequence.$touch()"
    />
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      sequence: []
    }
  },
  computed: {
    /**
     * Error messages for sequence.
     *
     */
    sequenceErrors () {
      const errors = []

      if (!this.$v.sequence.$dirty) return errors

      this.$v.sequence.required || errors.push('Required')

      return errors
    }
  },
  validations: {
    sequence: { required }
  }
}
</script>
