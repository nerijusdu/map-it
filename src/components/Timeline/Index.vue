<template>
  <div className="app-wrapper">
    <TimelineView v-if="!!roadmap.id"/>
    <div v-if="!roadmap.id" class="no-roadmap">
      <div>No roadmap selected!</div>
    </div>
    <AddButton @click="() => $modal.show('addTask')" v-show="!roadmap.readonly && !!selectedRoadmap"/>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import TimelineView from './TimelineView';
import AddButton from '../AddButton';

export default {
  components: {
    TimelineView,
    AddButton
  },
  computed: {
    ...mapState({
      roadmap: state => state.roadmap.current
    }),
    ...mapGetters('roadmap', ['selectedRoadmap'])
  },
  methods: mapActions('roadmap', ['selectRoadmap']),
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const id = parseInt(to.params.id, 10);
      if (id && vm.roadmap.id !== id) {
        vm.selectRoadmap({ roadmapId: id });
      }
      if (!id) {
        vm.$router.push(`/timeline/${vm.roadmap.id || 'empty'}`);
      }
    });
  },
  async beforeRouteUpdate(to, from, next) {
    const id = parseInt(to.params.id, 10);
    if (id && this.roadmap.id !== id) {
      await this.selectRoadmap({ roadmapId: id });
    }
    if (!id) {
      return next(`/timeline/${this.roadmap.id || 'empty'}`);
    }
    return next();
  }
};
</script>

<style scoped>
.no-roadmap {
  position: absolute;
  top: 60px;
  bottom: 60px;
  left: 0;
  right: 0;
  width: 100%;
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

