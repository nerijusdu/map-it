<template>
  <div>
    <AddTask />
    <PreviewTask />
    <PreviewCategory />
    <PreviewMilestone />
    <PreviewEpic />
    <AddRoadmap />
    <Confirmation />
  </div>
</template>

<script>
import AddTask from './AddTask';
import PreviewTask from './PreviewTask';
import PreviewCategory from './PreviewCategory';
import PreviewMilestone from './PreviewMilestone';
import PreviewEpic from './PreviewEpic';
import AddRoadmap from './AddRoadmap';
import Confirmation from './Confirmation';

export default {
  components: {
    AddTask,
    PreviewTask,
    PreviewCategory,
    PreviewMilestone,
    PreviewEpic,
    AddRoadmap,
    Confirmation
  }
};
</script>

