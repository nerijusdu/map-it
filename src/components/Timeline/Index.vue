<template>
  <div className="app-wrapper">
    <Menu />
    <TimelineView v-if="!roadmap.id"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TimelineView from './TimeLineView';
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
