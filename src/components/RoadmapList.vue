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
        <md-table-cell class="clickable" @click.native="() => previewRoadmap(r.id)">{{ r.title }}</md-table-cell>
        <md-table-cell class="clickable" @click.native="() => previewRoadmap(r.id)">{{ r.createdDate.format(datePreviewFormat) }}</md-table-cell>
        <md-table-cell>
          <div class="controls">
            <img
              src="@/assets/edit.svg"
              class="clickable"
              @click="() => editRoadmap({ roadmapId: r.id, modal: $modal })"
              alt="Edit"
              v-show="!r.readonly"/>
            <img
              src="@/assets/trash.svg"
              class="clickable"
              @click="() => confirmDelete(r.id)"
              alt="Delete"
              v-show="!r.readonly"/>
            <img
              src="@/assets/arrow-right.svg"
              class="clickable"
              @click="() => navigateToRoadmap(r.id)"
              alt="Select"/>
          </div>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <div class="flex add-button">
      <md-button class="md-icon-button md-primary md-raised" @click="() => $modal.show('addRoadmap')">
        <img src="@/assets/plus.svg" alt="Add"/>
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
    ...mapActions('roadmap', ['editRoadmap', 'deleteRoadmap', 'selectRoadmap']),
    confirmDelete(roadmapId) {
      this.$modal.show('confirmation', {
        content: resources.deleteRoadmapMsg,
        confirmAction: () => this.deleteRoadmap(roadmapId)
      });
    },
    navigateToRoadmap(roadmapId) {
      this.selectRoadmap(roadmapId);
      this.$router.push('/timeline');
    },
    previewRoadmap(roadmapId) {
      this.$router.push(`/roadmaps/${roadmapId}`);
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

@media only screen and (max-width: 450px) {
  .controls {
    display: none;
  }
}
</style>
