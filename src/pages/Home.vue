<template>
  <v-app>
    <SystemBar />
    <v-app-bar
      app
      flat
    >
      <v-tabs
        centered
        class="ml-n9"
      >
        <v-tab
          v-for="(tab, index) in tabs"
          :key="index"
          :to="tab.route"
        >
          {{ tab.name }}
        </v-tab>
      </v-tabs>

      <v-avatar
        color="grey darken-1 shrink"
        size="32"
      />
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import SystemBar from '@/components/App/SystemBar'

export default {
  components: { SystemBar },
  data () {
    return {
      tabs: [
        {
          name: 'Tasks',
          route: '/'
        },
        {
          name: 'Profiles',
          route: '/profiles'
        },
        {
          name: 'Proxies',
          route: '/proxies'
        },
        {
          name: 'Settings',
          route: '/settings'
        }
      ]
    }
  }
}
</script>
