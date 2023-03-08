<template>
  <v-app dark>

    <!-- <drawer_ :drawer="drawer" v-if="$device.isDesktop" /> -->
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      app
      v-if="$device.isDesktop"
    >
      <v-list>
        <v-list-tile
          router
          :to="menu.to"
          :key="i"
          v-for="(menu, i) in menus"
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="menu.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="menu.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <toolbar_ :toogleDrawer="toogleDrawer" v-if="$device.isDesktop" />

    <v-content>
      <nuxt />
    </v-content>
    
    <footer_ v-if="$device.isDesktop" />
  </v-app>
</template>

<script>
  const components = {
    toolbar_: () => import('@/components/core/toolbar.vue').then(m => m.default || m),
    footer_: () => import('@/components/core/footer.vue').then(m => m.default || m)
  }

  export default {
    scrollToTop: true,

    components,

    data: () => ({
      menus: [
        { icon: 'fa-home', title: 'Home', to: '/', important: false },
        { icon: 'play_circle_filled', title: 'Live Streaming', to: '/live-streaming', important: true },
        { icon: 'event', title: 'Schedule', to: '/schedules', important: false }
      ],

      drawer: false
    }),

    methods: {
      toogleDrawer () {
        this.drawer = !this.drawer
      }
    }
  }
</script>

<style>
.theme--dark.application {
    background: #212121 !important;
    color: #fff;
}
.theme--dark.v-card {
    background-color: #212121;
    border-color: #212121;
    color: #fff;
}
</style>
