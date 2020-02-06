<template>
  <div>
    Settings
    <a :href="authUrl">Link google account</a>
  </div>
</template>

<script>
import qs from 'querystring';
import { mapState } from 'vuex';
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
  }
};
</script>
