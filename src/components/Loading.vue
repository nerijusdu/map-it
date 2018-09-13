<template>
  <div class="loader-container">
    <div>
      <md-progress-spinner class="md-primary" md-mode="indeterminate" :md-stroke="12" :md-diameter="100"></md-progress-spinner>
    </div>
  </div>
</template>

<style scoped>
.loader-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.loader-container > div {
  height: 100px;
  width: 100px;
}
</style>

