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
        <div>{{category.title}}</div>
      </div>
      <div class="subcategory-container">
        <div
          class="subcategory"
          v-for="c in renderCategories"
          :key="c.id">
          <div
            class="label flex-center"
            :style="{
              backgroundColor: c.color,
              width: `${subCategories && subCategories.length > 0 ? 90 : 180}px`,
              'max-width': `${subCategories && subCategories.length > 0 ? 90 : 180}px`
            }"
            @click="() => previewCategory({ categoryId: c.id, modal: $modal })">
            <md-tooltip md-direction="top">{{c.title}}</md-tooltip>
            <div>{{c.title}}</div>
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
  flex-grow: 1;
  width: 90px;
  margin-right: 10px;
  margin-left: 5px;
  padding-left: 5px;
  padding-right: 5px;
}

.label.main {
  margin-right: 0;
  width: 90px;
}

.label > div {
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
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
/* TODO: responsive */
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

