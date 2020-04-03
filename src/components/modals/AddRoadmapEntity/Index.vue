<template>
  <modal name="addRoadmapEntity" height="auto" :scrollable="true" @before-close="beforeClose">
    <div class="modal-title">
      <div>Create/Edit</div>
    </div>
    <form class="modal-content">
      <md-tabs :md-active-tab="activeTabName">
        <task-tab
          @click="activeTab = tab.Task"
          @select-tab="activeTab = tab.Task"
          v-if="categories && categories.length > 0"
          :ref="this.getTabName(tab.Task)"
        />
        <category-tab
          @click="activeTab = tab.Category"
          @select-tab="activeTab = tab.Category"
          :ref="this.getTabName(tab.Category)"
        />
        <milestone-tab
          @click="activeTab = tab.Milestone"
          @select-tab="activeTab = tab.Milestone"
          :ref="this.getTabName(tab.Milestone)"
        />
        <epic-tab
          @click="activeTab = tab.Epic"
          @select-tab="activeTab = tab.Epic"
          :ref="this.getTabName(tab.Epic)"
        />
      </md-tabs>
    </form>
    <div class="modal-footer">
      <md-button
        class="md-raised md-accent"
        @click="$modal.hide('addRoadmapEntity')"
        data-cy="cancel-button"
      >Cancel</md-button>
      <md-button
        class="md-raised md-primary"
        @click="validateForm"
        data-cy="save-button"
      >Save</md-button>
    </div>
  </modal>
</template>

<script>
import { mapState } from 'vuex';
import TaskTab from './TaskTab';
import CategoryTab from './CategoryTab';
import MilestoneTab from './MilestoneTab';
import EpicTab from './EpicTab';

const tab = {
  Task: 1,
  Category: 2,
  Milestone: 3,
  Epic: 4
};

export default {
  name: 'AddEditRoadmapEntity',
  components: {
    TaskTab,
    CategoryTab,
    MilestoneTab,
    EpicTab
  },
  computed: {
    ...mapState({
      categories: state => state.categories.items,
    }),
    activeTabName() {
      return this.getTabName(this.activeTab);
    },
  },
  data: () => ({
    tab,
    activeTab: tab.Task
  }),
  methods: {
    getTabName(tabValue) {
      switch (tabValue) {
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
    getTab(tabValue) {
      return this.$refs[this.getTabName(tabValue)];
    },
    beforeClose() {
      this.getTab(tab.Task).beforeClose();
      this.getTab(tab.Category).beforeClose();
      this.getTab(tab.Milestone).beforeClose();
      this.getTab(tab.Epic).beforeClose();
      this.activeTab = tab.Task;
    },
    async validateForm() {
      await this.getTab(this.activeTab).validateAndSave();
    }
  }
};
</script>
