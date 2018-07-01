<template>
  <div className="app-wrapper">
    <Menu />
    <TimelineView v-bind:categories="categories"/>
  </div>
</template>

<script>
import TimelineView from './TimeLineView';
import Menu from './Menu';

export default {
  data: () => ({
    categories: [
      {
        title: 'Mobile',
        color: 'red',
        tasks: [
          { title: 'Do mobile' },
          { title: 'Compile' },
          { title: 'Deploy' }
        ]
      },
      {
        title: 'Web',
        color: 'orange',
        tasks: [
          { title: 'Do web' },
          { title: 'Deploy' }
        ]
      },
      {
        title: 'Design',
        color: 'lime',
        tasks: [
          { title: 'How to design?' }
        ]
      }
    ]
  }),
  components: {
    TimelineView,
    Menu
  }
};
</script>
