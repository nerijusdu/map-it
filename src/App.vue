<template>
  <div id="app">
    <modals />
    <error-message />
    <router-view name="navigation" />
    <router-view v-if="!isLoading"/>
    <loading v-if="isLoading"/>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import api from '@/util/api';
import Modals from './components/modals';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';

export default {
  name: 'App',
  components: {
    Modals,
    Loading,
    ErrorMessage
  },
  computed: {
    ...mapState({
      isLoading: state => state.app.isLoading
    })
  },
  methods: {
    ...mapMutations('app', ['mSaveUser']),
    ...mapActions('app', ['saveUser', 'initData'])
  },
  created() {
    const token = window.localStorage.getItem('token');
    if (token) {
      this.mSaveUser({ token });
      api.getUserInfo({ ignoreLoading: true })
        .then((res) => {
          if (res && res.data.token) {
            this.saveUser(res.data);
            this.initData();
            this.$router.push('Timeline');
          } else {
            window.localStorage.removeItem('token');
          }
        });
    }
  }
};
</script>
