<template>
  <v-container grid-list-md>
    <v-layout row wrap style="margin-top: 10%;">
      <v-flex text-md-center>
        <v-icon size="100">fa-toolbox</v-icon>
        <blockquote class="blockquote">
          &#8220; Under Development &#8221;
          <footer>
            <v-btn outline flat color="primary" to="/backend" dark>Back to dashboard 🙏</v-btn>
          </footer>
        </blockquote>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  layout: 'admin',

  middleware: ['auth']
}
</script>
