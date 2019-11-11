<template>
  <div class="timeline">
    <div
      class="current-date-marker"
      :style="{
        height: currentDateMarkerHeigh,
        'margin-left': `${(window.width - categoryLabelSize) * currentDateMarkerMargin / 100 + categoryLabelSize}px`
      }"
    ></div>
    <div class="label-container">
      <div
        v-for="m in months"
        v-bind:key="m"
        class="label"
      >{{m}}</div>
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
        });
    },
    categoryLabelSize() {
      return this.window.width > 600 ? 200 : 10;
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

.label-container {
  display: flex;
  margin-left: 200px;
}

.label {
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  flex-grow: 1;
  text-align: center;
  border-left: 1px solid white;
}

.current-date-marker {
  background: var(--primary-color);
  position: absolute;
  width: 2px;
  margin-top: 50px;
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

