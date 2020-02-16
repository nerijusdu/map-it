<template>
  <div>
    <md-button class="md-button md-raised md-primary" @click="window.location.href = authUrl">
      <span>Link Google account</span>
      <img src="@/assets/link.svg"/>
    </md-button>
  </div>
</template>

<script>
import qs from 'querystring';
import { mapState, mapActions } from 'vuex';
import { googleCredentials } from '../constants';


export default {
  computed: {
    ...mapState({
      userId: state => state.app.user.id
    }),
    authUrl() {
      const params = {
        include_granted_scopes: true,
        client_id: googleCredentials.client_id,
        scope: googleCredentials.scope,
        redirect_uri: googleCredentials.redirect_uris[0],
        response_type: 'code',
        state: this.userId
      };

      return `${googleCredentials.auth_uri}?${qs.stringify(params)}`;
    }
  },
  methods: {
    ...mapActions('app', ['showError', 'showMessage'])
  },
  mounted() {
    if (this.$route.query.googleAuthSuccess) {
      const success = this.$route.query.googleAuthSuccess.toLowerCase() === 'true';

      if (success) {
        this.showMessage('Acount linked successfully!');
      } else {
        this.showError('Account linking failed!');
      }

      this.$router.replace({
        ...this.$router.currentRoute,
        query: {}
      });
    }
  }
};
</script>
