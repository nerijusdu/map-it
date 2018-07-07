<template>
  <modal name="addTask" height="auto">
    <div class="modal-title">
      <div>Add new task</div>
    </div>
    <form class="modal-content">
      <md-field :class="getValidationClass('title')">
        <label>Title</label>
        <md-input v-model="task.title"/>
        <span class="md-error" v-if="!$v.task.title.required">{{ messages.requiredMsg() }}</span>
      </md-field>
      <md-field :class="getValidationClass('description')">
        <label>Description</label>
        <md-textarea v-model="task.description"/>
        <span class="md-error" v-if="!$v.task.description.required">{{ messages.maxLengthMsg(500) }}</span>
      </md-field>
      <md-field :class="getValidationClass('category')">
        <label for="category">Category</label>
        <md-select name="category" id="category" v-model="task.category">
          <md-option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.title }}</md-option>
        </md-select>
        <span class="md-error" v-if="!$v.task.category.required">{{ messages.requiredMsg() }}</span>
      </md-field>
      <md-datepicker md-immediately v-model="task.startDate" :md-disabled-dates="disabledDates(roadmapTimeFrame)">
        <label>Start date</label>
      </md-datepicker>
      <md-datepicker md-immediately v-model="task.endDate" :md-disabled-dates="disabledDates(roadmapTimeFrame)">
        <label>End date</label>
      </md-datepicker>
    </form>
    <div class="modal-footer">
      <md-button class="md-raised md-accent" @click="onClose">Cancel</md-button>
      <md-button class="md-raised md-primary" @click="validateTask">Save</md-button>
    </div>
  </modal>
</template>

<script>
import moment from 'moment';
import { mapState, mapActions, mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, maxLength } from 'vuelidate/lib/validators';
import * as messages from '@/util/messages';

export default {
  name: 'AddEditTask',
  mixins: [validationMixin],
  computed: {
    ...mapState({
      categories: state => state.roadmap.current.categories,
    }),
    ...mapGetters('roadmap', ['taskToEdit', 'roadmapTimeFrame'])
  },
  data: () => ({
    task: {
      id: '',
      title: '',
      description: '',
      category: '',
      startDate: moment().toDate(),
      endDate: moment().toDate()
    },
    messages
  }),
  methods: {
    ...mapActions('roadmap', {
      saveTaskToStore: 'saveTask',
      editTask: 'editTask'
    }),
    saveTask() {
      this.saveTaskToStore({
        ...this.task,
        startDate: moment(this.task.startDate),
        endDate: moment(this.task.endDate)
      });
      this.clearForm();
      if (this.taskToEdit) {
        this.editTask({ taskId: null, modal: this.$modal });
      }
      this.$modal.hide('addTask');
    },
    onClose() {
      if (this.taskToEdit) {
        this.clearForm();
        this.editTask({ taskId: null, modal: this.$modal });
      }
      this.$modal.hide('addTask');
    },
    getValidationClass(fieldName) {
      const field = this.$v.task[fieldName];

      return field ? { 'md-invalid': field.$invalid && field.$dirty } : {};
    },
    validateTask() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveTask();
      }
    },
    clearForm() {
      this.$v.$reset();
      this.task.title = '';
      this.task.description = '';
      this.task.category = '';
      this.task.startDate = moment().toDate();
      this.task.endDate = moment().toDate();
    },
    disabledDates: timeFrame => (date) => {
      const d = moment(date);

      return !(d.isSameOrAfter(timeFrame.startDate, 'day') && d.isSameOrBefore(timeFrame.endDate, 'day'));
    }
  },
  validations: {
    task: {
      title: { required },
      description: { maxLength: maxLength(500) },
      category: { required }
    }
  },
  watch: {
    taskToEdit(val) {
      this.task = { ...val };
    }
  }
};
</script>
