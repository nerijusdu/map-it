<template>
  <div class="flex add-button">
    <md-button class="md-icon-button md-primary md-raised" @click="() => $emit('click')" data-cy="add-btn">
      <img src="@/assets/plus.svg" alt="Add"/>
    </md-button>
  </div>
</template>

<style scoped>
.add-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>

