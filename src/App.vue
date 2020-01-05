<template>
  <div id="app">
    <modals />
    <message />
    <router-view name="navigation" />
    <loading v-show="isLoading"/>
    <router-view v-show="!isLoading"/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import './services/api';
import Modals from './components/modals/Index';
import Loading from './components/Loading';
import Message from './components/Message';
import notificationService from './services/notificationService';

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
  async created() {
    await this.init();
    if ('serviceWorker' in navigator) {
      const workerRegistration = await navigator.serviceWorker.register('sw.js');
      notificationService.setupPushNotifications(workerRegistration);
    }
  }
};
</script>

<style>
#app {
  height: 100%;
  width: 100%;
}
</style>
