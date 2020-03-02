<template>
  <modal name="addTask" height="auto" :scrollable="true" @closed="onClose">
    <div class="modal-title">
      <div>{{ title }}</div>
    </div>
    <form class="modal-content">
      <md-tabs :md-active-tab="activeTabName">
        <md-tab id="tab-home" md-label="Task" @click="activeTab = tab.Task" v-if="categories && categories.length > 0">
          <md-field :class="getValidationClass('title')">
            <label>Title</label>
            <md-input v-model="task.title"/>
            <span class="md-error" v-if="!$v.task.title.required">{{ resources.requiredMsg }}</span>
          </md-field>
          <md-field :class="getValidationClass('description')">
            <label>Description</label>
            <md-textarea v-model="task.description"/>
            <span class="md-error" v-if="!$v.task.description.required">{{ resources.maxLengthMsg(descriptionLength) }}</span>
          </md-field>
          <md-field :class="getValidationClass('categoryId')">
            <label for="categoryId">Category</label>
            <md-select name="categoryId" id="categoryId" v-model="task.categoryId">
              <md-option v-for="cat in categoriesForTasks" :key="cat.id" :value="cat.id">{{ cat.title }}</md-option>
            </md-select>
            <span class="md-error" v-if="!$v.task.categoryId.required">{{ resources.requiredMsg }}</span>
          </md-field>
          <md-datepicker md-immediately v-model="task.startDate" :md-disabled-dates="disabledDates(roadmapTimeFrame)">
            <label>Start date</label>
          </md-datepicker>
          <md-datepicker md-immediately v-model="task.endDate" :md-disabled-dates="disabledDates(roadmapTimeFrame)">
            <label>End date</label>
          </md-datepicker>
        </md-tab>
        <md-tab id="tab-category" md-label="Category" @click="activeTab = tab.Category" v-if="!task.id">
          <md-field :class="getValidationClass('title')">
            <label>Title</label>
            <md-input v-model="category.title"/>
            <span class="md-error" v-if="!$v.category.title.required">{{ resources.requiredMsg }}</span>
          </md-field>
          <md-field :class="getValidationClass('description')">
            <label>Description</label>
            <md-textarea v-model="category.description"/>
            <span class="md-error" v-if="!$v.category.description.required">{{ resources.maxLengthMsg(descriptionLength) }}</span>
          </md-field>
          <md-field :class="getValidationClass('color')">
            <label>Color</label>
            <md-input v-model="category.color" type="color"/>
            <span class="md-error" v-if="!$v.category.color.required">{{ resources.requiredMsg }}</span>
          </md-field>
          <div class="checkbox" v-if="categories && categories.length > 0">
            <md-checkbox v-model="category.isSubCategory" class="md-primary" />
            <div>Is Sub-Category?</div>
          </div>
          <md-field :class="getValidationClass('parentCategoryId')" v-show="category.isSubCategory">
            <label for="parentCategoryId">Parent category</label>
            <md-select name="parentCategoryId" id="parentCategoryId" v-model="category.parentCategoryId">
              <md-option v-for="cat in parentCategories" :key="cat.id" :value="cat.id">{{ cat.title }}</md-option>
            </md-select>
            <span class="md-error" v-if="!$v.category.parentCategoryId.required">{{ resources.requiredMsg }}</span>
          </md-field>
        </md-tab>
        <md-tab id="tab-milestone" md-label="Milestone" @click="activeTab = tab.Milestone" v-if="!task.id">
          <md-field :class="getValidationClass('title')">
            <label>Title</label>
            <md-input v-model="milestone.title"/>
            <span class="md-error" v-if="!$v.milestone.title.required">{{ resources.requiredMsg }}</span>
          </md-field>
          <md-field :class="getValidationClass('color')">
            <label>Color</label>
            <md-input v-model="milestone.color" type="color"/>
            <span class="md-error" v-if="!$v.milestone.color.required">{{ resources.requiredMsg }}</span>
          </md-field>
          <md-datepicker md-immediately v-model="milestone.date" :md-disabled-dates="disabledDates(roadmapTimeFrame)">
            <label>Date</label>
          </md-datepicker>
        </md-tab>
        <md-tab id="tab-epic" md-label="Epic" @click="activeTab = tab.Epic">
          <md-field :class="getValidationClass('title')">
            <label>Title</label>
            <md-input v-model="epic.title"/>
            <span class="md-error" v-if="!$v.epic.title.required">{{ resources.requiredMsg }}</span>
          </md-field>
          <md-field :class="getValidationClass('description')">
            <label>Description</label>
            <md-textarea v-model="epic.description"/>
            <span class="md-error" v-if="!$v.epic.description.required">{{ resources.maxLengthMsg(descriptionLength) }}</span>
          </md-field>
          <md-field :class="getValidationClass('color')">
            <label>Color</label>
            <md-input v-model="epic.color" type="color"/>
            <span class="md-error" v-if="!$v.epic.color.required">{{ resources.requiredMsg }}</span>
          </md-field>
          <md-field>
            <label for="categoryIds">Categories</label>
            <md-select name="categoryIds" id="categoryIds" v-model="epic.categoryIds" multiple>
              <md-option v-for="cat in categoriesForEpics" :key="cat.id" :value="cat.id">{{ cat.title }}</md-option>
            </md-select>
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
import { required, maxLength, requiredIf } from 'vuelidate/lib/validators';
import resources from '../../services/resourceService';
import { validationRules } from '../../constants';

