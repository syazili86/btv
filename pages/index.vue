<template>
  <section v-resize="onResize">
    <v-parallax
      height="750"
      dark
      cover
      :src="(liveRes.hasOwnProperty('Program')) ? `/programs/${liveRes.Program.poster}` : `logo_btv.png` ">
      <v-layout
        align-center
        column
        justify-center
      >
        <h1 class="white--text mb-2 display-1 text-xs-center" style="-webkit-user-select: none;">{{ (liveRes.hasOwnProperty('Program')) ? liveRes.Program.programName : `` }}</h1>
        <div v-show="liveRes.hasOwnProperty('Program')">
          <div class="subheading mb-3 text-xs-center font-weight-black" style="-webkit-user-select: none;">Sedang Tayang</div>
          <v-btn
            class="mt-5"
            large
            color="primary"
            round
            to="/live-streaming"
          >
            <v-icon left dark>fa-play</v-icon>
            Tonton
          </v-btn>
        </div>
      </v-layout>
    </v-parallax>

    <v-container grid-list-md>
      <v-layout row wrap style="padding-bottom: 32px;">
        <v-flex xs12>
          <v-subheader style="padding: 0px; -webkit-user-select: none;" class="headline white--text">Terpopuler</v-subheader>
          <span v-if="!$device.isDesktop" style="padding: 0px; -webkit-user-select: none;">Program acara terpopuler</span>
        </v-flex>

        <v-flex v-for="(populer, i) in populers" :key="`2${populer.slug}`" xs6 sm6 md3>
          <v-hover>
            <v-card 
              slot-scope="{ hover }"
              class="d-flex"
              height="400"
              :to="`/programs/${populer.slug}`"
              :ripple="true">
              <v-img
                :src="`/programs/${populer.poster}`"
                :lazy-src="`https://picsum.photos/10/6?image=${i * 5 + 10}`"
                aspect-ratio="0,7"
                class="grey lighten-2">
                <v-expand-transition v-if="$device.isDesktop">
                  <div
                    v-if="hover"
                    class="d-flex transition-fast-in-fast-out primary darken-1 v-card--reveal white--text"
                    style="height: 100%;">
                    <div>
                      <v-btn flat icon color="white darken-4" :to="`/programs/${populer.slug}`">
                        <v-icon large>fa-play-circle</v-icon>
                      </v-btn>
                      <p class="hover-populer-title text-xs-center">{{ populer.programName }}</p>
                      <p class="hover-populer-synopsis text-xs-justify">{{ populer.synopsis }}</p>
                    </div>
                  </div>
                </v-expand-transition>
                <v-layout
                  slot="placeholder"
                  fill-height
                  align-center
                  justify-center
                  ma-0>
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-layout>
              </v-img>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>

      <template v-if="!$device.isDesktop">
        <v-layout row wrap style="padding-bottom: 32px;">
          <v-flex xs12>
            <v-subheader style="padding: 0px; -webkit-user-select: none;" class="headline white--text">Kategori</v-subheader>
            <span v-if="!$device.isDesktop" style="padding: 0px; -webkit-user-select: none;">Tonton kategori-kategori menarik</span>
          </v-flex>

          <v-flex xs12>
            <no-ssr>
              <siema class="siema" :options="siemaOptions">
                <v-card style="padding: 2px;" v-for="(categorie, index) in categories" :key="index">
                  <v-img
                    ascpect-ratio="1,79"
                    :src="`/categories/${categorie.cover}`"
                    :to="`/categories/${categorie.id}`"
                  ></v-img>
                </v-card>
              </siema>
            </no-ssr>
          </v-flex>
        </v-layout>

        <v-layout row wrap style="padding-bottom: 32px;">
          <v-flex xs12>
            <v-subheader style="padding: 0px; -webkit-user-select: none;" class="headline white--text">Terfavorit</v-subheader>
            <span v-if="!$device.isDesktop" style="padding: 0px; -webkit-user-select: none;">Kumpulan video dan acara kegemaran</span>
          </v-flex>

          <no-ssr>
            <siema class="siema" :options="siemaFavoriteOptions">
              <v-flex v-for="(fav, index) in favorites" :key="index" xs12 style="padding: 8px;">
                <v-card
                  class="mx-auto elevation-20"
                  color="primary"
                  dark
                >
                  <v-layout justify-space-between>
                    <v-flex xs8>
                      <v-card-title primary-title>
                        <div>
                          <div class="headline">{{ fav.Program.programName }}</div>
                          <div>{{ fav.Program.synopsis }}</div>
                        </div>
                      </v-card-title>
                    </v-flex>
                    <v-img
                      class="shrink ma-2"
                      contain
                      height="125px"
                      :src="`/programs/${fav.Program.poster}`"
                      style="flex-basis: 125px"
                    ></v-img>
                  </v-layout>
                  <v-divider dark></v-divider>
                  <v-card-actions class="pa-3">
                    <v-btn outline color="white" :to="`/programs/${fav.Program.slug}`">View More</v-btn>
                    <v-spacer></v-spacer>
                    <span class="grey--text text--lighten-2 caption mr-2">
                      ({{ rate_val }})
                    </span>
                    <v-rating
                      readonly
                      :value="fav.rate_val"
                      background-color="white"
                      color="yellow accent-4"
                      dense
                      half-increments
                      size="18"
                    ></v-rating>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </siema>
          </no-ssr>
        </v-layout>
      </template>

      <template v-else>
        <v-layout row wrap style="padding-bottom: 32px;">
          <v-flex xs12>
            <v-subheader style="padding: 0px;" class="headline white--text">Terfavorit</v-subheader>
            <span v-if="!$device.isDesktop" style="padding: 0px;">Kumpulan video dan acara kegemaran</span>
          </v-flex>

          <v-flex v-for="(fav, index) in favorites" :key="index" xs12 sm6 md6 style="padding: 8px;">
            <v-card
              class="mx-auto elevation-20"
              color="primary"
              dark
            >
              <v-layout justify-space-between>
                <v-flex xs8>
                  <v-card-title primary-title>
                    <div>
                      <div class="headline">{{ fav.Program.programName }}</div>
                      <v-divider dark></v-divider>
                      <div>
                        {{ (fav.Program.synopsis.length > 250) ? fav.Program.synopsis.slice(0, 250) + ' ...' : fav.Program.synopsis }}
                      </div>
                    </div>
                  </v-card-title>
                </v-flex>
                <v-img
                  class="shrink ma-2"
                  contain
                  height="125px"
                  :src="`/programs/${fav.Program.poster}`"
                  style="flex-basis: 125px"
                ></v-img>
              </v-layout>
              <v-divider dark></v-divider>
              <v-card-actions class="pa-3">
                <v-btn outline color="white" :to="`/programs/${fav.Program.slug}`">View More</v-btn>
                <v-spacer></v-spacer>
                <span class="grey--text text--lighten-2 caption mr-2">
                  ({{ fav.rate_val }})
                </span>
                <v-rating
                  readonly
                  :value="fav.rate_val"
                  background-color="white"
                  color="yellow accent-4"
                  dense
                  half-increments
                  size="18"
                ></v-rating>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>

        <v-layout row wrap style="padding-bottom: 32px;">
          <v-flex xs12>
            <v-subheader style="padding: 0px;" class="headline white--text">Kategori</v-subheader>
            <span v-if="!$device.isDesktop" style="padding: 0px;">Tonton kategori-kategori menarik</span>
          </v-flex>

          <v-flex xs12>
            <no-ssr>
              <siema class="siema" :options="siemaOptions">
                <v-card style="padding: 2px;" v-for="(categorie, index) in categories" :key="index">
                  <v-card :to="`/categories/${categorie.id}`">
                    <v-img
                      ascpect-ratio="1,79"
                      :src="`/categories/${categorie.cover}`"
                    ></v-img>
                  </v-card>
                </v-card>
              </siema>
            </no-ssr>
          </v-flex>
        </v-layout>
      </template>
    </v-container>
  </section>
