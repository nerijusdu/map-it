<template>
  <div class="milestone-container">
    <DateMarker
      :percentage="currentDateMarkerMargin"
      :dateMarkerHeigh="currentDateMarkerHeigh"
      title="Today"
    />
    <DateMarker
      v-for="milestone in roadmap.milestones"
      :key="milestone.id"
      :percentage="calculatePercentage(timeFrame, { startDate: timeFrame.startDate, endDate: moment(milestone.date) })"
      :dateMarkerHeigh="currentDateMarkerHeigh"
      :title="milestone.title"
      :color="milestone.color"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import moment from 'moment';
import DateMarker from './DateMarker';
import formatService from '../../services/formatService';

export default {
  props: {
    taskCount: {
      type: Number,
      required: true
    },
    categoryCount: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    calculatePercentage: formatService.calculateWidthPercentage,
    moment
  }),
  computed: {
    ...mapState({
      roadmap: state => state.roadmap.current
    }),
    ...mapGetters('roadmap', {
      timeFrame: 'roadmapTimeFrame'
    }),
    currentDateMarkerHeigh() {
      return this.taskCount * 35 + this.categoryCount * 5 - 5;
    },
    currentDateMarkerMargin() {
      return formatService.calculateWidthPercentage(
        this.timeFrame,
        {
          startDate: this.timeFrame.startDate,
          endDate: moment()
        },
        true
      );
    }
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
