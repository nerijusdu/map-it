<template>
  <modal name="previewCategory" height="auto">
    <div class="modal-title" :style="{background: category.color}">
      <div class="title">{{ category.title }}</div>
    </div>
    <div class="modal-content">
      <div class="preview-item-description">
        <p v-for="(par, i) in getParagraphs(category.description)" :key="i">{{ par }}</p>
      </div>
    </div>
    <div class="modal-footer">
      <md-button class="md-raised" @click="onClose">Close</md-button>
      <md-button class="md-raised md-primary" @click="() => editCategory({ categoryId: category.id, modal: $modal })">Edit</md-button>
    </div>
  </modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import formatService from '../../services/formatService';

export default {
  computed: {
    ...mapGetters('roadmap', ['categoryToPreview'])
  },
  watch: {
    categoryToPreview(val) {
      this.category = { ...val };
    }
  },
  data: () => ({
    category: {
      id: '',
      title: '',
      description: ''
    }
  }),
  methods: {
    ...mapActions('roadmap', ['editCategory']),
    onClose() {
      this.editCategory({ categoryId: null, modal: this.$modal });
      this.$modal.hide('previewCategory');
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
}

.modal-title > .title {
  flex-grow: 1;
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