</template>

<script>
export default {
  async asyncData ({ $axios, store }) {
    // programs
    await store.commit('programs/setPagination', {
      descending: true,
      page: 1,
      rowsPerPage: 4,
      sortBy: 'watchCount',
      totalItems: 0,
      search: ''
    })
    await store.dispatch('programs/queryItems')

    // categories
    await store.commit('categories/setPagination', {
      descending: false,
      page: 1,
      rowsPerPage: -1,
      sortBy: 'categorieName',
      totalItems: 0,
      search: ''
    })
    await store.dispatch('categories/queryItems')

    // ratings
    await store.commit('ratings/setPagination', {
      descending: true,
      page: 1,
      rowsPerPage: -1,
      sortBy: 'createdAt',
      totalItems: 0,
      search: ''
    })
    await store.dispatch('ratings/queryItems')

    // Live now
    return $axios.$get(`/api/live-now`).then((result) => {
      if (result.success && result.data !== null) {
        return { liveRes: result.data }
      }
    }).catch((_) => {})
    /* const { data } = await $axios.$get(`/api/live-now`)
    return { liveRes: data } */
  },

  data: () => ({
    liveRes: null,
    siemaOptions: {
      perPage: 4
    },
    siemaFavoriteOptions: {
      perPage: 1
    }
  }),

  mounted () {
    this.onResize()
  },

  computed: {
    populers () {
      return this.$store.getters['programs/items']
    },
    favorites () {
      return this.$store.getters['ratings/items']
    },
    categories () {
      return this.$store.getters['categories/items']
    }
  },

  methods: {
    onResize () {
      if (this.$vuetify.breakpoint.xs) {
        this.siemaOptions.perPage = 2
      } else {
        this.siemaOptions.perPage = 4
      }
    }
  }
}
</script>

<style scoped>
  .v-card--reveal {
    /* align-items: center; */
    bottom: 0;
    opacity: .77;
    position: absolute;
    width: 100%;
  }

  .hover-populer-title {
    margin: 6px;
  }

  .hover-populer-synopsis {
    margin: 25px 6px;
    max-height: 50px;
  }
</style>

