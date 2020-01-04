<template>
  <div className="app-wrapper">
    <Menu v-if="!roadmap.readonly"/>
    <TimelineView v-if="!!roadmap.id"/>
    <div v-if="!roadmap.id" class="no-roadmap">
      <div>No roadmap selected!</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import TimelineView from './TimelineView';
import Menu from './Menu';

export default {
  components: {
    TimelineView,
    Menu
  },
  computed: {
    ...mapState({
      roadmap: state => state.roadmap.current
    })
  },
  methods: mapActions('roadmap', ['selectRoadmap']),
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const id = parseInt(to.params.id, 10);
      if (id && vm.roadmap.id !== id) {
        vm.selectRoadmap(id);
      }
      if (!id) {
        vm.$router.push(`/timeline/${vm.roadmap.id || 'empty'}`);
      }
    });
  },
  async beforeRouteUpdate(to, from, next) {
    const id = parseInt(to.params.id, 10);
    if (id && this.roadmap.id !== id) {
      await this.selectRoadmap(id);
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

