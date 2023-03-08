<template>
  <v-container fluid grid-list-md>
    <v-layout row>
      <v-flex xs12 sm6 md6>
        <v-expansion-panel class="pa-2" focusable>
          <v-expansion-panel-content
            v-for="(item, index) in res.data[0].ProgramContents"
            :key="index"
          >
            <template v-slot:header>
              <div>Episode {{ item.isLooping ? 1 : item.episode }}</div>
            </template>
            <v-card>
              <v-card-actions class="pa-3">
                {{ item.title }}
                <v-spacer></v-spacer>
                <v-btn small outline color="primary" :to="`/play/${item.id}`">
                  <v-icon>play_arrow</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>

      <v-flex d-flex xs12 sm6 md6>
        <v-card flat>
          <v-img
            :src="`/programs/${res.data[0].poster}`" 
            contain
            aspect-ratio="1.5"
          >
          </v-img>

          <v-card-title primary-title>
            <div>
              <div class="headline">{{ res.data[0].programName }}</div>
              <span class="grey--text">
                {{ res.data[0].Categorie.categorieName }} | {{ res.data[0].watchCount }} times watched
              </span>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn small flat @click="show = !show">{{ show ? 'Hide' : 'Show' }} Synopsis &nbsp;<v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon></v-btn>
          </v-card-actions>

          <v-slide-y-transition>
            <v-card-text v-show="show">
              <span class="grey--text">{{ res.data[0].synopsis }}</span>
            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  asyncData ({ $axios, params, error }) {
    return $axios.$get(`/api/programs?slug=${params.slug}`)
      .then((result) => {
        if (result.success && result.data.length > 0) {
          return {
            res: result
          }
        } else {
          error({
            statusCode: 404,
            message: 'Program not found.'
          })
        }
      }).catch((_) => {
        error({
          statusCode: 404,
          message: 'Program not found.'
        })
      })
  },

  data: () => ({
    show: false
  })
}
</script>
