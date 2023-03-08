<template>
  <v-toolbar color="primary" fixed clipped-left app>
    <v-toolbar-side-icon @click="toogleDrawer"></v-toolbar-side-icon>

    <span class="title ml-3 mr-5 font-weight-black">Bina Darma&nbsp;<span class="font-weight-thin">TV</span></span>

    <v-spacer></v-spacer>
    
    <v-text-field
      name="cariAcara"
      label="Cari"
      flat
      solo-inverted
      hide-details
      prepend-inner-icon="search"
      class="hidden-sm-and-down"
    ></v-text-field>
  </v-toolbar>
</template>

<script>
  export default {
    props: ['toogleDrawer']
  }
</script>
