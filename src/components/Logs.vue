<template>
  <div class="logs-container">
    <md-table>
      <md-table-toolbar class="toolbar">
        <h1>Logs</h1>
        <div class="page-controls">
          <img src="@/assets/arrow-left.svg" v-show="page !== 1" @click="changePage(page - 1)"/>
          <div>Page: {{page}} of {{totalPages}}</div>
          <img src="@/assets/arrow-right.svg" v-show="page !== totalPages" @click="changePage(page + 1)"/>
        </div>
        <div class="checkbox">
          <md-checkbox v-model="onlyErrors" @change="getLogs(true)"/>
          <label>Only errors</label>
        </div>
      </md-table-toolbar>
      <md-table-row class="header">
        <md-table-head>Message</md-table-head>
        <md-table-head>Level</md-table-head>
        <md-table-head>Timestamp</md-table-head>
      </md-table-row>
      <md-table-row v-for="log in logs" v-bind:key="log.log_id">
        <md-table-cell class="clickable">{{ log.message }}</md-table-cell>
        <md-table-cell class="clickable">{{ log.level }}</md-table-cell>
        <md-table-cell class="clickable">{{ log.timestamp }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import { datePreviewFormat } from '../constants';
import api from '../services/api';

export default {
  data: () => ({
    datePreviewFormat,
    logs: [],
    onlyErrors: false,
    page: 1,
    totalPages: 1
  }),
  methods: {
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.page = page;
        this.getLogs();
      }
    },
    async getLogs(resetPaging) {
      if (resetPaging) {
        this.page = 1;
      }

      const res = await api.getLogs({
        level: this.onlyErrors ? 'error' : undefined,
        page: this.page,
        pageSize: 5
      }, {
        ignoreLoading: true
      });
      if (res.ok) {
        this.logs = res.data.items;
        this.totalPages = res.data.pageCount;
      }
    }
  },
  created() {
    this.getLogs();
  }
};
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
}

.page-controls {
  display: flex;
}

.page-controls > div {
  margin: 5px;
}

.page-controls > img {
  cursor: pointer;
}

.checkbox {
  display: flex;
  align-items: center;
}
</style>
