<template>
  <div className="app-wrapper">
    <Menu />
    <TimelineView v-if="!!roadmap.id"/>
    <div v-if="!roadmap.id" class="no-roadmap">
      <div>No roadmap selected!</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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

