<template>
  <v-navigation-drawer
    v-model="drawer"
    fixed
    clipped
    app
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
</template>

<script>
  export default {
    props: ['drawer'],

    data: () => ({
      menus: [
        { icon: 'fa-home', title: 'Home', to: '/' },
        { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' }
      ]
    })
  }
</script>
