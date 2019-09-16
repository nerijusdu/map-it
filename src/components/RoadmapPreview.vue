<template>
  <div class="roadmap-details" v-if="roadmap.id">
    <div class="roadmap-info-container">
      <h2 class="roadmap-title">{{ roadmap.title }}</h2>
      <div>
        <div class="row-title">Description:</div>
        <div class="row-description">{{ roadmap.description }}</div>
      </div>
      <div>
        <div class="row-title">Start date:</div>
        <div class="row-description">{{ roadmap.startDate.format(datePreviewFormat) }}</div>
      </div>
      <div>
        <div class="row-title">End date:</div>
        <div class="row-description">{{ roadmap.endDate.format(datePreviewFormat) }}</div>
      </div>
    </div>
    <div class="roadmap-controls-container">
      <div class="clickable" :style="{ border: '1px solid var(--primary-color)'}" @click="() => editRoadmap({ roadmapId: roadmap.id, modal: $modal })">
        <img src="@/assets/edit.svg" alt="Edit"/>
        <div>Edit</div>
      </div>
      <div class="clickable" :style="{ border: '1px solid var(--accent-color)'}" @click="() => confirmDelete(roadmap.id)">
        <img src="@/assets/trash.svg" alt="Delete"/>
        <div>Delete</div>
      </div>
      <div class="clickable" :style="{ border: '1px solid white'}" @click="() => navigateToRoadmap(roadmap.id)">
        <img src="@/assets/arrow-right.svg" alt="Select"/>
        <div>Open</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import moment from 'moment';
import api from '../services/api';
import converterService from '../services/converterService';
import resources from '../services/resourceService';
import { datePreviewFormat } from '../constants';

export default {
  data: () => ({
    roadmap: {
      startDate: moment(),
      endDate: moment()
    },
    datePreviewFormat
  }),
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
  created() {
    const id = this.$route.params.id;
    // tries to refresh token again?
    api
      .getRoadmapById(id, { ignoreLoading: true })
      .then((result) => {
        if (!result || !result.ok) {
          this.$router.push('/roadmaps');
          return;
        }
        this.roadmap = converterService.roadmapFromApi(result.data);
      });
  }
};
</script>

<style scoped>
.roadmap-details {
  display: flex;
}

.roadmap-info-container, .roadmap-controls-container {
  margin: 20px;
  width: 50%;
  display: flex;
  flex-direction: column;
}

.roadmap-info-container > div {
  display: flex;
  margin-bottom: 10px;
}

.row-title {
  width: 30%;
}

.row-description {
  width: 70%;
}

.roadmap-title {
  align-self: center;
  margin-bottom: 20px;
}

.roadmap-controls-container {
  align-items: center;
}

.roadmap-controls-container > div {
  display: flex;
  margin: 5px;
  padding: 10px;
  border-radius: 5px;
  width: 200px;
}

.roadmap-controls-container > div > div {
  padding-left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

@media only screen and (max-width: 600px) {
  .roadmap-details {
    flex-direction: column;
  }

  .roadmap-info-container, .roadmap-controls-container {
    width: 90%;
    margin-left: 5%;
    margin-right: 5%;
  }
}
</style>