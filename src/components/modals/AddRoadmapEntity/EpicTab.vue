<template>
  <md-tab id="tab-epic" md-label="Epic" @click="() => $emit('click')">
    <input type="hidden" v-model="modelChange" />
    <md-field :class="getValidationClass('title')" data-cy="epic-title-input">
      <label>Title</label>
      <md-input v-model="model.title"/>
      <span class="md-error" v-if="!$v.model.title.required">{{ resources.requiredMsg }}</span>
      <span class="md-error" v-if="!$v.model.title.minLength && $v.model.title.required">{{ resources.minLengthMsg(3) }}</span>
    </md-field>
    <md-field :class="getValidationClass('description')" data-cy="epic-description-input">
      <label>Description</label>
      <md-textarea v-model="model.description"/>
      <span class="md-error" v-if="!$v.model.description.required">{{ resources.maxLengthMsg(descriptionLength) }}</span>
    </md-field>
    <md-field :class="getValidationClass('color')" data-cy="epic-color-input">
      <label>Color</label>
      <md-input v-model="model.color" type="color"/>
      <span class="md-error" v-if="!$v.model.color.required">{{ resources.requiredMsg }}</span>
    </md-field>
    <md-field data-cy="epic-categories-input">
      <label for="categoryIds">Categories</label>
      <md-select name="categoryIds" v-model="model.categoryIds" multiple>
        <md-option v-for="cat in categoriesForEpics" :key="cat.id" :value="cat.id" data-cy="epic-category">{{ cat.title }}</md-option>
      </md-select>
    </md-field>
  </md-tab>
</template>

<script>
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
      color: '#1eb980',
      categoryIds: []
    },
    resources,
    descriptionLength: validationRules.descriptionLength
  }),
  computed: {
    ...mapState({
      roadmapId: state => state.roadmap.current.id,
      categories: state => state.categories.items
    }),
    ...mapGetters({
      modelToEdit: 'epics/epicToEdit'
    }),
    modelChange() {
      this.clearForm(this.modelToEdit);
      return this.modelToEdit ? this.modelToEdit.id : '';
    },
    parentCategories() {
      return (this.categories || []).filter(x => !x.parentCategoryId);
    },
    categoriesForEpics() {
      return this.parentCategories.filter(x => !x.epicId || (this.modelToEdit && x.epicId === this.epic.id));
    },
  },
  methods: {
    ...mapActions({
      selectRoadmap: 'roadmap/selectRoadmap',
      editEntity: 'epics/editEpic',
      saveToStore: 'epics/saveEpic'
    }),
    getValidationClass(fieldName) {
      const field = this.$v.model[fieldName];
      return field ? { 'md-invalid': field.$invalid && field.$dirty } : {};
    },
    async validateAndSave() {
      const form = this.$v.model;
      form.$touch();
      if (form.$invalid) {
        return;
      }

      this.beforeClose();
      this.$modal.hide('addRoadmapEntity');
      this.selectRoadmap({ roadmapId: this.roadmapId });
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
      this.model.color = '#1eb980';
      this.model.categoryIds = [];
    },
    beforeClose() {
      this.clearForm();
      if (this.modelToEdit) {
        this.editEntity({ epicId: null, modal: this.$modal });
      }
    }
  },
  validations: {
    model: {
      title: { required, minLength: minLength(3) },
      description: { maxLength: maxLength(validationRules.descriptionLength) },
      color: { required }
    }
  }
};
</script>
