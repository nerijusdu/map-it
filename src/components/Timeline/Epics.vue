<template>
  <div class="epics-container">
    <div
      class="epic"
      v-for="epic in epicList"
      :key="epic.id"
      :style="{
        background: epic.color,
        height: `${((epic.taskCount + epic.emptyCategories) * 35) + (epic.categoryCount * 5) - 10}px`
      }"
      @click="() => previewEpic({ epicId: epic.id, modal: $modal })">
      {{epic.title}}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters('roadmap', ['epicList'])
  },
  methods: {
    ...mapActions('roadmap', ['previewEpic'])
  }
};
</script>

<style scoped>
.epics-container {
  margin-top: 10px;
}

.epic {
  width: 30px;
  margin-right: 5px;
  cursor: pointer;
  border-radius: 2px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  display: flex;
  align-items: center;
  justify-content: center;
}

.epic:not(:first-of-type) {
  margin-top: 10px;
}
</style>
