<template>
  <md-snackbar :md-position="'left'" :md-duration="400" :md-active="!!errorMessage" md-persistent>
    <span>{{errorMessage}}</span>
    <md-button class="md-icon-button close-button" @click="hide">
      <i class="fas fa-times"></i>
    </md-button>
  </md-snackbar>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState({
      errorMessage: state => state.app.error
    })
  },
  methods: {
    ...mapMutations('app', ['mShowError']),
    hide() {
      this.mShowError('');
    }
  }
};
</script>

<style scoped>
.md-snackbar {
  background: var(--accent-color) !important;
}
.close-button {
  margin-left: 20px !important;
}
</style>
