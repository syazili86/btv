<template>
  <v-container grid-list-md>
    <v-layout row>
      <v-flex grow pa-1>
        <video width='100%' height='90%' controlsList="nodownload" autoplay controls="true">
          <source src="/api/live-streaming">
        </video>
      </v-flex>
    </v-layout>
  </v-container>
</template>
