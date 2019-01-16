<template>
  <div>
    <AddTask />
    <PreviewTask />
    <AddRoadmap />
  </div>
</template>

<script>
import AddTask from './AddTask';
import PreviewTask from './PreviewTask';
import AddRoadmap from './AddRoadmap';

export default {
  components: {
    AddTask,
    PreviewTask,
    AddRoadmap
  }
};
</script>

