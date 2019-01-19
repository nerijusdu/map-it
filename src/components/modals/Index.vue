<template>
  <div>
    <AddTask />
    <PreviewTask />
    <AddRoadmap />
    <Confirmation />
  </div>
</template>

<script>
import AddTask from './AddTask';
import PreviewTask from './PreviewTask';
import AddRoadmap from './AddRoadmap';
import Confirmation from './Confirmation';

export default {
  components: {
    AddTask,
    PreviewTask,
    AddRoadmap,
    Confirmation
  }
};
</script>

