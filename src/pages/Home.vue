<template>
  <v-app>
    <SystemBar />
    <v-app-bar
      app
      flat
    >
      <v-img
        :src="require('@/assets/icon.png')"
        contain
        width="45"
      />

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

      <v-avatar size="32">
        <v-img
          :src="require('@/assets/placeholder.png')"
          contain
          width="45"
        />
      </v-avatar>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
import SystemBar from '@/components/App/SystemBar'
import Footer from '@/components/App/Footer'

export default {
  components: { SystemBar, Footer },
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
          name: 'Accounts',
          route: '/accounts'
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
