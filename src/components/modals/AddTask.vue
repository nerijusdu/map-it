<template>
  <modal name="addTask" height="auto">
    <div class="modal-title">
      <div>{{ taskToEdit ? task.title : 'Create new' }}</div>
    </div>
    <form class="modal-content">
      <md-tabs>
        <md-tab id="tab-home" md-label="Task" @click="isCategory = false">
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
        </md-tab>
        <md-tab id="tab-category" md-label="Category" @click="isCategory = true">
          <md-field :class="getValidationClass('title')">
            <label>Title</label>
            <md-input v-model="category.title"/>
            <span class="md-error" v-if="!$v.category.title.required">{{ messages.requiredMsg() }}</span>
          </md-field>
          <md-field :class="getValidationClass('description')">
            <label>Description</label>
            <md-textarea v-model="category.description"/>
            <span class="md-error" v-if="!$v.category.description.required">{{ messages.maxLengthMsg(500) }}</span>
          </md-field>
          <md-field :class="getValidationClass('color')">
            <label>Color</label>
            <md-input v-model="category.color" type="color"/>
            <span class="md-error" v-if="!$v.category.color.required">{{ messages.requiredMsg() }}</span>
          </md-field>
        </md-tab>
      </md-tabs>
    </form>
    <div class="modal-footer">
      <md-button class="md-raised md-accent" @click="onClose">Cancel</md-button>
      <md-button class="md-raised md-primary" @click="validateForm">Save</md-button>
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
    category: {
      id: '',
      title: '',
      description: '',
      color: '#1eb980'
    },
    messages,
    isCategory: false
  }),
  methods: {
    ...mapActions('roadmap', {
      saveTaskToStore: 'saveTask',
      editTask: 'editTask',
      saveCategoryToStore: 'saveCategory'
    }),
    save() {
      if (!this.isCategory) {
        this.saveTaskToStore({
          ...this.task,
          startDate: moment(this.task.startDate),
          endDate: moment(this.task.endDate)
        });
      } else {
        this.saveCategoryToStore(this.category);
      }

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
      const field = this.isCategory ? this.$v.category[fieldName] : this.$v.task[fieldName];

      return field ? { 'md-invalid': field.$invalid && field.$dirty } : {};
    },
    validateForm() {
      const form = this.isCategory ? this.$v.category : this.$v.task;
      form.$touch();

      if (!form.$invalid) {
        this.save();
      }
    },
    clearForm() {
      this.$v.$reset();
      this.task.title = '';
      this.task.description = '';
      this.task.category = '';
      this.task.startDate = moment().toDate();
      this.task.endDate = moment().toDate();
      this.category.title = '';
      this.category.description = '';
      this.category.color = '#1eb980';
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
    },
    category: {
      title: { required },
      description: { maxLength: maxLength(500) },
      color: { required }
    }
  },
  watch: {
    taskToEdit(val) {
      this.task = { ...val };
    }
  }
};
</script>
