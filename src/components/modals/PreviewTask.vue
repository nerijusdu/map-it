<template>
  <modal name="previewTask" height="auto">
    <div class="modal-title">
      <div class="delete-icon" v-if="!readonly">
        <img @click="() => confirmDelete(task.id)" src="@/assets/trash.svg" alt="Delete"/>
      </div>
      <div class="title">{{ task.title }}</div>
      <div class="checkbox">
        <md-checkbox v-model="task.isCompleted" @change="complete" class="md-primary" :disabled="readonly"/>
      </div>
    </div>
    <div class="modal-content">
      <div class="preview-item-description">
        <p v-for="(par, i) in getParagraphs(task.description)" :key="i">{{ par }}</p>
      </div>
      <div class="preview-item-field">
        <div>
          <div>Assignee:</div>
          <md-field class="assignee-select">
            <md-select v-model="task.assigneeId" @md-selected="updateAssignee">
              <md-option v-for="a in availableAssignees" :key="a.id" :value="a.id">{{ a.name }}</md-option>
            </md-select>
          </md-field>
        </div>
        <div>
          <div>Category:</div>
          <div class="preview-item-category" :style="{background: task.category.color}">
            {{ task.category.title }}
          </div>
        </div>
        <div><div>From:</div> <div>{{ task.startDate.format(datePreviewFormat) }}</div></div>
        <div><div>To:</div><div>{{ task.endDate.format(datePreviewFormat) }}</div></div>
      </div>
    </div>
    <div class="modal-footer">
      <md-button class="md-raised" @click="onClose">Close</md-button>
      <md-button class="md-raised md-primary" v-if="!readonly" @click="() => editTask({ taskId: task.id, modal: $modal })">Edit</md-button>
    </div>
  </modal>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
import { datePreviewFormat } from '../../constants';
import formatService from '../../services/formatService';
import resources from '../../services/resourceService';
import api from '../../services/api';

export default {
  computed: {
    ...mapGetters('roadmap', ['taskToPreview', 'readonly'])
  },
  watch: {
    async taskToPreview(val) {
      this.initialized = false;
      if (val) {
        if (val.id !== this.task.id) {
          const res = await api.getUsersForRoadmap(val.roadmapId, { ignoreLoading: true });
          const users = [{ id: 0, name: 'Unassigned', email: '' }];
          this.availableAssignees = res
            ? users.concat(res.data)
            : users;
        }

        this.task = { ...val, assigneeId: val.assigneeId || 0 };
        this.initialized = true;
      }
    }
  },
  data: () => ({
    datePreviewFormat,
    initialized: false,
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
      endDate: moment(),
      assigneeId: 0
    },
    availableAssignees: [
      {
        id: 0,
        name: 'Unassigned'
      }
    ]
  }),
  methods: {
    ...mapActions('roadmap', [
      'editTask',
      'completeTask',
      'deleteTask',
      'assignUserToTask'
    ]),
    onClose() {
      this.editTask({ taskId: null, modal: this.$modal });
      this.initialized = false;
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
    updateAssignee(assigneeId) {
      if (!this.initialized) {
        return;
      }

      this.assignUserToTask({ userId: assigneeId, taskId: this.task.id });
    },
    getParagraphs: formatService.getParagraphs
  }
};
</script>

<style>
.modal-content {
  padding-bottom: 0px;
}

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

.preview-item-field > div {
  display: flex;
  width: 60%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
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

.assignee-select {
  margin: 0px;
  padding: 0px;
  min-height: auto;
  width: auto;
  margin-left: 10px;
}
</style>
