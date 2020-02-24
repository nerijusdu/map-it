<template>
  <md-snackbar :class="isError ? 'error' : ''" :md-position="'left'" :md-duration="400" :md-active="!!text" md-persistent>
    <span>{{text}}</span>
    <md-button class="md-icon-button close-button" @click="hide">
      <img src="@/assets/x.svg"/>
    </md-button>
  </md-snackbar>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState({
      text: state => state.app.message.text,
      isError: state => state.app.message.isError
    })
  },
  methods: {
    ...mapMutations('app', ['mShowMessage']),
    hide() {
      this.mShowMessage({ text: '' });
    }
  }
};
</script>

<style scoped>
.md-snackbar.error {
  background: var(--accent-color) !important;
  z-index: 1000;
}
.md-snackbar {
  background: var(--primary-color) !important;
}
.close-button {
  margin-left: 20px !important;
}
</style>
