<template>
  <div>
    <md-table md-card>
      <md-table-toolbar>
        <h1 class="md-title">Roadmaps</h1>
      </md-table-toolbar>
      <md-table-row class="header">
        <md-table-head>Title</md-table-head>
        <md-table-head>Date Created</md-table-head>
      </md-table-row>
      <md-table-row v-for="r in roadmaps" v-bind:key="r.id">
        <md-table-cell class="clickable">{{ r.title }}</md-table-cell>
        <md-table-cell class="clickable">{{ r.createdDate.format(datePreviewFormat) }}</md-table-cell>
        <md-table-cell>
          <div class="controls">
            <img src="@/assets/edit.svg" class="clickable" @click="() => editRoadmap({ roadmapId: r.id, modal: $modal })"/>
            <img src="@/assets/trash.svg" class="clickable" @click="() => confirmDelete(r.id)"/>
            <!-- select -->
            <!-- remove -->
          </div>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <div class="flex add-button">
      <md-button class="md-icon-button md-primary md-raised" @click="() => $modal.show('addRoadmap')">
        <i class="fas fa-plus"/>
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { datePreviewFormat } from '../constants';
import resources from '../services/resourceService';

export default {
  computed: {
    ...mapState({
      roadmaps: state => state.roadmap.all
    })
  },
  methods: {
    ...mapActions('roadmap', ['editRoadmap', 'deleteRoadmap']),
    confirmDelete(roadmapId) {
      this.$modal.show('confirmation', {
        content: resources.deleteRoadmapMsg,
        confirmAction: () => this.deleteRoadmap(roadmapId)
      });
    }
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
.controls {
  display: flex;
  justify-content: flex-end;
}
.controls > img {
  margin-left: 10px;
}
.add-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
