<template>
  <div class="container flex-center">
    <form class="login-form">
      <div class="login-form-content">
        <md-field :class="getValidationClass('email')" @keyup.native.enter="validateForm">
          <label>Email</label>
          <md-input v-model="user.email"/>
          <span class="md-error" v-if="!$v.user.email.required">{{ messages.requiredMsg() }}</span>
          <span class="md-error" v-if="!$v.user.email.email">{{ messages.invalidEmailMsg() }}</span>
        </md-field>
        <md-field :md-toggle-password="false" :class="getValidationClass('password')" @keyup.native.enter="validateForm">
          <label>Password</label>
          <md-input v-model="user.password" type="password"/>
          <span class="md-error" v-if="!$v.user.password.required">{{ messages.requiredMsg() }}</span>
        </md-field>
      </div>
      <div class="login-form-footer">
        <md-button class="md-raised">Register</md-button>
        <md-button class="md-raised md-primary" @click="validateForm">
          <div v-if="!isLoading">Login</div>
          <md-progress-spinner v-if="isLoading" :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
        </md-button>
      </div>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';
import * as messages from '@/util/messages';
import api from '@/util/api';

export default {
  mixins: [validationMixin],
  data: () => ({
    user: {
      email: '',
      password: ''
    },
    messages,
    isLoading: false
  }),
  methods: {
    ...mapActions('app', ['saveUser']),
    submit() {
      this.isLoading = true;
      api
        .login(this.user)
        .then((user) => {
          this.isLoading = false;
          this.saveUser(user.data);
          this.$router.push({ name: 'Timeline' });
        });
    },
    register() { },
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
  }
};
</script>


<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}

.login-form {
  width: 280px;
  height: 200px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  box-shadow: 1px 1px 5px 2px var(--secondary-bg-color);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.login-form-footer {
  display: flex;
  justify-content: flex-end;
}

.spinner {
  height: 30px;
  width: 30px;
  align-self: center;
}
</style>
