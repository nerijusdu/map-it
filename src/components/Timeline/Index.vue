<template>
  <div className="app-wrapper">
    <Menu />
    <TimelineView />
  </div>
</template>

<script>
import TimelineView from './TimeLineView';
import Menu from './Menu';

export default {
  components: {
    TimelineView,
    Menu
  }
};
</script>
