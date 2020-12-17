<template>
  <v-system-bar app>
    <v-btn
      icon
      x-small
      :ripple="false"
      @click="onClose"
    >
      <v-icon
        color="error"
        small
        v-text="'mdi-checkbox-blank-circle'"
      />
    </v-btn>

    <v-btn
      icon
      x-small
      :ripple="false"
      @click="onMinimize"
    >
      <v-icon
        color="warning"
        small
        v-text="'mdi-checkbox-blank-circle'"
      />
    </v-btn>

    <v-btn
      icon
      x-small
      :ripple="false"
      @click="onMaximize"
    >
      <v-icon
        color="success"
        small
        v-text="'mdi-checkbox-blank-circle'"
      />
    </v-btn>

    <v-row
      no-gutters
      class="titleBar"
      align="center"
      justify="center"
    >
      <v-col
        align-self="center"
        class="text-right"
      >
        <strong v-text="time" />
      </v-col>
    </v-row>
  </v-system-bar>
</template>

<script>
import { remote } from 'electron'

export default {
  data () {
    return {
      time: ''
    }
  },
  created () {
    this.timer()
  },
  methods: {
    timer () {
      const vm = this
      const loop = setTimeout(() => {
        vm.time = vm.$moment().format('h:mm:ss a')
        clearTimeout(loop)
        vm.timer()
      }, 1000)
    },
    onClose () {
      remote.getCurrentWindow().destroy()
    },
    onMaximize () {
      const win = remote.getCurrentWindow()

      if (!win.isMaximized()) {
        win.maximize()
      } else {
        win.unmaximize()
      }
    },
    onMinimize () {
      remote.getCurrentWindow().minimize()
    }
  }
}
</script>
