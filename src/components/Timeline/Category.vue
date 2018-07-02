<template>
  <div class="category">
    <div
      class="label flex-center"
      v-bind:style="{backgroundColor: category.color}">
      {{category.title}}
    </div>
    <div class="rows-container">
      <div
        v-for="task in getTasks(category.id)"
        v-bind:key="task.title"
        class="row">
        <div
          class="item flex-center"
          v-bind:style="{
            backgroundColor: category.color,
          }">
          <span>{{task.title}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['category'],
  computed: mapGetters('roadmap', {
    getTasks: 'tasksByCategory'
  })
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
  margin-top: 3px;
  margin-bottom: 3px;
  border-radius: 1px;
}

.item {
  float: left;
  width: 300px;
  height: 100%;
  border-radius: 2px;
  cursor: pointer;
}
</style>

