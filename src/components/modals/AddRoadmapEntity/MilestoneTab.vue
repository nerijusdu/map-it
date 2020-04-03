<template>
  <md-tab id="tab-milestone" md-label="Milestone" @click="() => $emit('click')">
    <input type="hidden" v-model="modelChange" />
    <md-field :class="getValidationClass('title')" data-cy="milestone-title-input">
      <label>Title</label>
      <md-input v-model="model.title"/>
      <span class="md-error" v-if="!$v.model.title.required">{{ resources.requiredMsg }}</span>
      <span class="md-error" v-if="!$v.model.title.minLength && $v.model.title.required">{{ resources.minLengthMsg(3) }}</span>
    </md-field>
    <md-field :class="getValidationClass('color')" data-cy="milestone-color-input">
      <label>Color</label>
      <md-input v-model="model.color" type="color"/>
      <span class="md-error" v-if="!$v.model.color.required">{{ resources.requiredMsg }}</span>
    </md-field>
    <md-datepicker md-immediately v-model="model.date" :md-disabled-dates="disabledDates(roadmapTimeFrame)" data-cy="milestone-date-input">
      <label>Date</label>
    </md-datepicker>
  </md-tab>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';
import resources from '../../../services/resourceService';
import { validationRules } from '../../../constants';

export default {
  mixins: [validationMixin],
  data: () => ({
    model: {
      id: '',
      title: '',
      color: '#1eb980',
      date: moment().toDate()
    },
    resources,
    descriptionLength: validationRules.descriptionLength
  }),
  computed: {
    ...mapGetters({
      modelToEdit: 'milestones/milestoneToEdit',
      roadmapTimeFrame: 'roadmap/roadmapTimeFrame'
    }),
    modelChange() {
      this.clearForm(this.modelToEdit);
      return this.modelToEdit ? this.modelToEdit.id : '';
    },
  },
  methods: {
    ...mapActions({
      editEntity: 'milestones/editMilestone',
      saveToStore: 'milestones/saveMilestone'
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
      this.model.color = '#1eb980';
      this.model.date = moment().toDate();
    },
    beforeClose() {
      this.clearForm();
      if (this.modelToEdit) {
        this.editEntity({ milestoneId: null, modal: this.$modal });
      }
    }
  },
  validations: {
    model: {
      title: { required, minLength: minLength(3) },
      color: { required }
    }
  }
};
</script>
