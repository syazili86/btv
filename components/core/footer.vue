<template>
  <v-footer
    dark
    height="auto"
  >
    <v-card
      class="flex"
      tile
    >
      <v-divider></v-divider>

      <v-card-title>
        <v-btn
          v-for="link in links"
          :key="link"
          color="white"
          flat
          round
        >
          {{ link }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          v-for="icon in icons"
          :key="icon"
          dark
          icon
        >
          <v-icon size="24px">{{ icon }}</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-actions class="justify-center font-weight-thin">
        &copy;&nbsp;2018&nbsp;—&nbsp;Bina Darma TV.&nbsp;All Rights Reserved
      </v-card-actions>
    </v-card>
  </v-footer>
</template>

<script>
  export default {
    data: () => ({
      links: [
        'Home',
        'About Us',
        'Team',
        'Contact Us'
      ],

      icons: [
        'fab fa-youtube',
        'fab fa-facebook-f'
      ]
    })
  }
</script>
