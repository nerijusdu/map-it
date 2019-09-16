<template>
  <div class="timeline">
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
import { mapState, mapGetters } from 'vuex';
import Category from './Category';

export default {
  computed: {
    ...mapState({
      categories: state => state.roadmap.current.categories
    }),
    ...mapGetters('roadmap', {
      months: 'roadmapMonths'
    })
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

@media only screen and (max-width: 600px) {
  .label-container {
    margin-left: 10px;
  }

  .label:first-of-type {
    border-left: none;
  }
}
</style>

