<template>
  <div class="milestone-container">
    <DateMarker
      :percentage="currentDateMarkerMargin"
      :dateMarkerHeigh="isMobileView ? mobileDateMarkerHeight : dateMarkerHeight"
      :hasEpics="hasEpics"
      title="Today"
      v-show="showCurrentDate"
    />
    <DateMarker
      v-for="milestone in milestones"
      :key="milestone.id"
      :percentage="calculatePercentage(timeFrame, { startDate: timeFrame.startDate, endDate: moment(milestone.date) })"
      :dateMarkerHeigh="isMobileView ? mobileDateMarkerHeight : dateMarkerHeight"
      :hasEpics="hasEpics"
      :title="milestone.title"
      :color="milestone.color"
      :click="() => previewMilestone({ milestoneId: milestone.id, modal: $modal })"
    />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import moment from 'moment';
import DateMarker from './DateMarker';
import formatService from '../../services/formatService';

export default {
  data: () => ({
    calculatePercentage: formatService.calculateWidthPercentage,
    isMobileView: window.innerWidth <= 600,
    moment
  }),
  computed: {
    ...mapState({
      roadmap: state => state.roadmap.current,
      milestones: state => state.milestones.items,
      hasEpics: state => state.epics.items.length > 0
    }),
    ...mapGetters('roadmap', {
      timeFrame: 'roadmapTimeFrame'
    }),
    dateMarkerHeight() {
      const parentCategories = new Set();
      const subCategories = this.roadmap.categories
        .filter((x) => {
          if (x.parentCategoryId) {
            parentCategories.add(x.parentCategoryId);
            return true;
          }
          return false;
        })
        .map(x => x.id);
      const emptyCategories = this.roadmap.categories
        .filter(x => !this.roadmap.tasks.some(t => t.id === x.id) && !parentCategories.has(x.id));
      const otherCategories = this.roadmap.categories
        .filter(x => !subCategories.includes(x.id) && !parentCategories.has(x.id));
      const taskCount = this.roadmap.tasks.length;

      return ((taskCount + emptyCategories.length) * 35)
           + ((parentCategories.size + otherCategories.length) * 5) - 5;
    },
    mobileDateMarkerHeight() {
      const taskCount = this.roadmap.tasks.length;
      const categoiresWithTasks = new Set();
      this.roadmap.tasks.forEach(x => categoiresWithTasks.add(x.categoryId));

      return (taskCount * 35) + (categoiresWithTasks.size * 57);
    },
    showCurrentDate() {
      return moment().isBetween(moment(this.timeFrame.startDate), moment(this.timeFrame.endDate));
    },
    currentDateMarkerMargin() {
      return formatService.calculateWidthPercentage(
        this.timeFrame,
        {
          startDate: this.timeFrame.startDate,
          endDate: moment()
        }
      );
    }
  },
  methods: mapActions('milestones', ['previewMilestone']),
  created() {
    window
      .matchMedia('(max-width: 600px)')
      .addListener((e) => { this.isMobileView = !!e.matches; });
  },
  components: {
    DateMarker
  }
};
</script>

<style scoped>
.milestone-container {
  display: flex;
  margin-top: 15px;
}
</style>
