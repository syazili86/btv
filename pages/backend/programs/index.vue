<template>
  <div>
    <v-toolbar color="primary" dark extended>
      <v-toolbar-title slot="extension" class="white--text">
        Programs
        <v-btn
          fab
          small
          bottom
          left
          absolute
          @click="(dialogForm = true, dialogFormTitle = 'Add Program')"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-toolbar-title>
    </v-toolbar>

    <v-container>
      <v-layout row wrap>
        <v-flex xs12 sm12 md9 lg9 pa-1>
          <v-card>
            <v-alert
              v-model="programAlert.model"
              dismissible
              :type="programAlert.type"
            >
              {{ programAlert.text }}
            </v-alert>

            <v-card-title primary-title>
              <v-text-field
                :disabled="true"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="disabledDelete"
                :loading="loading"
                color="primary"
                class="white--text"
                @click="deleteDialog = true"
              >
                Delete
                <v-icon right>delete</v-icon>
              </v-btn>
            </v-card-title>
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="items"
              :pagination.sync="pagination"
              :total-items="pagination.totalItems"
              :loading="loading"
              :search="pagination.search"
              select-all
              prev-icon="chevron_left"
              next-icon="chevron_right"
              sort-icon="arrow_drop_up"
            >
              <template slot="no-data">
                <v-alert :value="true" color="warning" icon="warning">
                  Sorry, nothing to display here ☹️
                </v-alert>
              </template>
              <template slot="items" slot-scope="props">
                <tr :active="props.selected" @click="itemClicked(props)">
                  <td>
                    <v-checkbox
                      :input-value="props.selected"
                      primary
                      hide-details
                    ></v-checkbox>
                  </td>
                  <td>{{ props.item.Categorie.categorieName }}</td>
                  <td>{{ props.item.programName }}</td>
                  <td>{{ props.item.synopsis }}</td>
                  <td>{{ props.item.slug }}</td>
                  <td class="text-xs-center">
                    <v-icon
                      small
                      ripple
                      class="mr-2"
                      @click="edit(props.item)"
                    >
                      edit
                    </v-icon>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>

        <v-flex xs12 sm12 md3 lg3 pa-1>
          <v-card>
            <v-img
              v-if="selected.length <= 0"
              :src="`/image_placeholder.png`"
              :lazy-src="`/image_placeholder.png`"
              aspect-ratio="1"
              class="grey lighten-2"
            >
              <v-layout
                slot="placeholder"
                fill-height
                align-center
                justify-center
                ma-0
              >
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-layout>
            </v-img>

            <v-carousel v-else height="350">
              <v-carousel-item
                v-for="(item,i) in selected"
                :key="i"
                :src="`/programs/${item.poster}`"
              ></v-carousel-item>
            </v-carousel>

            <v-card-title primary-title>
              <div>
                <div class="headline"> Preview Poster</div>
                <span class="grey--text"><v-icon small color="primary">arrow_back</v-icon> Select one of this programs, to preview a psoter image.</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row justify-center>
        <v-dialog
          v-model="dialogForm" 
          persistent
          max-width="720px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">{{ dialogFormTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-alert
                v-model="formAlert.model"
                dismissible
                :type="formAlert.type"
              >
                {{ formAlert.text }}
              </v-alert>
              
              <v-container grid-list-md>
                <v-form ref="form" v-model="valid">
                  <v-layout wrap>
                    <v-flex xs12 sm12 md6>
                      <v-autocomplete
                        v-model="categoryModel"
                        :hint="'Start typing to search category'"
                        :items="categoryItems"
                        :search-input.sync="searchCategory"
                        :loading="categoryLoading"
                        no-data-text="No category found"
                        :label="`Category*`"
                        :auto-select-first="true"
                        clearable
                        clear-icon="close"
                        open-on-clear
                        persistent-hint
                        hide-selected
                        item-text="categorieName"
                        item-value="id"
                        return-object
                        prepend-icon="photo_library"
                        required
                        :rules="categoryRules"
                      >

                        <template slot="selection" slot-scope="{ item }" :selected="true">
                          <v-list-tile-content>
                            <v-list-tile-title v-text="item.categorieName"></v-list-tile-title>
                          </v-list-tile-content>
                        </template>

                        <template slot="item" slot-scope="{ item }">
                          <v-list-tile-content>
                            <v-list-tile-title v-text="item.categorieName"></v-list-tile-title>
                            <v-list-tile-sub-title v-text="`id: ${ item.Description }`"></v-list-tile-sub-title>
                          </v-list-tile-content>
                        </template>
                      </v-autocomplete>
                    </v-flex>

                    <v-flex xs12 sm12 md6>
                      <v-text-field
                        v-model="programName"
                        label="Program Name*" 
                        hint="fill this field with minimum 3 and maximum 100 characters"
                        prepend-icon="text_format"
                        required
                        :counter="100"
                        :rules="programNameRules"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm12 md6>
                      <v-textarea
                        v-model="synopsis"
                        label="Synopsis"
                        hint="fill this field if program have syopsis, if not leave empty"
                        prepend-icon="subject"
                        persistent-hint
                      ></v-textarea>
                    </v-flex>

                    <v-flex xs12 sm12 md6>
                      <v-text-field
                        v-model="slug"
                        label="Slug"
                        hint="this field is automatic generated by system."
                        persistent-hint
                        prepend-icon="code"
                        disabled
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm12 md6>
                      <v-text-field
                        v-model="poster.name"
                        label="Poster Image*"
                        hint="select image to upload as program poster. Maximum size is 3 MB"
                        persistent-hint
                        prepend-icon="photo"
                        readonly
                        @click='pickPoster'
                      ></v-text-field>
                      <input
                        type="file"
                        style="display: none"
                        ref="image"
                        accept="image/*"
                        @change="onPosterPicked"
                      >
                    </v-flex>

                    <v-flex xs12 sm12 md6 style="padding: 20px;">
                      <v-img
                        :src="(poster.url) ? poster.url : `/image_placeholder.png`"
                        :lazy-src="`/image_placeholder.png`"
                        aspect-ratio="1"
                        class="grey lighten-2"
                      >
                        <v-layout
                          slot="placeholder"
                          fill-height
                          align-center
                          justify-center
                          ma-0
                        >
                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-layout>
                      </v-img>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-container>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark @click="dialogFormClose"><v-icon left dark>close</v-icon> Close</v-btn>
              <v-btn color="blue darken-2" :loading="loading" dark @click="dialogFormSubmit"><v-icon left dark>save</v-icon> Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>

    <dialogDelete_ :dialog="deleteDialog" :yesBtn="deleteYesBtn" :noBtn="deleteNoBtn" />
  </div>
</template>

<script>
const components = {
  dialogDelete_: () => import('@/components/auth/dialogDelete.vue').then(m => m.default || m)
}

export default {
  layout: 'admin',

  middleware: ['auth'],

  components,

  data: () => ({
    id: '',
    dialogForm: false,
    dialogFormTitle: 'Add Program',
    selected: [],
    disabledDelete: true,
    deleteDialog: false,
    loading: false,
    headers: [
      { text: 'Categorie Name', value: 'categorieName' },
      { text: 'Program Name', value: 'programName' },
      { text: 'Synopsis', value: 'synopsis' },
      { text: 'Slug', value: 'slug' },
      {
        text: 'Edit',
        value: '',
        sortable: false
      }
    ],
    poster: {
      name: '',
      url: '',
      file: ''
    },
    formAlert: {
      model: false,
      type: 'error',
      text: 'Sorry it is undefinied error 😨'
    },
    valid: false,
    categoryLoading: false,
    searchCategory: null,
    categoryModel: null,
    categoryEntries: [],
    categoryRules: [
      v => !!v || 'Category is required'
    ],
    programName: '',
    programNameRules: [
      v => !!v || 'Program Name is required',
      v => (v && v.length >= 3) || 'Program Name must be more than 3 characters',
      v => (v && v.length <= 100) || 'Program Name must be less than 100 characters'
    ],
    synopsis: '',
    slug: '',
    programAlert: {
      model: false,
      type: null,
      text: ''
    }
  }),

  watch: {
    pagination: {
      handler () {
        this.loading = true
        this.$store.dispatch('programs/queryItems')
          .then((result) => {
            this.loading = false
          })
      },
      deep: true
    },
    selected () {
      if (this.selected.length > 0) {
        this.disabledDelete = false
      } else {
        this.disabledDelete = true
      }
    },
    programName () {
      if (typeof this.programName !== 'undefined') {
        this.slug = `RandomKey-${this.programName.toLowerCase().split(' ').join('-')}`
      }
    },
    searchCategory (val) {
      if (val) {
        if (this.categoryItems.length > 0) return

        if (this.categoryLoading) return

        this.categoryLoading = true

        if (this.$store.getters['categories/items'].length <= 0) {
          const items = this.$store.getters['categories/items'].filter((item) => {
            return (item.categorieName.toLowerCase().includes(val.toLowerCase()))
          })

          if (items.length <= 0) {
            this.$store.commit('categories/setPagination', {
              rowsPerPage: 0
            })

            this.$store.dispatch('categories/queryItems')
              .then((result) => {
                this.categoryEntries = this.$store.getters['categories/items']
              })
          }
        } else {
          this.categoryEntries = this.$store.getters['categories/items']
        }

        this.categoryLoading = false
      }
    }
  },

  mounted () {
    const ann = document.getElementsByClassName('v-toolbar__content')
    ann[4].style.display = 'none'
  },

  computed: {
    pagination: {
      get: function () {
        return this.$store.getters['programs/pagination']
      },
      set: function (value) {
        this.$store.commit('programs/setPagination', value)
      }
    },
    items () {
      return this.$store.getters['programs/items']
    },
    categoryItems () {
      return this.categoryEntries.map(entry => {
        const Description = entry.id.length > 22
          ? entry.id.slice(0, 22) + '...'
          : entry.id

        return Object.assign({}, entry, { Description })
      })
    }
  },

  methods: {
    itemClicked (props) {
      props.selected = !props.selected

      if (this.selected.length > 0) {
        this.disabledDelete = false
      } else {
        this.disabledDelete = true
      }
    },
    pickPoster () {
      this.$refs.image.click()
    },
    onPosterPicked (e) {
      const files = e.target.files

      if (typeof files[0] !== 'undefined') {
        if (!files[0].type.includes('image')) {
          this.formAlert.text = 'Please upload image file!'
          this.formAlert.model = true
          return
        }

        if (files[0].size > 5000000) {
          this.formAlert.text = 'Your image size is to big! Please use another image.'
          this.formAlert.model = true
          return
        }

        this.poster.name = files[0].name
        if (this.poster.name.lastIndexOf('.') <= 0) {
          return
        }

        const fr = new FileReader()

        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.poster.url = fr.result
          this.poster.file = files[0]
        })
      } else {
        this.poster.name = ''
        this.poster.file = ''
        this.poster.url = ''
      }
    },
    dialogFormClose () {
      this.poster.name = ''
      this.poster.url = ''
      this.poster.file = ''
      this.$refs.form.reset()
      this.dialogForm = false
      this.selected = []
    },
    async dialogFormSubmit () {
      if (this.$refs.form.validate()) {
        this.loading = true
        const payload = {}

        payload['categorieId'] = this.categoryModel.id
        payload['programName'] = this.programName
        payload['synopsis'] = this.synopsis

        if (this.id) {
          if (this.poster.file) {
            payload['poster'] = this.poster.url
          }

          this.$store.dispatch('programs/updateItem', {
            payload: payload,
            id: this.id
          }).then((result) => {
            this.setAlertProgram(result)
          }).catch((err) => {
            this.loading = false
            console.log(err)
          })
        } else {
          if (!this.poster.file) {
            this.formAlert.text = 'poster image is required!'
            this.formAlert.model = true
            this.loading = false
            return
          }

          payload['poster'] = this.poster.url

          this.$store.dispatch('programs/addItem', {
            payload: payload
          }).then((result) => {
            this.setAlertProgram(result)
          }).catch((err) => {
            this.loading = false
            console.log(err)
          })
        }
      }
    },
    async edit (item) {
      if (this.categoryItems.length <= 0) {
        await this.$store.commit('categories/setPagination', {
          rowsPerPage: 0
        })

        await this.$store.dispatch('categories/queryItems')
          .then((result) => {
            this.categoryLoading = false
            this.categoryEntries = this.$store.getters['categories/items']
          })
      }

      this.dialogFormTitle = await 'Edit Program'
      this.id = await item.id
      this.programName = await item.programName
      this.synopsis = await item.synopsis
      this.slug = await item.slug

      this.categoryModel = item.Categorie

      if (item.poster) {
        this.poster.name = await item.poster.split('.')[0]
        this.poster.url = await `/programs/${item.poster}`
      }
      this.dialogForm = true
    },
    deleteYesBtn () {
      this.loading = true
      this.$store.dispatch('programs/deleteItem', {
        payload: this.selected,
        key: 'id'
      }).then((result) => {
        this.setAlertProgram(result)
      })
    },
    deleteNoBtn () {
      this.deleteDialog = false
    },
    async setAlertProgram (result) {
      if (result.success) {
        this.programAlert.type = await 'success'
      } else {
        this.programAlert.type = await 'error'
      }

      if (result.response && typeof result.response === 'string') {
        this.programAlert.text = await result.response
      } else if (result.setText) {
        this.programAlert.text = await result.setText
      } else {
        this.programAlert.text = await 'Undefinied response'
      }

      this.loading = await false
      this.deleteDialog = await false
      this.dialogFormClose()
      this.programAlert.model = true
    }
  }
}
</script>
