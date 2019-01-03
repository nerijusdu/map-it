<template>
  <md-table md-card>
    <md-table-toolbar>
      <h1 class="md-title">Roadmaps</h1>
    </md-table-toolbar>
    <md-table-row class="header">
      <md-table-head>Title</md-table-head>
      <md-table-head>Date Created</md-table-head>
    </md-table-row>
    <md-table-row v-for="r in roadmaps" v-bind:key="r.id">
      <md-table-cell>{{ r.title }}</md-table-cell>
      <md-table-cell>{{ r.createdDate.format(datePreviewFormat) }}</md-table-cell>
      <md-table-cell class="controls">
        <img src="@/assets/edit.svg"/>
      </md-table-cell>
    </md-table-row>
  </md-table>
</template>

<script>
import { mapState } from 'vuex';
import { datePreviewFormat } from '@/util/constants';

export default {
  computed: {
    ...mapState({
      roadmaps: state => state.roadmap.all
    })
  },
  data: () => ({
    datePreviewFormat,
  })
};
</script>

<style scoped>
.md-table {
  margin: 10px;
}
.md-table-row:not(.header) {
  cursor: pointer;
}
.controls {
  display: flex;
  justify-content: flex-end;
}
</style>
