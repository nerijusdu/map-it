<template>
  <div id="app">
    <Navigation />
    <Modals />
    <router-view/>
  </div>
</template>

<script>
import Navigation from './components/Navigation';
import Modals from './components/modals';

export default {
  name: 'App',
  components: {
    Navigation,
    Modals
  }
};
</script>
