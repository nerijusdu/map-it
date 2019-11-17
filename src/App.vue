<template>
  <div id="app">
    <modals />
    <message />
    <router-view name="navigation" />
    <loading v-if="isLoading"/>
    <transition name="page" mode="out-in">
      <router-view v-if="!isLoading"/>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import './services/api';
import Modals from './components/modals/Index';
import Loading from './components/Loading';
import Message from './components/Message';

export default {
  name: 'App',
  components: {
    Modals,
    Loading,
    Message
  },
  computed: {
    ...mapState({
      isLoading: state => state.app.isLoading
    })
  },
  methods: {
    ...mapActions('app', ['init'])
  },
  created() {
    this.init();
  }
};
</script>

<style>
.page-enter-active, .page-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
  overflow: hidden;
}
.page-enter, .page-leave-active {
  opacity: 0;
}
#app {
  height: 100%;
  width: 100%;
}
</style>
