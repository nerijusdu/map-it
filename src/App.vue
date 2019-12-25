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
#app {
  height: 100%;
  width: 100%;
}
</style>
