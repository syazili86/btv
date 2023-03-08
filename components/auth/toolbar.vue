<template>
  <div>
    <v-toolbar app flat dense color="primary" dark>
      <v-btn icon @click.stop="toogleMiniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <v-btn
          slot="activator"
          icon
          @click.stop="toogleRightDrawer"
        >
          <v-badge color="indigo" overlap>
            <span slot="badge">2</span>
            <v-icon>notifications</v-icon>
          </v-badge>
        </v-btn>
        <span>2 unread notifications</span>
      </v-tooltip>

      <v-menu>
        <v-btn icon slot="activator">
          <v-icon>person</v-icon>
        </v-btn>
        <v-list class="pa-0" light>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-avatar class="primary" size="48px">
                <v-icon dark>person</v-icon>
              </v-avatar>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $auth.user.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ $auth.user.level }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>

          <v-list-tile key="profile" >
            <v-list-tile-action>
              <v-icon>fa-user</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>My Profile</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>

          <v-list-tile ripple key="lock_open" @click="$auth.logout()">
            <v-list-tile-action>
              <v-icon>fa-sign-out-alt</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-navigation-drawer temporary :right="right" v-model="rightDrawer" fixed app>
      <v-toolbar flat prominent dark class="primary">
        <v-toolbar-title>Notifications</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="toogleRightDrawer">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list subheader dense>
        <v-subheader>All notifications</v-subheader>
        <v-list-tile >
          <v-list-tile-action>
            <v-icon>person_add</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>12 new users registered</v-list-tile-title>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile >
          <v-list-tile-action>
            <v-icon>data_usage</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>DB overloaded 80%</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  props: ['rightDrawer', 'toogleRightDrawer', 'miniVariant', 'toogleMiniVariant'],

  data: () => ({
    right: true
  }),

  computed: {
    tollbarTitle () {
      let name = this.$route.name.replace('backend-', '')
      name = name.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase()
      })

      return name
    }
  }
}
</script>
