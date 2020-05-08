<template>
  <div class="user-list-container">
    <md-table md-card>
      <md-table-row>
        <md-table-head>Name</md-table-head>
        <md-table-head>Email</md-table-head>
        <md-table-head>Permissions</md-table-head>
        <md-table-head></md-table-head>
      </md-table-row>
      <md-table-row v-for="u in users" v-bind:key="u.id">
        <md-table-cell>{{u.name}}</md-table-cell>
        <md-table-cell>{{u.email}}</md-table-cell>
        <md-table-cell>{{u.readonly ? 'Read-Only' : 'Edit'}}</md-table-cell>
        <md-table-cell>
          <div>
            <img
              src="@/assets/trash.svg"
              class="clickable"
              @click="() => confirmDelete(u.id)"
              alt="Delete"
              v-if="!readonly"
            />
          </div>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-table class="autocomplete-table" v-if="!readonly">
      <md-table-row>
        <md-autocomplete
          v-model="term"
          :md-options="suggestedUsers"
          @md-selected="selectUser"
          @md-changed="getUsers">
          <label>User name or email</label>
          <template slot="md-autocomplete-item" slot-scope="{ item }">{{ item.name }}</template>
        </md-autocomplete>
      </md-table-row>
      <md-table-row>
        <div class="controls-container">
          <div>
            <md-checkbox v-model="isReadonly" class="md-primary" :disabled="!selectedUser"/>
            <label>Read-Only?</label>
          </div>
          <md-button class="md-raised md-primary" :disabled="!selectedUser" @click="addUser">Add User</md-button>
        </div>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '../services/api';

export default {
  props: {
    roadmapId: {
      type: Number,
      required: true
    },
    users: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('app', ['user'])
  },
  data: () => ({
    isReadonly: false,
    selectedUser: null,
    term: null,
    suggestedUsers: []
  }),
  methods: {
    async getUsers(term) {
      if (!term || term.length < 1) {
        this.suggestedUsers = [];
        return;
      }

      const users = await api.findUsers(term, this.roadmapId, { ignoreLoading: true });
      this.suggestedUsers = (users ? users.data : []).map(x => ({
        ...x,
        toLowerCase: () => x.name.toLowerCase(),
        toString: () => x.name
      }));
    },
    selectUser(user) {
      this.selectedUser = user;
    },
    async addUser() {
      if (!this.selectedUser) {
        return;
      }
      await api.assignUserToRoadmap({
        userId: this.selectedUser.id,
        roadmapId: this.roadmapId,
        readonly: this.isReadonly
      }, {
        ignoreLoading: true
      });

      this.selectedUser = {
        toLowerCase: () => '',
        toString: () => ''
      };
      this.isReadonly = null;
      this.term = '';
      this.$emit('update');
    },
    async confirmDelete(userId) {
      await api.assignUserToRoadmap({
        userId,
        roadmapId: this.roadmapId,
        revert: true
      }, {
        ignoreLoading: true
      });

      this.$emit('update');
    }
  }
};
</script>

<style scoped>
.user-list-container {
  width: 100%;
}

.autocomplete-table {
  padding-left: 10px;
  padding-right: 10px;
}

.controls-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.controls-container > div {
  display: flex;
  align-items: center;
}
</style>
