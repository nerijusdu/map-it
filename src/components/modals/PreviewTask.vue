<template>
  <modal name="previewTask" height="auto">
    <div class="modal-title">
      <div class="delete-icon">
        <img @click="() => confirmDelete(task.id)" src="@/assets/trash.svg" alt="Delete"/>
      </div>
      <div class="title">{{ task.title }}</div>
      <div class="checkbox">
        <md-checkbox v-model="task.isCompleted" @change="complete" class="md-primary" />
      </div>
    </div>
    <div class="modal-content">
      <div class="preview-item-description">
        <p v-for="(par, i) in getParagraphs(task.description)" :key="i">{{ par }}</p>
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
import { datePreviewFormat } from '../../constants';
import formatService from '../../services/formatService';
import resources from '../../services/resourceService';

export default {
  computed: {
    ...mapGetters('roadmap', ['taskToPreview'])
  },
  watch: {
    taskToPreview(val) {
      if (val) {
        this.task = { ...val };
      }
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
      isCompleted: false,
      startDate: moment(),
      endDate: moment()
    }
  }),
  methods: {
    ...mapActions('roadmap', ['editTask', 'completeTask', 'deleteTask']),
    onClose() {
      this.editTask({ taskId: null, modal: this.$modal });
      this.$modal.hide('previewTask');
    },
    complete(isCompleted) {
      this.completeTask({ id: this.task.id, isCompleted });
    },
    confirmDelete(id) {
      this.$modal.show('confirmation', {
        content: resources.deleteTaskMsg,
        confirmAction: () => {
          this.$modal.hide('previewTask');
          this.deleteTask(id);
        }
      });
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

.modal-title > .delete-icon {
  margin: 10px;
  cursor: pointer;
}
</style>
