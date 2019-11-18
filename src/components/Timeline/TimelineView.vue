<template>
  <div class="timeline">
    <div
      class="current-date-marker"
      :style="{
        height: currentDateMarkerHeigh,
        'margin-left': `${(window.width - categoryLabelSize) * currentDateMarkerMargin / 100 + categoryLabelSize}px`,
        'margin-top': `${shouldShowDays ? 70 : 50}px`
      }"
    ></div>
    <div class="label-container">
      <div
        v-for="m in months"
        v-bind:key="m"
        class="label"
        :style="{ width: `${labelWidth}%` }"
      >{{m}}</div>
    </div>
    <div class="day-label-container" v-if="shouldShowDays">
      <div
        v-for="day in timelineDays"
        :key="shortid.generate(day)"
        :style="{ width: `${dayWidth}%` }"
      >{{day}}</div>
    </div>
    <div class="table">
      <Category
        v-for="category in categories"
        v-bind:key="category.title"
        v-bind:category="category"
      />
    </div>
  </div>
</template>

<script>
import shortid from 'shortid';
import moment from 'moment';
import { mapState, mapGetters } from 'vuex';
import Category from './Category';
import formatService from '../../services/formatService';

export default {
  computed: {
    ...mapState({
      categories: state => state.roadmap.current.categories,
      tasks: state => state.roadmap.current.tasks
    }),
    ...mapGetters('roadmap', {
      months: 'roadmapMonths',
      timeFrame: 'roadmapTimeFrame'
    }),
    currentDateMarkerHeigh() {
      return `${this.tasks.length * 35 + this.categories.length * 5 - 10}px`;
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
    },
    categoryLabelSize() {
      return this.window.width > 600 ? 200 : 10;
    },
    shouldShowDays() {
      const days = this.timeFrame.endDate.diff(this.timeFrame.startDate, 'days');
      return days <= 31;
    },
    timelineDays() {
      const days = [];
      const date = moment(this.timeFrame.startDate);
      const end = moment(this.timeFrame.endDate).add(1, 'day');
      while (date.isBefore(end, 'day')) {
        days.push(parseInt(date.format('D'), 10));
        date.add(1, 'day');
      }
      return days;
    },
    dayWidth() {
      const days = this.timeFrame.endDate.diff(this.timeFrame.startDate, 'days') + 1;
      const width = 100 / days;
      return Math.round(width * 100) / 100;
    },
    labelWidth() {
      // TODO: take into account days with 31/30 days
      return Math.round(100 / this.months.length * 100) / 100;
    }
  },
  data: () => ({
    window: {
      width: 0,
      height: 0
    },
    shortid
  }),
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    }
  },
  components: {
    Category
  }
};
</script>

<style scoped>
.timeline {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.label-container, .day-label-container {
  display: flex;
  margin-left: 200px;
}

.day-label-container {
  margin-right: 10px;
}

.day-label-container > div {
  display: flex;
  flex-grow: 1;
  justify-content: center;
}

.label {
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  /* flex-grow: 1; */
  text-align: center;
  border-left: 1px solid white;
}

.label:first-of-type {
  border: none;
}

.current-date-marker {
  background: var(--primary-color);
  position: absolute;
  width: 2px;
  box-shadow: 0px 0px 3px #0d6444;
}

@media only screen and (max-width: 600px) {
  .label-container {
    margin-left: 10px;
  }

  .label:first-of-type {
    border-left: none;
  }
}
</style>

