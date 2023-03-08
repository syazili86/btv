<template>
  <v-app :dark="layoutCleanModeDark">

    <v-content>
      <nuxt />
    </v-content>

  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('app', ['layoutCleanModeDark'])
  }
}
</script>