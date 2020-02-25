<template>
  <div>
    <div class="settings-title">
      <h2>Settings</h2>
    </div>
    <md-button
      class="md-button md-raised md-primary"
      @click="linkGoogle"
      :disabled="settings.googleAccountLinked">
      <span v-if="!settings.googleAccountLinked">Link Google account</span>
      <span v-if="settings.googleAccountLinked">Google account linked</span>
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
      userId: state => state.app.user.id,
      settings: state => state.settings
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
    ...mapActions('app', ['showError', 'showMessage']),
    linkGoogle() {
      window.location.href = this.authUrl;
    }
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

<style scoped>
.settings-title {
  margin: 10px;
}
</style>
