<template>
  <div>
    <AddTask />
    <PreviewTask />
    <PreviewCategory />
    <AddRoadmap />
    <Confirmation />
  </div>
</template>

<script>
import AddTask from './AddTask';
import PreviewTask from './PreviewTask';
import PreviewCategory from './PreviewCategory';
import AddRoadmap from './AddRoadmap';
import Confirmation from './Confirmation';

export default {
  components: {
    AddTask,
    PreviewTask,
    PreviewCategory,
    AddRoadmap,
    Confirmation
  }
};
</script>

