<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm6 md3 v-for="(item, index) in res.data" :key="index">
        <v-hover>
          <v-card
            slot-scope="{ hover }"
            :class="`elevation-${hover ? 12 : 2}`"
            class="mx-auto"
          >
            <v-img
              contain
              :aspect-ratio="16/9"
              :src="`/programs/${item.poster}`"
            ></v-img>
            <v-card-title>
              <div>
                <span class="headline">{{ item.programName }}</span>
              </div>
              <v-spacer></v-spacer>
              <v-btn icon class="mr-0" :to="`/programs/${item.slug}`">
                <v-icon>chevron_right</v-icon>
              </v-btn>
            </v-card-title>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  asyncData ({ $axios, params, error }) {
    return $axios.$get(`/api/programs?categorieId=${params.slug}`)
      .then((result) => {
        if (result.success && result.data.length > 0) {
          return {
            res: result
          }
        } else {
          error({
            statusCode: 404,
            message: 'Categorie detail not found.'
          })
        }
      }).catch((_) => {
        error({
          statusCode: 404,
          message: 'Categorie detail not found.'
        })
      })
  },

  data: () => ({
    reviews: 413,
    value: 4.5
  })
}
</script>
