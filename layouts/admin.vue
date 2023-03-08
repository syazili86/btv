<template>
  <v-app>
    <drawer_ :drawer="drawer" :miniVariant="miniVariant" />

    <toolBar_ :rightDrawer="rightDrawer" :toogleRightDrawer="toogleRightDrawer" :miniVariant="miniVariant" :toogleMiniVariant="toogleMiniVariant" />

    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
const components = {
  drawer_: () => import('@/components/auth/drawer.vue').then(m => m.default || m),
  toolBar_: () => import('@/components/auth/toolbar.vue').then(m => m.default || m)
}

export default {
  components,

  data () {
    return {
      drawer: true,
      miniVariant: false,
      rightDrawer: false,
      tabs: null,
      tabsItems: [
        {
          id: 1,
          title: 'Indicators',
          link: 'indicators'
        },
        {
          id: 2,
          title: 'Backup',
          link: 'backup'
        },
        {
          id: 3,
          title: 'Logs',
          link: 'logs'
        }
      ]
    }
  },

  methods: {
    toogleMiniVariant () {
      this.miniVariant = !this.miniVariant
    },

    toogleRightDrawer () {
      this.rightDrawer = !this.rightDrawer
    }
  }
}
</script>
