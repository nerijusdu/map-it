<template>
  <modal name="addRoadmap" height="auto">
    <div class="modal-title">
      <div>{{roadmapToEdit ? 'Edit roadmap' : 'Create new roadmap'}}</div>
    </div>
    <form class="modal-content">
      <md-field :class="getValidationClass('title')">
        <label>Title</label>
        <md-input v-model="roadmap.title"/>
        <span class="md-error" v-if="!$v.roadmap.title.required">{{ resources.requiredMsg }}</span>
      </md-field>
      <md-field :class="getValidationClass('description')">
        <label>Description</label>
        <md-textarea v-model="roadmap.description"/>
        <span class="md-error" v-if="!$v.roadmap.description.required">{{ resources.maxLengthMsg(descriptionLength) }}</span>
      </md-field>
      <md-datepicker md-immediately v-model="roadmap.startDate">
        <label>Start date</label>
      </md-datepicker>
      <md-datepicker md-immediately v-model="roadmap.endDate" :md-disabled-dates="disabledDates({ startDate: roadmap.startDate })">
        <label>End date</label>
      </md-datepicker>
    </form>
    <div class="modal-footer">
      <md-button class="md-raised md-accent" @click="onClose">Cancel</md-button>
      <md-button class="md-raised md-primary" @click="validateForm">Save</md-button>
    </div>
  </modal>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, maxLength } from 'vuelidate/lib/validators';
import resources from '../../services/resourceService';
import { validationRules } from '../../constants';

export default {
  name: 'AddEditRoadmap',
  mixins: [validationMixin],
  data: () => ({
    roadmap: {
      id: '',
      title: '',
      description: '',
      startDate: moment().toDate(),
      endDate: moment().toDate()
    },
    resources,
    descriptionLength: validationRules.descriptionLength
  }),
  computed: {
    ...mapGetters('roadmap', ['roadmapToEdit'])
  },
  methods: {
    ...mapActions('roadmap', {
      saveRoadmapToStore: 'saveRoadmap',
      editRoadmap: 'editRoadmap'
    }),
    async save() {
      const success = await this.saveRoadmapToStore(this.roadmap);

      if (!success) {
        return;
      }

      this.clearForm();
      if (this.roadmapToEdit) {
        this.editRoadmap({ roadmapId: null, modal: this.$modal });
      }
      this.$modal.hide('addRoadmap');
    },
    onClose() {
      if (this.roadmapToEdit) {
        this.clearForm();
        this.editRoadmap({ roadmapId: null, modal: this.$modal });
      }
      this.$modal.hide('addRoadmap');
    },
    getValidationClass(fieldName) {
      const field = this.$v.roadmap[fieldName];

      return field ? { 'md-invalid': field.$invalid && field.$dirty } : {};
    },
    validateForm() {
      const form = this.$v.roadmap;
      form.$touch();

      if (!form.$invalid) {
        this.save();
      }
    },
    clearForm() {
      this.$v.$reset();
      this.roadmap.id = '';
      this.roadmap.title = '';
      this.roadmap.description = '';
      this.roadmap.startDate = moment().toDate();
      this.roadmap.endDate = moment().toDate();
    },
    disabledDates: timeFrame => (date) => {
      const d = moment(date);

      return !((timeFrame.endDate && !timeFrame.startDate && d.isSameOrBefore(timeFrame.endDate, 'day'))
        || (!timeFrame.endDate && timeFrame.startDate && d.isSameOrAfter(timeFrame.startDate, 'day'))
        || (d.isSameOrAfter(timeFrame.startDate, 'day') && d.isSameOrBefore(timeFrame.endDate, 'day')));
    }
  },
  validations: {
    roadmap: {
      title: { required },
      description: { maxLength: maxLength(validationRules.descriptionLength) }
    }
  },
  watch: {
    roadmapToEdit(val) {
      if (val) {
        this.roadmap = { ...val };
      } else {
        this.clearForm();
      }
    }
  }
};
</script>
