<template>
  <v-navigation-drawer
    width="250"
    class="blue-grey darken-4"
    dark
    persistent
    :mini-variant="miniVariant"
    v-model="drawer"
    fixed
    app
  >
    <v-toolbar flat class="transparent" dense>
      <v-list class="pa-0">
        <v-list-tile>
          <v-list-tile-action>
            <v-icon medium color="primary">airplay</v-icon>
          </v-list-tile-action>
          <v-list-tile-content v-if="!miniVariant">
            <v-list-tile-title>
              <h3 v-text="appName"></h3>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <v-divider></v-divider>

    <v-tooltip right :disabled="!miniVariant">
      <v-toolbar flat class="transparent" dense slot="activator">
        <v-list class="pa-0" :class="{'list-border-bottom' : miniVariant}">
          <v-list-tile to="/backend" exact>
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>System Overview</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <span>Project Overview</span>
    </v-tooltip>
    <v-divider></v-divider>
    
    <template v-for="(header, index) in menus">
      <v-list :key="index" subheader :class="{'list-border-bottom' : miniVariant}">
        <v-subheader>{{ header.title }}</v-subheader>
        <template v-for="(item, index) in header.items">
          <v-tooltip right :disabled="!miniVariant" :key="index">
            <v-list-tile :key="index" :to="item.link" exact slot="activator">
              <v-list-tile-action>
                <v-icon v-html="item.icon"></v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.title"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <span v-text="item.title"></span>
          </v-tooltip>
        </template>
      </v-list>
      <v-divider v-if="(index+1 !== menus.length)" :key="`divider-${index}`"></v-divider>
    </template>
  </v-navigation-drawer>
</template>

<script>
  export default {
    props: ['drawer', 'miniVariant'],

    data: () => ({
      appName: 'Bina Darma TV',
      menus: [
        {
          title: 'STREAMING',
          items: [
            {
              icon: 'settings_input_antenna',
              title: 'Live Broadcast',
              link: '/backend/live-broadcast'
            }
          ]
        },
        {
          title: 'MAIN MENU',
          items: [
            {
              icon: 'date_range',
              title: 'Schedule',
              link: '/backend/schedules'
            },
            {
              icon: 'movie_filter',
              title: 'Contents',
              link: '/backend/program-contents'
            }
          ]
        },
        {
          title: 'MASTERS',
          items: [
            {
              icon: 'collections',
              title: 'Categories',
              link: '/backend/categories'
            },
            {
              icon: 'local_movies',
              title: 'Programs',
              link: '/backend/programs'
            },
            {
              icon: 'recent_actors',
              title: 'Users',
              link: '/backend/users'
            }
          ]
        }
      ]
    })
  }
</script>
