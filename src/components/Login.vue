<template>
  <div class="container flex-center">
    <form class="form">
      <div class="form-header">Login</div>
      <div class="form-content">
        <md-field :class="getValidationClass('email')" @keyup.native.enter="validateForm">
          <label>Email</label>
          <md-input v-model="user.email" name="email"/>
          <span class="md-error" v-if="!$v.user.email.required">{{ resources.requiredMsg }}</span>
          <span class="md-error" v-if="!$v.user.email.email">{{ resources.invalidEmailMsg }}</span>
        </md-field>
        <md-field :md-toggle-password="false" :class="getValidationClass('password')" @keyup.native.enter="validateForm">
          <label>Password</label>
          <md-input v-model="user.password" type="password" name="password"/>
          <span class="md-error" v-if="!$v.user.password.required">{{ resources.requiredMsg }}</span>
        </md-field>
      </div>
      <div class="form-footer">
        <md-button class="md-raised" @click="register">Register</md-button>
        <md-button class="md-raised md-primary" @click="validateForm">
          <div>Login</div>
        </md-button>
        <md-button class="md-raised google-button" @click="useGoogle">
          <div class="google-button-content">
            <img src="@/assets/googleLogo32px.svg" width="24px"/>
          </div>
        </md-button>
      </div>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';
import qs from 'querystring';
import { googleCredentials } from '../constants';
import resources from '../services/resourceService';
import api from '../services/api';

const params = {
  include_granted_scopes: true,
  client_id: googleCredentials.client_id,
  scope: googleCredentials.scope,
  redirect_uri: googleCredentials.redirect_uris[0],
  response_type: 'code',
  state: '0'
};

const googleAuthUrl = `${googleCredentials.auth_uri}?${qs.stringify(params)}`;

export default {
  mixins: [validationMixin],
  data: () => ({
    user: {
      email: '',
      password: ''
    },
    resources
  }),
  methods: {
    ...mapActions('app', ['saveUser', 'showError']),
    async submit() {
      const user = await api.login(this.user, { ignoreAuth: true });

      if (user) {
        this.saveUser({ ...user.data, isLogin: true });
        this.$router.push('/timeline');
      }
    },
    useGoogle() {
      window.location.href = googleAuthUrl;
    },
    register() {
      this.$router.push('/register');
    },
    getValidationClass(fieldName) {
      const field = this.$v.user[fieldName];
      return field ? { 'md-invalid': field.$invalid && field.$dirty } : {};
    },
    validateForm() {
      this.$v.user.$touch();

      if (!this.$v.user.$invalid) {
        this.submit();
      }
    }
  },
  validations: {
    user: {
      email: { required, email },
      password: { required }
    }
  },
  async mounted() {
    if (this.$route.query.code) {
      const success = this.$route.query.code.toLowerCase() !== 'false';

      if (success) {
        const user = await api.login({ code: this.$route.query.code }, { ignoreAuth: true });

        if (user) {
          this.saveUser({ ...user.data, isLogin: true });
          this.$router.push('/timeline');
        }
      } else {
        this.showError('Login failed!');
        this.$router.replace({
          ...this.$router.currentRoute,
          query: {}
        });
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding-top: 10%;
  width: 100%;
  height: 100%;
}

.form {
  width: 280px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  box-shadow: 1px 1px 5px 2px var(--secondary-bg-color);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.form-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.form-footer > .md-button {
  flex-grow: 1;
  display: flex;
  margin-left: 0px;
}

.form-header {
  width: 100%;
  text-align: center;
  margin-top: 20px;
  font-size: large;
}

.spinner {
  height: 30px;
  width: 30px;
  align-self: center;
}
</style>
