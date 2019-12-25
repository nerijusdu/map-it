<template>
  <div class="logs-container">
    <paged-list
      ref="list"
      title="Logs"
      uniqueColumn="log_id"
      :fetchDataFunc="api.getLogs"
      :columns="[
        { name: 'Log ID', field: 'log_id' },
        { name: 'Message', field: 'message' },
        { name: 'Level', field: 'level' },
        { name: 'Timestamp', field: 'timestamp' }
      ]"
      :filterValues="{ onlyErrors: false }"
      @rowClick="handleRowClick"
    >
      <template v-slot:filters="props">
        <div class="checkbox">
          <md-checkbox
            v-model="props.filters.onlyErrors"
            @change="(checked) => {
              props.getData({
                resetPaging: true,
                filters: {
                  level: checked ? 'error' : undefined
                }
              });
            }"/>
          <label>Only errors</label>
        </div>
      </template>
    </paged-list>
    <md-button class="md-raised md-accent" @click="clearLogs">Clear logs</md-button>
  </div>
</template>

<script>
import PagedList from './PagedList';
import api from '../services/api';

export default {
  data: () => ({
    api
  }),
  methods: {
    async handleRowClick(item) {
      const res = await api.getLogById(item.log_id, { ignoreLoading: true });
      if (!res.ok) return;

      this.$modal.show('preview-log', { ...res.data });
    },
    clearLogs() {
      this.$modal.show('confirmation', {
        content: 'Are you sure you want to delete all log entries?',
        confirmAction: async () => {
          const res = await api.clearLogs();
          if (res.ok) {
            this.$refs.list.getData();
          }
        }
      });
    }
  },
  components: {
    PagedList
  }
};
</script>

<style scoped>
.checkbox {
  display: flex;
  align-items: center;
}
</style>
