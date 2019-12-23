<template>
  <div class="logs-container">
    <paged-list
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
  </div>
</template>

<script>
import PagedList from './PagedList';
import api from '../services/api';

export default {
  data: () => ({
    api
  }),
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
