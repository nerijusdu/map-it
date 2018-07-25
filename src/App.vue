<template>
  <div id="app">
    <Modals />
    <router-view name="navigation" />
    <router-view/>
  </div>
</template>

<script>
import Modals from './components/modals';

export default {
  name: 'App',
  components: {
    Modals
  }
};
</script>
