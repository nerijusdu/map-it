<template>
  <div class="epics-container">
    <div
      class="epic"
      v-for="epic in epicList"
      :key="epic.id"
      :style="{
        background: epic.color,
        height: `${isMobileView
          ? (epic.taskCount * 35) + (epic.categoryCount * 55) - 10
          : ((epic.taskCount + epic.emptyCategories) * 35) + (epic.categoryCount * 5) - 10
        }px`
      }"
      @click="() => previewEpic({ epicId: epic.id, modal: $modal })">
      {{epic.title}}
      <md-tooltip md-direction="top">{{epic.title}}</md-tooltip>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({
    isMobileView: window.innerWidth <= 600
  }),
  computed: {
    ...mapGetters('epics', ['epicList'])
  },
  methods: {
    ...mapActions('epics', ['previewEpic'])
  },
  created() {
    window
      .matchMedia('(max-width: 600px)')
      .addListener((e) => { this.isMobileView = !!e.matches; });
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
  justify-content: flex-start;
  white-space: nowrap;
  overflow: hidden;
  padding-top: 10px;
}

.epic:not(:first-of-type) {
  margin-top: 10px;
}


@media only screen and (max-width: 600px) {
  .epics-container {
    margin-top: 20px;
  }
}
</style>
