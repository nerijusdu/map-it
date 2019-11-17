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
import resources from '../services/resourceService';
import api from '../services/api';

export default {
  mixins: [validationMixin],
  data: () => ({
    user: {
      email: '',
      password: ''
    },
    resources,
    isLoading: false
  }),
  methods: {
    ...mapActions('app', ['saveUser']),
    async submit() {
      this.isLoading = true;
      const user = await api.login(this.user, {
        ignoreLoading: true,
        ignoreAuth: true
      });

      this.isLoading = false;
      if (user) {
        this.saveUser({ ...user.data, isLogin: true });
        this.$router.push('/timeline');
      }
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
  height: 250px;
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
  justify-content: flex-end;
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
