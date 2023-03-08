<template>
  <v-container grid-list-md>
    <v-layout row wrap style="margin-top: 10%;">
      <v-flex text-md-center>
        <!-- <img src="/v.png" alt="Vuetify.js" class="mb-5"> -->
        <v-icon size="100">extension</v-icon>
        <blockquote class="blockquote">
          <header>
            <small>
              <em>John Johnson</em>
            </small>
          </header>
          &#8220;First, solve the problem. Then, write the code.&#8221;
          <footer>
            <nuxt-link to="/">Back to home</nuxt-link>
          </footer>
        </blockquote>
      </v-flex>
    </v-layout>
  </v-container>
</template>
