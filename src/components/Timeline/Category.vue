<template>
  <div class="category">
      <div
        class="label main flex-center"
        @click="() => previewCategory({ categoryId: category.id, modal: $modal })"
        :style="{
          backgroundColor: category.color
        }"
        v-if="subCategories && subCategories.length > 0">
        <md-tooltip md-direction="top">{{category.title}}</md-tooltip>
        <div class="title">{{category.title}}</div>
      </div>
      <div class="subcategory-container">
        <div
          :class="['subcategory', getTasks(c.id).length === 0 ? 'no-tasks' : '']"
          v-for="c in renderCategories"
          :key="c.id">
          <div
            :class="[
              'label flex-center',
              subCategories && subCategories.length > 0 ? '' : 'stretch'
            ]"
            :style="{
              backgroundColor: c.color
            }"
            @click="() => previewCategory({ categoryId: c.id, modal: $modal })">
            <md-tooltip md-direction="top">{{c.title}}</md-tooltip>
            <div class="title">{{c.title}}</div>
          </div>
          <div class="rows-container">
            <div
              v-for="task in getTasks(c.id)"
              :key="task.title"
              class="row">
              <div
                class="item flex-center"
                :style="{
                  backgroundColor: task.isCompleted ? '#959595' : c.color,
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
      </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: ['category', 'subCategories'],
  computed: {
    ...mapGetters('roadmap', {
      getTasks: 'tasksByCategory',
      timeFrame: 'roadmapTimeFrame'
    }),
    renderCategories() {
      return this.subCategories && this.subCategories.length > 0
        ? this.subCategories
        : [this.category];
    }
  },
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

.subcategory-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.subcategory:not(:last-of-type) {
  margin-bottom: 5px;
}

.subcategory {
  display: flex;
}

.label {
  border-radius: 2px;
  cursor: pointer;
  width: 85px;
  margin-right: 10px;
  margin-left: 5px;
}

.label.stretch {
  width: 180px;
}

.label.main {
  margin-right: 0;
  width: 90px;
}

.label > .title {
  min-width: 80px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
  margin-right: 5px;
  margin-left: 5px;
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
  .category, .subcategory {
    flex-direction: column;
  }

  .subcategory {
    margin: 0;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
  }

  .label, .label.stretch {
    width: auto;
    margin: 0;
    margin-bottom: 5px;
  }

  .subcategory.no-tasks {
    display: none;
  }

  .rows-container {
    margin-left: 0;
    margin-right: 0;
  }

  .label.main {
    display: none;
  }
}
</style>

