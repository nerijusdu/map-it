<template>
  <div>
    <AddRoadmapEntity />
    <PreviewTask />
    <PreviewCategory />
    <PreviewMilestone />
    <PreviewEpic />
    <AddRoadmap />
    <Confirmation />
    <PreviewLog />
  </div>
</template>

<script>
import AddRoadmapEntity from './AddRoadmapEntity/Index';
import PreviewTask from './PreviewTask';
import PreviewCategory from './PreviewCategory';
import PreviewMilestone from './PreviewMilestone';
import PreviewEpic from './PreviewEpic';
import AddRoadmap from './AddRoadmap';
import Confirmation from './Confirmation';
import PreviewLog from './PreviewLog';

export default {
  components: {
    AddRoadmapEntity,
    PreviewTask,
    PreviewCategory,
    PreviewMilestone,
    PreviewEpic,
    AddRoadmap,
    PreviewLog,
    Confirmation
  }
};
</script>

