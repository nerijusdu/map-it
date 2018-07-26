<template>
  <div id="app">
    <Modals />
    <router-view name="navigation" />
    <router-view/>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import api from '@/util/api';
import Modals from './components/modals';

export default {
  name: 'App',
  components: {
    Modals
  },
  methods: {
    ...mapMutations('app', ['mSaveUser']),
    ...mapActions('app', ['saveUser'])
  },
  created() {
    const token = window.localStorage.getItem('token');
    if (token) {
      this.mSaveUser({ token });
      api.getUserInfo()
        .then((res) => {
          if (res && res.data.token) {
            this.saveUser(res.data);
            this.$router.push('Timeline');
          }
        });
    }
  }
};
</script>
