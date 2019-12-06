<template>
  <modal name="previewEpic" height="auto">
    <div class="modal-title" :style="{background: epic.color}">
      <div class="title">{{ epic.title }}</div>
    </div>
    <div class="modal-content">
      <div class="preview-item-description">
        <p v-for="(par, i) in getParagraphs(epic.description)" :key="i">{{ par }}</p>
      </div>
      <div class="category-list">
        <div>Categories:</div>
        <div
          class="preview-item-category"
          v-for="category in epic.categories"
          :key="category.id"
          :style="{background: category.color}">
          {{ category.title }}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <md-button class="md-raised" @click="onClose">Close</md-button>
      <md-button class="md-raised md-primary" @click="() => editEpic({ epicId: epic.id, modal: $modal })">Edit</md-button>
    </div>
  </modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { datePreviewFormat } from '../../constants';
import formatService from '../../services/formatService';

export default {
  computed: {
    ...mapGetters('roadmap', ['epicToPreview'])
  },
  watch: {
    epicToPreview(val) {
      this.epic = {
        ...val
      };
    }
  },
  data: () => ({
    datePreviewFormat,
    epic: {
      id: '',
      title: '',
      color: ''
    }
  }),
  methods: {
    ...mapActions('roadmap', ['editEpic']),
    onClose() {
      this.editEpic({ epicId: null, modal: this.$modal });
      this.$modal.hide('previewEpic');
    },
    getParagraphs: formatService.getParagraphs
  }
};
</script>

<style>
.preview-item-modal > .modal-content > * {
  margin-top: 10px;
  margin-bottom: 10px;
}

.preview-item-description {
  overflow-y: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  max-height: 50vh;
}

.preview-item-dates > div {
  display: flex;
  width: 50%;
  justify-content: space-between;
}

.preview-item-category {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  margin-bottom: 5px;
}

.modal-title > .title {
  flex-grow: 1;
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
