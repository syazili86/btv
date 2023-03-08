<template>
  <section>
    <v-layout row wrap style="padding-bottom: 32px;">
      <v-flex xs12>
        <v-subheader style="padding: 0px;" class="headline white--text">Terpopuler</v-subheader>
      </v-flex>

      <v-flex v-for="(populer, i) in populers" :key="`2${populer.title}`" xs6 sm6 md3>
        <v-hover>
          <v-card 
            slot-scope="{ hover }"
            class="d-flex"
            height="400"
            :to="populer.url"
            :ripple="true"
          >
            <v-img
              :src="populer.img"
              :lazy-src="`https://picsum.photos/10/6?image=${i * 5 + 10}`"
              aspect-ratio="1"
              class="grey lighten-2"
            >
              <v-expand-transition>
                <div
                  v-if="hover"
                  class="d-flex transition-fast-in-fast-out primary darken-1 v-card--reveal white--text"
                  style="height: 100%;"
                >
                  <div>
                    <v-btn flat icon color="white darken-4" :to="`/play/`">
                      <v-icon large>fa-play-circle</v-icon>
                    </v-btn>
                    <p class="hover-populer-title text-xs-center">{{ populer.title }}</p>
                    <p class="hover-populer-synopsis text-xs-justify">{{ populer.synopsis }}</p>
                  </div>
                </div>
              </v-expand-transition>
              <v-layout
                slot="placeholder"
                fill-height
                align-center
                justify-center
                ma-0
              >
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-layout>
            </v-img>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>

    <v-layout row wrap style="padding-bottom: 32px;">
      <v-flex xs12>
        <v-subheader style="padding: 0px;" class="headline white--text">Terfavorit</v-subheader>
      </v-flex>

      <v-flex v-for="i in 4" :key="i" xs12 sm6 md6 style="padding: 8px;">
        <v-card color="primary" class="white--text">
          <v-layout row>
            <v-flex xs7>
              <v-card-title primary-title>
                <div>
                  <div class="headline">Halycon Days</div>
                  <div>Ellie Goulding adaslfa asknfkasnkf asfnaksnfa sfnaskfnksa fmasfknaskfnkaf asfgjaekfk</div>
                </div>
              </v-card-title>
            </v-flex>
            <v-flex xs5>
              <v-img
                src="https://picsum.photos/300/300?image=2"
              ></v-img>
            </v-flex>
          </v-layout>
          <v-divider light></v-divider>
          <v-card-actions class="pa-3">
            <v-btn flat icon color="white darken-4" :to="`/play/`">
              <v-icon large>fa-play-circle</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-icon>fa-star</v-icon>
            <v-icon>fa-star</v-icon>
            <v-icon>fa-star</v-icon>
            <v-icon>fa-star-half-alt</v-icon>
            <v-icon>far fa-star</v-icon>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap style="padding-bottom: 32px;">
      <v-flex xs12>
        <v-subheader style="padding: 0px;" class="headline white--text">Kategori</v-subheader>
      </v-flex>

      <v-flex xs12>
        <no-ssr>
          <siema class="siema" :options="siemaOptions">
            <v-card style="padding: 2px;" v-for="(categorie, index) in categories" :key="index">
              <v-img
                :src="categorie.src"
              ></v-img>
            </v-card>
          </siema>
        </no-ssr>
      </v-flex>
    </v-layout>
  </section>
</template>

<script>
  export default {
    props: ['populers', 'siemaOptions', 'categories']
  }
</script>
