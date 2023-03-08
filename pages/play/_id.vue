<template>
  <v-container grid-list-md>
    <v-layout row>
      <v-flex grow pa-1>
        <video id="videoPlayer" width='100%' height='90%' controlsList="nodownload" autoplay controls="true">
          <source :src="`/api/stream/${$route.params.id}#t=1500`">
        </video>
      </v-flex>
    </v-layout>
  </v-container>
</template>
