<template>
  <div class="timeline">
    <div :class="['label-container', epics && epics.length > 0 ? 'with-epics' : '']">
      <div
        v-for="m in months"
        v-bind:key="m.id"
        class="label"
        :style="{ width: `${m.width}%` }"
      >{{m.label}}</div>
    </div>
    <div
      :class="['day-label-container', epics && epics.length > 0 ? 'with-epics' : '']"
      v-if="shouldShowDays">
      <div
        v-for="day in timelineDays"
        :key="shortid.generate(day)"
        :style="{ width: `${dayWidth}%` }"
      >{{day}}</div>
    </div>
    <Milestones />
    <div class="flex">
      <div class="table">
        <Category
          v-for="category in parentCategories"
          :key="category.title"
          :category="category"
          :subCategories="categories.filter(x => x.parentCategoryId === category.id)"
        />
      </div>
      <Epics />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import shortid from 'shortid';
import { mapState, mapGetters } from 'vuex';
import Category from './Category';
import Milestones from './Milestones';
import Epics from './Epics';

export default {
  computed: {
    ...mapState({
      categories: state => state.categories.items,
      tasks: state => state.roadmap.current.tasks,
      epics: state => state.epics.items
    }),
    ...mapGetters('roadmap', {
      months: 'roadmapMonths',
      timeFrame: 'roadmapTimeFrame'
    }),
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
    parentCategories() {
      return this.categories.filter(x => !x.parentCategoryId);
    }
  },
  data: () => ({
    shortid
  }),
  components: {
    Category,
    Milestones,
    Epics
  }
};
</script>

<style scoped>
.timeline {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.table {
  flex-grow: 1;
}

.label-container, .day-label-container {
  display: flex;
  margin-left: 200px;
  margin-right: 5px;
}

.label-container.with-epics, .day-label-container.with-epics {
  margin-right: 40px;
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

@media only screen and (max-width: 600px) {
  .label-container {
    margin-left: 10px;
  }

  .day-label-container {
    display: none;
  }

  .label:first-of-type {
    border-left: none;
  }
}
</style>