const tab = {
  Task: 1,
  Category: 2,
  Milestone: 3,
  Epic: 4
};

export default {
  name: 'AddEditTask',
  mixins: [validationMixin],
  computed: {
    ...mapState({
      categories: state => state.categories.items,
      tasks: state => state.tasks.items,
      roadmapId: state => state.roadmap.current.id
    }),
    ...mapGetters({
      taskToEdit: 'tasks/taskToEdit',
      categoryToEdit: 'categories/categoryToEdit',
      epicToEdit: 'epics/epicToEdit',
      roadmapTimeFrame: 'roadmap/roadmapTimeFrame',
      milestoneToEdit: 'milestones/milestoneToEdit'
    }),
    title() {
      if (this.taskToEdit) {
        return this.task.title;
      }
      if (this.categoryToEdit) {
        return this.category.title;
      }
      if (this.milestoneToEdit) {
        return this.milestone.title;
      }
      if (this.epicToEdit) {
        return this.epic.title;
      }
      return 'Create new';
    },
    activeTabName() {
      switch (this.activeTab) {
        case tab.Category:
          return 'tab-category';
        case tab.Milestone:
          return 'tab-milestone';
        case tab.Epic:
          return 'tab-epic';
        default:
          return 'tab-home';
      }
    },
    parentCategories() {
      return (this.categories || []).filter(x => !x.parentCategoryId);
    },
    categoriesForEpics() {
      return this.parentCategories.filter(x => !x.epicId || (this.epicToEdit && x.epicId === this.epic.id));
    },
    categoriesForTasks() {
      const cats = this.categories || [];
      return cats.filter(x => !!x.parentCategoryId || !cats.some(y => y.parentCategoryId === x.id));
    }
  },
  data: () => ({
    task: {
      id: '',
      title: '',
      description: '',
      categoryId: '',
      startDate: moment().toDate(),
      endDate: moment().toDate()
    },
    category: {
      id: '',
      title: '',
      description: '',
      color: '#1eb980',
      isSubCategory: false,
      parentCategoryId: ''
    },
    milestone: {
      id: '',
      title: '',
      color: '#1eb980',
      date: moment().toDate()
    },
    epic: {
      id: '',
      title: '',
      description: '',
      color: '#1eb980',
      categoryIds: []
    },
    resources,
    tab,
    activeTab: tab.Task,
    descriptionLength: validationRules.descriptionLength
  }),
  methods: {
    ...mapActions({
      saveTaskToStore: 'tasks/saveTask',
      editTask: 'tasks/editTask',
      saveCategoryToStore: 'categories/saveCategory',
      saveEpicToStore: 'epics/saveEpic',
      selectRoadmap: 'roadmap/selectRoadmap',
      saveMilestoneToStore: 'milestones/saveMilestone'
    }),
    async save(refresh) {
      let success = true;
      switch (this.activeTab) {
        case tab.Task:
          success = await this.saveTaskToStore(this.task);
          break;
        case tab.Category:
          success = await this.saveCategoryToStore(this.category);
          break;
        case tab.Milestone:
          success = await this.saveMilestoneToStore(this.milestone);
          break;
        case tab.Epic:
          success = await this.saveEpicToStore(this.epic);
          break;
        default:
          return;
      }

      if (!success) {
        return;
      }

      this.clearForm();
      if (this.taskToEdit) {
        this.editTask({ taskId: null, modal: this.$modal });
      }
      this.$modal.hide('addTask');
      if (refresh) {
        this.selectRoadmap({ roadmapId: this.roadmapId });
      }
    },
    onClose() {
      this.clearForm();
      if (this.taskToEdit) {
        this.editTask({ taskId: null, modal: this.$modal });
      }
      this.$modal.hide('addTask');
    },
    getValidationClass(fieldName) {
      let field;
      switch (this.activeTab) {
        case tab.Task:
          field = this.$v.task[fieldName];
          break;
        case tab.Category:
          field = this.$v.category[fieldName];
          break;
        case tab.Milestone:
          field = this.$v.milestone[fieldName];
          break;
        case tab.Epic:
          field = this.$v.epic[fieldName];
          break;
        default:
          return {};
      }

      return field ? { 'md-invalid': field.$invalid && field.$dirty } : {};
    },
    validateForm() {
      let form;
      let refresh = false;
      switch (this.activeTab) {
        case tab.Task:
          form = this.$v.task;
          break;
        case tab.Category:
          form = this.$v.category;
          break;
        case tab.Milestone:
          form = this.$v.milestone;
          break;
        case tab.Epic:
          form = this.$v.epic;
          refresh = true;
          break;
        default:
          return;
      }
      form.$touch();

      if (!form.$invalid) {
        if (this.activeTab === tab.Category &&
            this.category.isSubCategory &&
            this.tasks.some(x => x.categoryId === this.category.parentCategoryId)
        ) {
          this.$modal.show('confirmation', {
            content: 'All tasks in the parent category will fall under this sub-category!',
            confirmAction: () => this.save(true)
          });
          return;
        }
        this.save(refresh);
      }
    },
    clearForm() {
      this.$v.$reset();
      this.task.id = '';
      this.task.title = '';
      this.task.description = '';
      this.task.categoryId = this.categories && this.categories.length > 0 ? this.categories[0].id : '';
      this.task.startDate = moment().toDate();
      this.task.endDate = moment().toDate();
      this.category.id = '';
      this.category.title = '';
      this.category.description = '';
      this.category.color = '#1eb980';
      this.category.isSubCategory = false;
      this.category.parentCategoryId = '';
      this.milestone.id = '';
      this.milestone.title = '';
      this.milestone.color = '#1eb980';
      this.milestone.date = moment().toDate();
      this.epic.id = '';
      this.epic.title = '';
      this.epic.description = '';
      this.epic.color = '#1eb980';
      this.epic.categoryIds = [];
    },
    disabledDates: timeFrame => (date) => {
      const d = moment(date);

      return !(d.isSameOrAfter(timeFrame.startDate, 'day') && d.isSameOrBefore(timeFrame.endDate, 'day'));
    }
  },
  validations: {
    task: {
      title: { required },
      description: { maxLength: maxLength(validationRules.descriptionLength) },
      categoryId: { required }
    },
    category: {
      title: { required },
      description: { maxLength: maxLength(validationRules.descriptionLength) },
      color: { required },
      parentCategoryId: {
        required: requiredIf(function validate() {
          return this.category.isSubCategory;
        })
      }
    },
    milestone: {
      title: { required },
      color: { required }
    },
    epic: {
      title: { required },
      description: { maxLength: maxLength(validationRules.descriptionLength) },
      color: { required }
    }
  },
  watch: {
    taskToEdit(val) {
      if (val) {
        this.task = { ...val };
      } else {
        this.clearForm();
      }
    },
    categoryToEdit(val) {
      if (val) {
        this.category = { ...val };
        this.activeTab = tab.Category;
      } else {
        this.clearForm();
      }
    },
    milestoneToEdit(val) {
      if (val) {
        this.milestone = { ...val };
        this.activeTab = tab.Milestone;
      } else {
        this.clearForm();
      }
    },
    epicToEdit(val) {
      if (val) {
        this.epic = {
          ...val,
          categoryIds: this.categories.filter(x => x.epicId === val.id).map(x => x.id)
        };
        this.activeTab = tab.Epic;
      } else {
        this.clearForm();
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
