<template>
  <div>
    <v-toolbar dense color="primary" dark extension-height="230">
      <v-toolbar-title class="mx-auto" slot="extension">
        <span>Bina Darma Streaming & Video-on-Demand Management System</span>
        <h2>Welcome {{ $auth.user.name }}. <v-icon medium>favorite</v-icon></h2>
      </v-toolbar-title>
    </v-toolbar>

    <v-container>
      <v-layout row>
        <v-flex xs12 md12>
          <v-card flat class="card--flex-toolbar" color="transparent">
            <v-container fluid grid-list-lg>
              <v-layout row wrap>
                <v-flex xs12>
                  <h2 class="white--text">System Overview</h2>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12 sm12 md6 lg6>
                  <v-hover>
                    <v-card
                      slot-scope="{ hover }"
                      :class="`elevation-${hover ? 12 : 2}`"
                      class="mx-auto text-xs-center"
                      color="green"
                      dark
                      max-width="600"
                    >
                      <v-card-text>
                        <v-sheet color="rgba(0, 0, 0, .12)">
                          <v-sparkline
                            :labels="appTraffic.label"
                            :value="appTraffic.value"
                            color="rgba(255, 255, 255, .7)"
                            height="100"
                            padding="24"
                            line-width="2"
                          >
                          </v-sparkline>
                        </v-sheet>
                      </v-card-text>

                      <v-card-text>
                        <div class="display-1 font-weight-thin">App Traffic this Week</div>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions class="justify-center">
                        <v-btn block flat>Go to Report</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-hover>
                </v-flex>

                <v-flex xs12 sm12 md6 lg6>
                  <v-hover>
                    <v-card
                      slot-scope="{ hover }"
                      :class="`elevation-${hover ? 12 : 2}`"
                      class="mx-auto text-xs-center"
                      color="grey lighten-4"
                      max-width="600"
                    >
                      <v-card-title>
                        <v-icon
                          :color="'primary'"
                          class="mr-5"
                          size="64"
                        >
                          storage
                        </v-icon>
                        <v-layout
                          column
                          align-start
                        >
                          <div class="caption grey--text text-uppercase">
                            Available Storage
                          </div>
                          <div>
                            <span class="display-2 font-weight-black">{{ diskInfo.available }}</span>
                            <strong>GB</strong>
                            <span class="caption grey--text text-uppercase">/{{ `${diskInfo.total} GB` }}</span>
                          </div>
                        </v-layout>

                        <v-spacer></v-spacer>

                        <v-icon class="align-self-start" size="28">info</v-icon>
                      </v-card-title>

                      <v-card-text>
                        <v-progress-circular
                          :size="146"
                          width="30"
                          :value="diskInfo.percentUse"
                          :color="diskInfo.percentColor"
                        >{{ `${diskInfo.percentUse}%` }}</v-progress-circular>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions class="justify-center">
                        <v-btn block flat :disabled="warnDiskBtn">Warn enginer if almost full</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-hover>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12 sm6 md6 lg4 v-for="item in links" :key="item.id">
                  <v-hover>
                    <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                      <v-img src aspect-ratio="2.75" height="125px" :class="item.color"></v-img>

                      <v-card-title primary-title>
                        <div>
                          <h3 class="headline mb-0">{{item.title}}</h3>
                          <div>{{item.description}}</div>
                        </div>
                      </v-card-title>

                      <v-card-actions>
                        <v-btn flat color="primary" class="learn-more-btn">Learn more</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary">Get started</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-hover>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  layout: 'admin',

  middleware: ['auth'],

  data: () => ({
    appTraffic: {
      label: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      value: [423, 446, 675, 510, 590, 610, 760]
    },
    links: [
      {
        id: '1',
        title: 'Dashboard',
        description:
          'Get detailed anlytics to measure and analyze how users engage with your app',
        color: 'orange'
      },
      {
        id: '2',
        title: 'Storage',
        description:
          'Store and retrieve user-generated content, such as images, audio, and videos, without server-side code.',
        color: 'teal'
      },
      {
        id: '3',
        title: 'Notifications',
        description:
          'Manage your notification campaigns and send messages to reach the right users at the right time',
        color: 'blue'
      }
    ],
    infoDisk: {
      available: 0,
      total: 0,
      percentUse: 0
    },
    warnDiskBtn: true
  }),

  mounted () {
    this.$store.dispatch('sysoverview/fetchDiskInfo', {
      payload: { symbol: 'GB' }
    }).then((result) => {})
  },

  computed: {
    diskInfo () {
      const info = this.$store.getters['sysoverview/diskInfo']
      info['percentUse'] = Math.round((((info.total - info.available) / info.total) * 100) * 100) / 100
      if (info['percentUse'] < 59) {
        info['percentColor'] = 'success'
      } else if (info['percentUse'] >= 60 && info['percentUse'] <= 80) {
        info['percentColor'] = 'warning'
      } else {
        this.warnDiskBtn = false
        info['percentColor'] = 'primary'
      }

      return info
    }
  }
}
</script>

<style scoped>
  .outine-2 {
    border: 2px solid white;
  }
  .card--flex-toolbar {
    margin-top: -124px;
  }
  .learn-more-btn {
    text-transform: initial;
    text-decoration: underline;
  }
</style>
