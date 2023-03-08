<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="430"
  >
    <v-card>
      <v-card-title class="headline primary white--text" primary-title>
        {{ title ? title : defaultTitle  }}
      </v-card-title>

      <v-card-text>
        {{ text ? text : defaultText  }}
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          flat
          @click="yesBtn"
        >
          Yes, delete please
        </v-btn>
        <v-btn
          color="success"
          flat
          @click="noBtn"
        >
          No, please don't delete 🙏
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['dialog', 'title', 'text', 'yesBtn', 'noBtn'],

  data: () => ({
    defaultTitle: 'Wait, are you sure?!',
    defaultText: 'This item(s) will be deleted. Cancel this alert if you did not want to delete.'
  })
}
</script>
