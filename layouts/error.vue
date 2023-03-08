<template>
  <v-container grid-list-md>
    <v-layout row wrap style="margin-top: 10%;">
      <v-flex text-md-center>
        <v-icon size="100">{{ icon }}</v-icon>
        <blockquote class="blockquote">
          <header>
            <small>
              <em>{{ statusCode }}</em>
            </small>
          </header>
          &#8220; {{ message }} &#8221;
          <footer>
            <v-btn ripple color="primary" to="/">Back to home</v-btn>
          </footer>
        </blockquote>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  },

  computed: {
    statusCode () {
      return (this.error && this.error.statusCode) || 500
    },
    message () {
      return this.error.message || `<%= messages.client_error %>`
    },
    icon () {
      switch (this.error.statusCode) {
        case 404: return `fa-box-open`
        case 503: return `fa-toolbox`

        default: return `fa-bug`
      }
    }
  }
}
</script>
