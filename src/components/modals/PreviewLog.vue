<template>
  <modal name="preview-log" @before-open="beforeOpen" height="auto" :scrollable="true">
    <div :class="['modal-title', level]">
      <div>Preview Log Entry</div>
    </div>
    <div class="modal-content">
      <div class="log-field">
        <div class="log-field-title">Log ID:</div>
        <div class="log-field-content">{{logId}}</div>
      </div>
      <div class="log-field">
        <div class="log-field-title">Level:</div>
        <div class="log-field-content">{{level}}</div>
      </div>
      <div class="log-field">
        <div class="log-field-title">Timestamp:</div>
        <div class="log-field-content">{{timestamp}}</div>
      </div>
      <div class="log-field">
        <div class="log-field-title">Message:</div>
        <div class="log-field-content">{{message}}</div>
      </div>
      <div class="log-field" v-show="!!stack">
        <div class="log-field-title">Stack:</div>
        <div class="log-field-content">
          <!-- {{stack}} -->
          <md-field>
            <md-textarea v-model="stack" readonly md-autogrow/>
          </md-field>
        </div>
      </div>
      <div class="log-field">
        <div class="log-field-title">Raw log:</div>
        <div class="log-field-content">
          <md-field>
            <md-textarea v-model="raw" readonly md-autogrow/>
          </md-field>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <md-button class="md-raised md-accent" @click="onClose">Close</md-button>
    </div>
  </modal>
</template>

<script>
export default {
  data: () => ({
    level: null,
    message: null,
    timestamp: null,
    logId: null,
    stack: null,
    raw: null
  }),
  methods: {
    prettyJson(value) {
      if (!value) return '';
      return JSON.stringify(value, null, 2);
    },
    onClose() {
      this.reset();
      this.$modal.hide('preview-log');
    },
    reset() {
      this.level = null;
      this.message = null;
      this.timestamp = null;
      this.logId = null;
      this.stack = null;
      this.raw = null;
    },
    beforeOpen(event) {
      const log = event.params;
      this.level = log.level;
      this.message = log.message;
      this.timestamp = log.timestamp;
      this.logId = log.log_id;
      this.stack = log.stack;
      this.raw = this.prettyJson(log);
    }
  }
};
</script>

<style scoped>
.modal-content {
  margin-top: 10px;
  display: flex;
}

.modal-title.error {
  background-color: var(--accent-color);
}

.log-field {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}

.log-field-title {
  width: 100px;
}

.log-field-content {
  flex-grow: 1;
}

.md-field {
  padding-top: 0px;
}
</style>
