<template>
  <md-tab id="tab-category" md-label="Category" @click="() => $emit('click')">
    <input type="hidden" v-model="modelChange" />
    <md-field :class="getValidationClass('title')" data-cy="category-title-input" >
      <label>Title</label>
      <md-input v-model="model.title"/>
      <span class="md-error" v-if="!$v.model.title.required">{{ resources.requiredMsg }}</span>
      <span class="md-error" v-if="!$v.model.title.minLength && $v.model.title.required">{{ resources.minLengthMsg(3) }}</span>
    </md-field>
    <md-field :class="getValidationClass('description')" data-cy="category-description-input">
      <label>Description</label>
      <md-textarea v-model="model.description"/>
      <span class="md-error" v-if="!$v.model.description.required">{{ resources.maxLengthMsg(descriptionLength) }}</span>
    </md-field>
    <md-field :class="getValidationClass('color')" data-cy="category-color-input">
      <label>Color</label>
      <md-input v-model="model.color" type="color"/>
      <span class="md-error" v-if="!$v.model.color.required">{{ resources.requiredMsg }}</span>
    </md-field>
    <div class="checkbox" v-if="categories && categories.length > 0" data-cy="category-is-subcategory-input">
      <md-checkbox v-model="model.isSubCategory" class="md-primary" />
      <div>Is Sub-Category?</div>
    </div>
    <md-field :class="getValidationClass('parentCategoryId')" v-show="model.isSubCategory" data-cy="category-parent-input">
      <label for="parentCategoryId">Parent category</label>
      <md-select name="parentCategoryId" v-model="model.parentCategoryId">
        <md-option v-for="cat in parentCategories" :key="cat.id" :value="cat.id" data-cy="category-parent">{{ cat.title }}</md-option>
      </md-select>
      <span class="md-error" v-if="!$v.model.parentCategoryId.required">{{ resources.requiredMsg }}</span>
    </md-field>
  </md-tab>
</template>


<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, requiredIf, maxLength, minLength } from 'vuelidate/lib/validators';
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
      isSubCategory: false,
      parentCategoryId: ''
    },
    resources,
    descriptionLength: validationRules.descriptionLength
  }),
  computed: {
    ...mapState({
      tasks: state => state.tasks.items,
      categories: state => state.categories.items
    }),
    ...mapGetters({
      modelToEdit: 'categories/categoryToEdit'
    }),
    modelChange() {
      this.clearForm(this.modelToEdit);
      return this.modelToEdit ? this.modelToEdit.id : '';
    },
    parentCategories() {
      return (this.categories || []).filter(x => !x.parentCategoryId);
    },
  },
  methods: {
    ...mapActions({
      editEntity: 'categories/editCategory',
      saveToStore: 'categories/saveCategory'
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

      if (this.model.isSubCategory &&
          this.tasks.some(x => x.categoryId === this.model.parentCategoryId)
      ) {
        this.$modal.show('confirmation', {
          content: 'All tasks in the parent category will fall under this sub-category!',
          confirmAction: () => this.save()
        });
        return;
      }

      this.save();
    },
    async save() {
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
      this.model.color = '#1eb980';
      this.model.isSubCategory = false;
      this.model.parentCategoryId = '';
    },
    beforeClose() {
      this.clearForm();
      if (this.modelToEdit) {
        this.editEntity({ categoryId: null, modal: this.$modal });
      }
    }
  },
  validations: {
    model: {
      title: { required, minLength: minLength(3) },
      description: { maxLength: maxLength(validationRules.descriptionLength) },
      color: { required },
      parentCategoryId: {
        required: requiredIf(function validate() {
          return this.model.isSubCategory;
        })
      }
    }
  }
};
</script>

<style scoped>
.checkbox {
  display: flex;
  align-items: center;
}
</style>
