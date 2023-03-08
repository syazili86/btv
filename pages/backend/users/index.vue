<template>
  <div>
    
  </div>
</template>

<script>
export default {
  layout: 'admin',

  middleware: ['auth'],

  asyncData ({ redirect }) {
    redirect('/backend/under-maintenance')
  }
}
</script>
