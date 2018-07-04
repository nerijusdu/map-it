<template>
  <modal name="previewTask" height="auto">
    <div class="modal-title">
      <div>{{ task.title }}</div>
    </div>
    <div class="modal-content">
      <div class="preview-item-description">
        <p v-for="(par, i) in getParagraphs(task.description)" :key="i">{{ par }}</p>
        {{ task.description }}
      </div>
      <div class="preview-item-category" :style="{background: task.category.color}">
        {{ task.category.title }}
      </div>
      <div class="preview-item-dates">
        <div><span>From:</span> <span>{{ task.startDate.format(datePreviewFormat) }}</span></div>
        <div><span>To: </span><span>{{ task.endDate.format(datePreviewFormat) }}</span></div>
      </div>
    </div>
    <div class="modal-footer">
      <md-button class="md-raised" @click="onClose">Close</md-button>
      <md-button class="md-raised md-primary" @click="() => editTask({ taskId: task.id, modal: $modal })">Edit</md-button>
    </div>
  </modal>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
import { datePreviewFormat } from '@/util/constants';
import { getParagraphs } from '@/util/functions';

export default {
  computed: {
    ...mapGetters('roadmap', ['taskToPreview'])
  },
  watch: {
    taskToPreview(val) {
      this.task = { ...val };
    }
  },
  data: () => ({
    datePreviewFormat,
    task: {
      id: '',
      title: '',
      description: '',
      category: {
        color: '',
        title: ''
      },
      startDate: moment(),
      endDate: moment()
    }
  }),
  methods: {
    ...mapActions('roadmap', ['editTask']),
    onClose() {
      this.editTask({ taskId: null, modal: this.$modal });
      this.$modal.hide('previewTask');
    },
    getParagraphs
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
</style>
