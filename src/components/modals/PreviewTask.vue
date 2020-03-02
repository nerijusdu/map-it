<template>
  <modal name="previewTask" height="auto" :scrollable="true">
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
        <div class="comment-box">
          <div>
            <span v-show="!isLoadingComments">Comments({{ commentCount }}):</span>
            <span v-show="isLoadingComments">Comments(<md-progress-spinner
                class="md-primary"
                md-mode="indeterminate"
                :md-stroke="3"
                :md-diameter="15"
              />):</span>
          </div>
          <div class="comment" v-for="comment in task.comments" :key="comment.id">
            <div><b>{{ comment.user.name }}:</b></div>
            <div><p v-for="(par, i) in getParagraphs(comment.text)" :key="i">{{ par }}</p></div>
          </div>
          <div class="comment-input">
            <md-field :class="newCommentError ? 'md-invalid' : ''">
              <label>Write a comment</label>
              <md-input v-model="newComment" @keyup.native.enter="writeComment"/>
              <span class="md-error" v-show="newCommentError">{{ newCommentError }}</span>
            </md-field>
            <img @click="() => writeComment(task.id)" src="@/assets/arrow-right-circle.svg" alt="Delete"/>
          </div>
        </div>
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
    ...mapGetters({
      taskToPreview: 'tasks/taskToPreview',
      readonly: 'roadmap/readonly'
    }),
    commentCount() {
      return this.task.comments ? this.task.comments.length : 0;
    },
    isLoadingComments() {
      return this.task.comments === undefined || this.postingComment;
    }
  },
  watch: {
    async taskToPreview(val) {
      this.initialized = false;
      if (val) {
        let comments = this.task.comments;
        if (val.id !== this.task.id) {
          await this.loadAssignees(val.roadmapId);
          comments = await this.loadComments(val.id);
        }

        this.task = {
          ...val,
          comments,
          assigneeId: val.assigneeId || 0
        };
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
      assigneeId: 0,
      comments: undefined
    },
    availableAssignees: [
      {
        id: 0,
        name: 'Unassigned'
      }
    ],
    newComment: '',
    newCommentError: '',
    postingComment: false
  }),
  methods: {
    ...mapActions('tasks', [
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
    async writeComment() {
      if (!this.newComment || this.newComment.length < 3 || this.newComment.length > 2000) {
        this.newCommentError = 'Comment must be between 3 and 2000 characters!';
        return;
      }

      this.postingComment = true;
      const res = await api.postComment({
        taskId: this.task.id,
        text: this.newComment
      }, { ignoreLoading: true });

      if (!res) {
        return;
      }

      this.task.comments.push(res.data);
      this.newComment = '';
      this.postingComment = false;
    },
    async loadAssignees(roadmapId) {
      const res = await api.getUsersForRoadmap(roadmapId, { ignoreLoading: true });
      const users = [{ id: 0, name: 'Unassigned', email: '' }];
      this.availableAssignees = res
        ? users.concat(res.data)
        : users;
    },
    async loadComments(taskId) {
      const res = await api.getTaskComments(taskId, { ignoreLoading: true });
      return res ? res.data : [];
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

.preview-item-field > div:not(.comment-box) {
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

.comment-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.comment {
  display: flex;
  margin-top: 10px;
}

.comment > div:first-of-type {
  margin-right: 10px;
}

.comment-input {
  width: 60%;
  display: flex;
}

.comment-input > img {
  margin-left: 5px;
  cursor: pointer;
}

@media only screen and (max-width: 600px) {
  .preview-item-field > div:not(.comment-box),
  .comment-box,
  .comment-input {
    width: 100%;
  }
}
</style>
