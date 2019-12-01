<template>
  <modal name="previewMilestone" height="auto">
    <div class="modal-title" :style="{background: milestone.color}">
      <div class="title">{{ milestone.title }}</div>
    </div>
    <div class="modal-content">
      <div class="preview-item-dates">
        <div><span>Date:</span> <span>{{ milestone.date.format(datePreviewFormat) }}</span></div>
      </div>
    </div>
    <div class="modal-footer">
      <md-button class="md-raised" @click="onClose">Close</md-button>
      <md-button class="md-raised md-primary" @click="() => editMilestone({ milestoneId: milestone.id, modal: $modal })">Edit</md-button>
    </div>
  </modal>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
import { datePreviewFormat } from '../../constants';
import formatService from '../../services/formatService';

export default {
  computed: {
    ...mapGetters('roadmap', ['milestoneToPreview'])
  },
  watch: {
    milestoneToPreview(val) {
      this.milestone = {
        ...val,
        date: moment(val.date)
      };
    }
  },
  data: () => ({
    datePreviewFormat,
    milestone: {
      id: '',
      title: '',
      color: '',
      date: moment()
    }
  }),
  methods: {
    ...mapActions('roadmap', ['editMilestone']),
    onClose() {
      this.editMilestone({ milestoneId: null, modal: this.$modal });
      this.$modal.hide('previewMilestone');
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
