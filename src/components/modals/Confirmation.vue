<template>
  <modal name="confirmation" @before-open="beforeOpen" height="auto">
    <div class="modal-title">
      <div>{{ title || 'Confirm' }}</div>
    </div>
    <div class="modal-content">
      {{ content || 'Are you sure?' }}
    </div>
    <div class="modal-footer">
      <md-button class="md-raised md-accent" @click="onClose">{{ cancelLabel || 'Cancel' }}</md-button>
      <md-button class="md-raised md-primary" @click="onConfirm">{{ confirmLabel || 'Confirm' }}</md-button>
    </div>
  </modal>
</template>

<script>
export default {
  data: () => ({
    title: null,
    content: null,
    cancelLabel: null,
    confirmLabel: null,
    confirmAction: () => null,
    closeAction: () => null
  }),
  methods: {
    onClose() {
      this.closeAction();
      this.reset();
      this.$modal.hide('confirmation');
    },
    onConfirm() {
      this.confirmAction();
      this.reset();
      this.$modal.hide('confirmation');
    },
    reset() {
      this.title = null;
      this.content = null;
      this.cancelLabel = null;
      this.confirmLabel = null;
      this.confirmAction = () => null;
      this.closeAction = () => null;
    },
    beforeOpen(event) {
      this.title = event.params.title;
      this.content = event.params.content;
      this.cancelLabel = event.params.cancelLabel;
      this.confirmLabel = event.params.confirmLabel;
      if (event.params.confirmAction) {
        this.confirmAction = event.params.confirmAction;
      }
      if (event.params.closeAction) {
        this.closeAction = event.params.closeAction;
      }
    }
  }
};
</script>

<style scoped>
.modal-content {
  margin-top: 10px;
  display: flex;
  align-items: center;
}
</style>
