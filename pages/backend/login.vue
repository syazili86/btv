<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Admin Panel</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon medium>fa-user-lock</v-icon>
          </v-toolbar>

          <v-card-text>
            <v-alert
              :value="error.show"
              type="error"
            >
              {{ error.message }}
            </v-alert>
            <p></p>

            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field 
                prepend-icon="fa-at" 
                v-model="formUsername"
                :rules="usernameRules"
                label="Username" 
                type="text"
                required></v-text-field>

              <v-text-field
                v-if="usernameValid"
                prepend-icon="fa-key" 
                v-model="formPassword"
                :rules="passwordRules"
                label="Password"
                type="password"
                required></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login" :disabled="(!valid || !usernameValid)">
              Login<v-icon right small>fa-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  layout: 'clean',

  middleware: ['auth'],

  data () {
    return {
      valid: true,
      formError: null,
      usernameValid: false,
      formUsername: '',
      formPassword: '',
      passwordRules: [
        v => !!v || 'Password wajib diisi !!'
      ],
      error: {
        show: false,
        message: null
      }
    }
  },

  watch: {
    async formUsername (val) {
      if (val !== '') {
        const { data } = await this.$axios.post('/api/check-username', { username: val })
        this.usernameValid = data.success
      }
    }
  },

  computed: {
    usernameRules () {
      const rules = [v => !!v || 'Username wajib diisi !!']

      if (!this.usernameValid) {
        const rule = 'Username anda tidak valid 😢'

        rules.push(rule)
      }

      return rules
    }
  },

  methods: {
    async login () {
      if (this.$refs.form.validate()) {
        this.error.show = false

        return this.$auth.loginWith('local', {
          data: {
            username: this.formUsername,
            password: this.formPassword
          }
        }).then((result) => {
          console.log(result)
        }).catch((err) => {
          this.error.show = true
          const { message } = err.response.data
          this.error.message = message
        })
      }
    }
  }
}
</script>