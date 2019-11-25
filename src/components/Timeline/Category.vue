<template>
  <div class="category">
    <div
      class="label flex-center"
      :style="{backgroundColor: category.color}"
      @click="() => previewCategory({ categoryId: category.id, modal: $modal })">
      {{category.title}}
    </div>
    <div class="rows-container">
      <div
        v-for="task in getTasks(category.id)"
        :key="task.title"
        class="row">
        <div
          class="item flex-center"
          :style="{
            backgroundColor: task.isCompleted ? '#959595' : category.color,
            width: `${task.width}%`,
            marginLeft: `${task.leftMargin}%`
          }"
          @click="() => previewTask({ taskId: task.id, modal: $modal })">
          <md-tooltip md-direction="top">{{task.title}}</md-tooltip>
          <div v-if="task.width > 3">{{task.title}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: ['category'],
  computed: mapGetters('roadmap', {
    getTasks: 'tasksByCategory',
    timeFrame: 'roadmapTimeFrame'
  }),
  methods: {
    ...mapActions('roadmap', ['previewTask', 'previewCategory'])
  }
};
</script>

<style scoped>
.category {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  display: flex;
}

.label {
  width: 180px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 2px;
  cursor: pointer;
}

.rows-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-right: 10px;
}

.row {
  height: 30px;
  flex-grow: 1;
  background: lightgrey;
  margin-bottom: 5px;
  border-radius: 1px;
}

.row:last-of-type {
  margin-bottom: 0px;
}

.item {
  float: left;
  width: 300px;
  height: 100%;
  border-radius: 2px;
  cursor: pointer;
}

.item > div {
  width: 100%;
  margin-left: 5px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media only screen and (max-width: 600px) {
  .category {
    flex-direction: column;
  }

  .label {
    width: auto;
    margin: 0px 10px 10px 10px;
  }

  .rows-container {
    margin-left: 10px;
  }
}
</style>

