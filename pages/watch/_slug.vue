<template>
  <v-container grid-list-md>
    <div v-if="!result.available">
      <v-alert type="error" :value="true">
        Program acara tidak sesuai schedule atau sudah berlalu dari jam tayang.<br/>
        <v-btn outline color="white" to="/">Kembali ke beranda</v-btn>
      </v-alert>
    </div>

    <div v-else>
      <v-card>
        asas
      </v-card>
    </div>
  </v-container>
</template>

<script>
export default {
  async asyncData ({ params, $axios, redirect }) {
    const res = await $axios.$get(`/api/watch/${params.slug}`)
    const ret = await {}

    if (res.success) {
      if (res.data === null || res.data.length <= 0) {
        redirect(`/programs/${params.slug}`)
      } else {
        ret['available'] = await true
        ret['res'] = await res
      }
    } else {
      redirect(`/programs/${params.slug}`)
    }

    return {
      result: ret
    }
  },

  data: () => ({
    alertModel: true
  })
}
</script>
