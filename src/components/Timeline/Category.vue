<template>
  <div class="category">
    <div
      class="label flex-center"
      :style="{backgroundColor: category.color}">
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
            backgroundColor: category.color,
          }"
          @click="() => previewTask({ taskId: task.id, modal: $modal })">
          <span>{{task.title}}</span>
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
    getTasks: 'tasksByCategory'
  }),
  methods: mapActions('roadmap', ['previewTask'])
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
</style>

