<template>
  <div>
    <v-toolbar color="primary" dark extended>
      <v-toolbar-title slot="extension" class="white--text">
        Categories
        <v-btn
          fab
          small
          bottom
          left
          absolute
          @click="(dialogForm = true, dialogFormTitle = 'Add Category')"
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
              v-model="categorieAlert.model"
              dismissible
              :type="categorieAlert.type"
            >
              {{ categorieAlert.text }}
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
                  <td>{{ props.item.categorieName }}</td>
                  <td>{{ props.item.slug }}</td>
                  <td class="text-xs-center">{{ props.item._createdAt }}</td>
                  <td class="text-xs-center">{{ props.item._updatedAt }}</td>
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
                :src="`/categories/${item.cover}`"
              ></v-carousel-item>
            </v-carousel>

            <v-card-title primary-title>
              <div>
                <div class="headline"> Preview Cover</div>
                <span class="grey--text"><v-icon small color="primary">arrow_back</v-icon> Select one of this categories, to preview a cover image.</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row justify-center>
        <v-dialog
          v-model="dialogForm" 
          persistent
          max-width="600px"
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
                      <v-text-field
                        v-model="categorieName"
                        label="Categorie Name*" 
                        hint="fill this field with maximum 100 characters"
                        prepend-icon="text_format"
                        required
                        :counter="100"
                        :rules="categorieNameRules"
                      ></v-text-field>
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
                        v-model="cover.name"
                        label="Cover Image*"
                        hint="select image to upload as categorie cover. Maximum size is 3 MB"
                        persistent-hint
                        prepend-icon="photo"
                        readonly
                        @click='pickCover'
                      ></v-text-field>
                      <input
                        type="file"
                        style="display: none"
                        ref="image"
                        accept="image/*"
                        @change="onCoverPicked"
                      >
                    </v-flex>

                    <v-flex xs12 sm12 md6 style="padding: 20px;">
                      <v-img
                        :src="(cover.url) ? cover.url : `/image_placeholder.png`"
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
    dialogFormTitle: 'Add Category',
    selected: [],
    disabledDelete: true,
    deleteDialog: false,
    loading: false,
    headers: [
      { text: 'Categorie Name', value: 'categorieName' },
      { text: 'Slug', value: 'slug' },
      { text: 'Created At', value: 'createdAt' },
      { text: 'Updated At', value: 'updateAt' },
      {
        text: 'Edit',
        value: '',
        sortable: false
      }
    ],
    cover: {
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
    categorieName: '',
    categorieNameRules: [
      v => !!v || 'Categorie Name is required',
      v => (v && v.length <= 100) || 'Categorie Name must be less than 100 characters'
    ],
    slug: '',
    categorieAlert: {
      model: false,
      type: null,
      text: ''
    }
  }),

  watch: {
    pagination: {
      handler () {
        this.loading = true
        this.$store.dispatch('categories/queryItems')
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
    categorieName () {
      if (typeof this.categorieName !== 'undefined') {
        this.slug = `RandomKey-${this.categorieName.toLowerCase().split(' ').join('-')}`
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
        return this.$store.getters['categories/pagination']
      },
      set: function (value) {
        this.$store.commit('categories/setPagination', value)
      }
    },
    items () {
      return this.$store.getters['categories/items']
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
    pickCover () {
      this.$refs.image.click()
    },
    onCoverPicked (e) {
      const files = e.target.files

      if (typeof files[0] !== 'undefined') {
        if (!files[0].type.includes('image')) {
          this.formAlert.text = 'Please upload image file!'
          this.formAlert.model = true
          return
        }

        if (files[0].size > 3145728) {
          this.formAlert.text = 'Your image size is to big! Please use another image.'
          this.formAlert.model = true
          return
        }

        this.cover.name = files[0].name
        if (this.cover.name.lastIndexOf('.') <= 0) {
          return
        }

        const fr = new FileReader()

        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.cover.url = fr.result
          this.cover.file = files[0]
        })
      } else {
        this.cover.name = ''
        this.cover.file = ''
        this.cover.url = ''
      }
    },
    dialogFormClose () {
      this.cover.name = ''
      this.cover.url = ''
      this.cover.file = ''
      this.$refs.form.reset()
      this.dialogForm = false
      this.selected = []
    },
    async dialogFormSubmit () {
      if (this.$refs.form.validate()) {
        this.loading = true
        const payload = {}

        if (this.id) {
          payload['categorieName'] = this.categorieName
          if (this.cover.file) {
            payload['cover'] = this.cover.url
          }

          this.$store.dispatch('categories/updateItem', {
            payload: payload,
            id: this.id
          }).then((result) => {
            this.setAlertCategorie(result)
          }).catch((err) => {
            console.log(err)
          })
        } else {
          if (!this.cover.file) {
            this.formAlert.text = 'Cover image is required!'
            this.formAlert.model = true
            return
          }

          payload['categorieName'] = this.categorieName
          payload['cover'] = this.cover.url

          this.$store.dispatch('categories/addItem', {
            payload: payload
          }).then((result) => {
            result['setText'] = 'A new Categorie has been added.'
            this.setAlertCategorie(result)
          }).catch((err) => {
            console.log(err)
          })
        }
      }
    },
    async edit (item) {
      this.dialogFormTitle = await 'Edit Category'
      this.id = await item.id
      this.categorieName = await item.categorieName
      this.slug = await item.slug
      if (item.cover) {
        this.cover.name = await item.cover.split('.')[0]
        this.cover.url = await `/categories/${item.cover}`
      }
      this.dialogForm = true
    },
    deleteYesBtn () {
      this.loading = true
      this.$store.dispatch('categories/deleteItem', {
        payload: this.selected,
        key: 'id'
      }).then((result) => {
        result['setText'] = 'A Categorie has been deleted.'
        this.setAlertCategorie(result)
      })
    },
    deleteNoBtn () {
      this.deleteDialog = false
    },
    async setAlertCategorie (result) {
      if (result.success) {
        this.categorieAlert.type = await 'success'
      } else {
        this.categorieAlert.type = await 'error'
      }

      if (result.response && typeof result.response === 'string') {
        this.categorieAlert.text = await result.response
      } else if (result.setText) {
        this.categorieAlert.text = await result.setText
      } else {
        this.categorieAlert.text = await 'Undefinied response'
      }

      this.loading = await false
      this.deleteDialog = await false
      this.dialogFormClose()
      this.categorieAlert.model = true
    }
  }
}
</script>
