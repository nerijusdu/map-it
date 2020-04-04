<template>
  <md-tab data-cy="tab-task" id="tab-home" md-label="Task" @click="() => $emit('click')">
    <input type="hidden" v-model="modelChange" />
    <md-field :class="getValidationClass('title')" data-cy="task-title-input">
      <label>Title</label>
      <md-input v-model="model.title"/>
      <span class="md-error" v-if="!$v.model.title.required">{{ resources.requiredMsg }}</span>
      <span class="md-error" v-if="!$v.model.title.minLength && $v.model.title.required">{{ resources.minLengthMsg(3) }}</span>
    </md-field>
    <md-field :class="getValidationClass('description')" data-cy="task-description-input">
      <label>Description</label>
      <md-textarea v-model="model.description"/>
      <span class="md-error" v-if="!$v.model.description.required">{{ resources.maxLengthMsg(descriptionLength) }}</span>
    </md-field>
    <md-field :class="getValidationClass('categoryId')" data-cy="task-category-input">
      <label for="categoryId">Category</label>
      <md-select name="categoryId" v-model="model.categoryId">
        <md-option v-for="cat in categoriesForTasks" :key="cat.id" :value="cat.id">{{ cat.title }}</md-option>
      </md-select>
      <span class="md-error" v-if="!$v.model.categoryId.required">{{ resources.requiredMsg }}</span>
    </md-field>
    <md-datepicker md-immediately v-model="model.startDate" :md-disabled-dates="disabledDates(roadmapTimeFrame)" data-cy="task-start-date">
      <label>Start date</label>
    </md-datepicker>
    <md-datepicker md-immediately v-model="model.endDate" :md-disabled-dates="disabledDates(roadmapTimeFrame)" data-cy="task-end-date">
      <label>End date</label>
    </md-datepicker>
  </md-tab>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters, mapState } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, maxLength, minLength } from 'vuelidate/lib/validators';
import resources from '../../../services/resourceService';
import { validationRules } from '../../../constants';

export default {
  mixins: [validationMixin],
  data: () => ({
    model: {
      id: '',
      title: '',
      description: '',
      categoryId: '',
      startDate: moment().toDate(),
      endDate: moment().toDate()
    },
    resources,
    descriptionLength: validationRules.descriptionLength
  }),
  computed: {
    ...mapState({
      categories: state => state.categories.items
    }),
    ...mapGetters({
      modelToEdit: 'tasks/taskToEdit',
      roadmapTimeFrame: 'roadmap/roadmapTimeFrame'
    }),
    modelChange() {
      this.clearForm(this.modelToEdit);
      return this.modelToEdit ? this.modelToEdit.id : '';
    },
    categoriesForTasks() {
      const cats = this.categories || [];
      return cats.filter(x => !!x.parentCategoryId || !cats.some(y => y.parentCategoryId === x.id));
    }
  },
  methods: {
    ...mapActions({
      editEntity: 'tasks/editTask',
      saveToStore: 'tasks/saveTask'
    }),
    getValidationClass(fieldName) {
      const field = this.$v.model[fieldName];
      return field ? { 'md-invalid': field.$invalid && field.$dirty } : {};
    },
    disabledDates: timeFrame => (date) => {
      const d = moment(date);
      return !(d.isSameOrAfter(timeFrame.startDate, 'day') && d.isSameOrBefore(timeFrame.endDate, 'day'));
    },
    async validateAndSave() {
      const form = this.$v.model;
      form.$touch();
      if (form.$invalid) {
        return;
      }

      const success = await this.saveToStore(this.model);
      if (!success) {
        return;
      }

      this.beforeClose();
      this.$modal.hide('addRoadmapEntity');
    },
    clearForm(data) {
      if (data) {
        this.model = { ...data };
        this.$emit('select-tab');
        return;
      }
      this.$v.$reset();
      this.model.id = '';
      this.model.title = '';
      this.model.description = '';
      this.model.categoryId = this.categories && this.categories.length > 0 ? this.categories[0].id : '';
      this.model.startDate = moment().toDate();
      this.model.endDate = moment().toDate();
    },
    beforeClose() {
      this.clearForm();
      if (this.modelToEdit) {
        this.editEntity({ taskId: null, modal: this.$modal });
      }
    }
  },
  validations: {
    model: {
      title: { required, minLength: minLength(3) },
      description: { maxLength: maxLength(validationRules.descriptionLength) },
      categoryId: { required }
    }
  }
};
</script>
