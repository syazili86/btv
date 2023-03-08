<template>
  <div>
    <!-- toolbar -->
    <v-toolbar color="primary" dark extended>
      <v-toolbar-title slot="extension" class="white--text">
        Program Contents
        <v-btn
          fab
          small
          bottom
          left
          absolute
          @click="(dialogForm = true, dialogFormTitle = 'Add Program Content')"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-toolbar-title>
    </v-toolbar>

    <!-- main content -->
    <v-container>
      <!-- data view -->
      <v-layout row wrap>
        <v-flex xs12 sm12 md12 lg12 pa-1>
          <v-card>
            <v-alert
              v-model="programContentAlert.model"
              dismissible
              :type="programContentAlert.type"
            >
              {{ programContentAlert.text }}
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
                  <td>{{ props.item.Program.programName }}</td>
                  <td>{{ props.item.title }}</td>
                  <td class="text-xs-center">{{ props.item.season }}</td>
                  <td class="text-xs-center">{{ props.item.episode }}</td>
                  <td class="text-xs-center">{{ props.item.isLooping }}</td>
                  <td class="text-xs-center">{{ props.item.slug }}</td>
                  <td class="text-xs-center">{{ props.item.fileType }}</td>
                  <td class="text-xs-center">
                    <v-icon
                      small
                      ripple
                      class="mr-2"
                      @click="edit(props.item)"
                    >
                      edit
                    </v-icon>
                    <v-icon
                      small
                      ripple
                      class="mr-2"
                      @click="viewContent(props.item)"
                    >
                      visibility
                    </v-icon>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>

      <!-- data add/update -->
      <v-layout row justify-center>
        <v-dialog
          v-model="dialogForm"
          fullscreen 
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="dialogFormClose">
                <v-icon>close</v-icon>
              </v-btn>

              <v-toolbar-title>{{ dialogFormTitle }}</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-alert
                v-model="formAlert.model"
                dismissible
                :type="formAlert.type"
              >
                {{ formAlert.text }}
              </v-alert>

              <v-form ref="form" v-model="valid">
                <v-container fluid>
                  <v-layout row pa-3>
                    <v-flex grow pa-2 >
                      <uploader :options="contentUpload.options" class="uploader-example" v-on:file-complete="fileComplete">
                        <uploader-unsupport></uploader-unsupport>
                        <uploader-drop>
                          <p>Drop content video files here to upload or</p>
                          <uploader-btn :attrs="contentUpload.attrs">select content video</uploader-btn>
                        </uploader-drop>
                        <uploader-list></uploader-list>
                      </uploader>
                    </v-flex>
                  </v-layout>
                </v-container>

                <v-container fluid v-if="contentUpload.success">
                  <v-layout row pa-3>
                    <v-flex grow pa-2>
                      <v-alert type="success" :value="true" dismissible>
                        Content video has been successfully uploaded, now you can fill all description below
                      </v-alert>
                    </v-flex>
                  </v-layout>

                  <v-layout row pa-3>
                    <v-flex grow pa-2>
                      <v-autocomplete
                        v-model="programModel"
                        :hint="'Start typing to search program name'"
                        :items="programItems"
                        :search-input.sync="searchProgram"
                        :loading="programLoading"
                        no-data-text="No program found"
                        :label="`Program Name*`"
                        :auto-select-first="true"
                        clearable
                        clear-icon="close"
                        open-on-clear
                        persistent-hint
                        hide-selected
                        item-text="programName"
                        item-value="id"
                        return-object
                        prepend-icon="local_movies"
                        required
                        :rules="programRules"
                      >

                        <template slot="selection" slot-scope="{ item }" :selected="true">
                          <v-list-tile-content>
                            <v-list-tile-title v-text="item.programName"></v-list-tile-title>
                            <v-list-tile-sub-title v-text="`id: ${ item.id }`"></v-list-tile-sub-title>
                          </v-list-tile-content>
                        </template>

                        <template slot="item" slot-scope="{ item }">
                          <v-list-tile-content>
                            <v-list-tile-title v-text="item.programName"></v-list-tile-title>
                            <v-list-tile-sub-title v-text="`id: ${ item.id }`"></v-list-tile-sub-title>
                          </v-list-tile-content>
                        </template>
                      </v-autocomplete>
                    </v-flex>

                    <v-flex grow pa-2 >
                      <v-text-field
                        v-model="title"
                        label="Content Title*" 
                        hint="fill this field with minimum 3 and maximum 100 characters"
                        prepend-icon="text_format"
                        required
                        :counter="100"
                        :rules="titleRules"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-layout row pa-3>
                    <v-flex grow pa-2>
                      <v-text-field
                        v-model="slug"
                        label="Slug"
                        hint="this field is automatic generated by system."
                        persistent-hint
                        prepend-icon="code"
                        disabled
                      ></v-text-field>
                    </v-flex>

                    <v-flex shrink pa-2 >
                      <v-checkbox
                        v-model="isLooping"
                        label="Is Content Looping?"
                      ></v-checkbox>
                    </v-flex>

                    <v-flex shrink pa-2 >
                      <v-text-field
                        v-model="season"
                        label="Season" 
                        hint="fill this field with number of season"
                        type="number"
                        prepend-icon="ac_unit"
                        :disabled="seasonDisable"
                        :rules="seasonRules"
                      ></v-text-field>
                    </v-flex>

                    <v-flex shrink pa-2 >
                      <v-text-field
                        v-model="episode"
                        label="Episode" 
                        hint="fill this field with number of episode"
                        prepend-icon="more"
                        type="number"
                        required
                        :disabled="episodeDisable"
                        :rules="episodeRules"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-layout row pa-3>
                    <v-flex grow pa-2>
                      <v-btn color="blue darken-2" dark @click="dialogFormSubmit"><v-icon left dark>save</v-icon> Save</v-btn>
                    </v-flex>
                  </v-layout>
                </v-container>

                <v-container fluid v-else>
                  <v-layout row pa-3>
                    <v-flex grow pa-2>
                      <v-alert :type="contentUpload.alertType" :value="true">
                        Please upload content video first.
                      </v-alert>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
            </v-card-text>
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
    contentUpload: {
      options: {
        target: '/api/program-contents/upload',
        testChunks: false,
        singleFile: true,
        simultaneousUploads: 10,
        chunkSize: 0.5 * 1024 * 1024
      },
      attrs: {
        accept: 'video/*'
      },
      uniqueIdentifier: null,
      size: 0,
      name: '',
      chunksSize: 0,
      fileType: '',
      ext: '',
      success: false,
      alertType: 'info'
    },
    id: '',
    dialogForm: false,
    dialogFormTitle: '',
    selected: [],
    disabledDelete: true,
    deleteDialog: false,
    loading: false,
    headers: [
      { text: 'Program Name', value: 'programName' },
      { text: 'Title', value: 'title' },
      { text: 'Season', value: 'season' },
      { text: 'Episode', value: 'episode' },
      { text: 'Looping', value: 'isLooping' },
      { text: 'Slug', value: 'slug' },
      { text: 'File Type', value: 'fileType' },
      {
        text: 'Actions',
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
    programLoading: false,
    searchProgram: null,
    programModel: null,
    programEntries: [],
    programRules: [
      v => !!v || 'Program name is required'
    ],
    categorieName: '',
    categorieNameRules: [
      v => !!v || 'Categorie Name is required',
      v => (v && v.length <= 100) || 'Categorie Name must be less than 100 characters'
    ],
    title: '',
    titleRules: [
      v => !!v || 'Content Title is required',
      v => (v && v.length >= 3) || 'Content Title must be more than 3 characters',
      v => (v && v.length <= 100) || 'Content Title must be less than 100 characters'
    ],
    slug: '',
    isLooping: false,
    season: 1,
    seasonRules: [
      v => !!v || 'Number of season is required'
    ],
    seasonDisable: false,
    episode: '',
    episodeRules: [
      v => !!v || 'Number of episode is required'
    ],
    episodeDisable: false,
    programContentAlert: {
      model: false,
      type: null,
      text: ''
    }
  }),

  watch: {
    pagination: {
      handler () {
        this.loading = true
        this.$store.dispatch('programContents/queryItems')
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
    searchProgram (val) {
      if (val) {
        if (this.programItems.length > 0) return

        if (this.programLoading) return

        this.programLoading = true

        if (this.$store.getters['programs/items'].length <= 0) {
          const items = this.$store.getters['programs/items'].filter((item) => {
            return (item.programName.toLowerCase().includes(val.toLowerCase()))
          })

          if (items.length <= 0) {
            this.$store.commit('programs/setPagination', {
              rowsPerPage: 0
            })

            this.$store.dispatch('programs/queryItems')
              .then((result) => {
                this.programEntries = this.$store.getters['programs/items']
              })
          }
        } else {
          this.programEntries = this.$store.getters['programs/items']
        }

        this.programLoading = false
      }
    },
    title () {
      if (typeof this.title !== 'undefined') {
        this.slug = `RandomKey-${this.title.toLowerCase().split(' ').join('-')}`
      }
    },
    isLooping (val) {
      if (val) {
        this.seasonRules = []
        this.episodeRules = []
      } else {
        this.seasonRules = [
          v => (v && typeof v !== 'number') || 'Allow number format'
        ]
        this.episodeRules = [
          v => !!v || 'Number of episode is required',
          v => (v && typeof v !== 'number') || 'Allow number format'
        ]
      }
      this.seasonDisable = val
      this.episodeDisable = val
    }
  },

  mounted () {
    const ann = document.getElementsByClassName('v-toolbar__content')
    ann[5].style.display = 'none'
  },

  computed: {
    pagination: {
      get: function () {
        return this.$store.getters['programContents/pagination']
      },
      set: function (value) {
        this.$store.commit('programContents/setPagination', value)
      }
    },
    items () {
      return this.$store.getters['programContents/items']
    },
    programItems () {
      return this.programEntries.map(entry => {
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
    fileComplete (rootFile) {
      console.log('COMPLETE', rootFile)
      if (rootFile.allError || rootFile.error) {
        this.contentUpload.alertType = 'error'
      } else {
        this.contentUpload.success = true
        this.contentUpload.uniqueIdentifier = rootFile.uniqueIdentifier
        this.contentUpload.size = rootFile.size
        this.contentUpload.name = rootFile.name
        this.contentUpload.chunksSize = rootFile.chunks.length
        this.contentUpload.fileType = rootFile.fileType
        this.contentUpload.ext = rootFile.name.split('.').pop()
      }
    },
    dialogFormClose () {
      this.dialogForm = false
    },
    async dialogFormSubmit () {
      if (this.$refs.form.validate()) {
        this.loading = true
        const payload = {}

        if (this.id) {
          payload['programId'] = this.programModel.id
          payload['isLooping'] = this.isLooping
          payload['title'] = this.title
          if (!this.isLooping) {
            payload['episode'] = this.episode
            payload['season'] = this.season
          }
          if (this.contentUpload.success) {
            payload['content'] = this.contentUpload.uniqueIdentifier
            payload['fileType'] = this.contentUpload.fileType
            payload['contentFile'] = this.contentUpload
          }

          this.$store.dispatch('programContents/updateItem', {
            payload: payload,
            id: this.id
          }).then((result) => {
            this.setAlertProgramContent(result)
          }).catch((err) => {
            this.loading = false
            console.log(err)
          })
        } else {
          if (!this.contentUpload.success) {
            this.formAlert.text = 'Content video is required!'
            this.formAlert.model = true
            return
          }

          payload['programId'] = this.programModel.id
          payload['isLooping'] = this.isLooping
          payload['title'] = this.title
          if (!this.isLooping) {
            payload['episode'] = this.episode
            payload['season'] = this.season
          }
          payload['content'] = this.contentUpload.uniqueIdentifier
          payload['fileType'] = this.contentUpload.fileType
          payload['contentFile'] = this.contentUpload

          this.$store.dispatch('programContents/addItem', {
            payload: payload
          }).then((result) => {
            this.setAlertProgramContent(result)
          }).catch((err) => {
            this.loading = false
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
        this.cover.url = await `/programContents/${item.cover}`
      }
      this.dialogForm = true
    },
    deleteYesBtn () {
      this.loading = true
      this.$store.dispatch('programContents/deleteItem', {
        payload: this.selected,
        key: 'id'
      }).then((result) => {
        result['setText'] = 'A Categorie has been deleted.'
        this.setAlertProgramContent(result)
      })
    },
    deleteNoBtn () {
      this.deleteDialog = false
    },
    async setAlertProgramContent (result) {
      if (result.success) {
        this.programContentAlert.type = await 'success'
      } else {
        this.programContentAlert.type = await 'error'
      }

      if (result.response && typeof result.response === 'string') {
        this.programContentAlert.text = await result.response
      } else if (result.setText) {
        this.programContentAlert.text = await result.setText
      } else {
        this.programContentAlert.text = await 'Undefinied response'
      }

      this.loading = await false
      this.deleteDialog = await false
      this.dialogFormClose()
      this.programContentAlert.model = true
    }
  }
}
</script>
