<template>
  <div class="container flex-center">
    <form class="form">
      <div class="form-header">Register</div>
      <div class="form-content">
        <md-field :class="getValidationClass('email')" @keyup.native.enter="validateForm">
          <label>Email</label>
          <md-input v-model="user.email" name="email"/>
          <span class="md-error" v-if="!$v.user.email.required">{{ resources.requiredMsg }}</span>
          <span class="md-error" v-if="!$v.user.email.email">{{ resources.invalidEmailMsg }}</span>
        </md-field>
        <md-field :class="getValidationClass('name')" @keyup.native.enter="validateForm">
          <label>Name</label>
          <md-input v-model="user.name" name="name"/>
          <span class="md-error" v-if="!$v.user.name.required">{{ resources.requiredMsg }}</span>
          <span class="md-error" v-if="!$v.user.name.minLength">{{ resources.minLengthMsg($v.user.name.$params.minLength.min) }}</span>
        </md-field>
        <md-field :md-toggle-password="false" :class="getValidationClass('password')" @keyup.native.enter="validateForm">
          <label>Password</label>
          <md-input v-model="user.password" type="password" name="password"/>
          <span class="md-error" v-if="!$v.user.password.required">{{ resources.requiredMsg }}</span>
          <div class="md-error" v-if="!$v.user.password.minLength">{{ resources.minLengthMsg($v.user.password.$params.minLength.min) }}</div>
        </md-field>
        <md-field :md-toggle-password="false" :class="getValidationClass('repeatPassword')" @keyup.native.enter="validateForm">
          <label>Repeat password</label>
          <md-input v-model="user.repeatPassword" type="password" name="repeatPassword"/>
          <span class="md-error" v-if="!$v.user.repeatPassword.required">{{ resources.requiredMsg }}</span>
          <div class="md-error" v-if="!$v.user.repeatPassword.sameAs">Passwords don't match</div>
        </md-field>
      </div>
      <div class="form-footer">
        <md-button class="md-raised" @click="back">Back</md-button>
        <md-button class="md-raised md-primary" @click="validateForm">
          <div v-if="!isLoading">Register</div>
          <md-progress-spinner v-if="isLoading" :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
        </md-button>
      </div>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';
import resources from '../services/resourceService';
import api from '../services/api';

export default {
  mixins: [validationMixin],
  data: () => ({
    user: {
      email: '',
      name: '',
      password: '',
      repeatPassword: ''
    },
    resources,
    isLoading: false
  }),
  methods: {
    ...mapActions('app', ['saveUser', 'showMessage']),
    submit() {
      this.isLoading = true;
      api
        .register(this.user, {
          ignoreLoading: true
        })
        .then((res) => {
          this.isLoading = false;

          if (res) {
            this.showMessage('Registration successful! Please login.');
            this.$router.push('/login');
          }
        });
    },
    back() {
      this.$router.push('/login');
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
      email: {
        required,
        email
      },
      name: {
        required,
        minLength: minLength(3)
      },
      password: {
        required,
        minLength: minLength(6)
      },
      repeatPassword: {
        required,
        sameAs: sameAs('password')
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
  height: 400px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  box-shadow: 1px 1px 5px 2px var(--secondary-bg-color);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.form-header {
  width: 100%;
  text-align: center;
  margin-top: 20px;
  font-size: large;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
}

.spinner {
  height: 30px;
  width: 30px;
  align-self: center;
}
</style>
