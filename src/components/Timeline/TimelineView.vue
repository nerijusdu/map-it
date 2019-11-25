<template>
  <div class="timeline">
    <div
      class="current-date-marker"
      :style="{
        height: currentDateMarkerHeigh,
        'margin-left': `${(window.width - categoryLabelSize) * currentDateMarkerMargin / 100 + categoryLabelSize}px`,
        'margin-top': `${shouldShowDays ? 80 : 60}px`
      }"
    >
      <div class="arrow-down">
        <md-tooltip md-direction="top">Today</md-tooltip>
        <svg height="10" width="12">
          <polygon points="0,0 12,0 12,2 7,9 5,9 0,2" style="fill:#1eb980;stroke-width:0"/>
        </svg>
      </div>
    </div>
    <div class="label-container">
      <div
        v-for="m in months"
        v-bind:key="m.id"
        class="label"
        :style="{ width: `${m.width}%` }"
      >{{m.label}}</div>
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
    }
  },
  data: () => ({
    window: {
      width: 0,
      height: 0
    }
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
  margin-right: 5px;
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
  margin: 2px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  background-color: var(--modal-overlay-color);
  padding-bottom: 5px;
  padding-top: 5px;
  border-radius: 10px;
}

.label:first-of-type {
  border: none;
  padding-left: 0;
  margin-left: 0;
}

.current-date-marker {
  background: var(--primary-color);
  position: absolute;
  width: 2px;
  box-shadow: 0px 0px 3px #0d6444;
}

.arrow-down {
  position: relative;
  top: -15px;
  left: -5px;
}

.arrow-down > div {
  line-height: .8;
  position: relative;
  left: -12px;
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

