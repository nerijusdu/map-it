<template>
  <div v-bind:class="['button', type  || 'neutral', {'disabled': disabled}]">
    <img v-if="icon" :src="getImgUrl(icon)"/>
    <span>{{label}}</span>
  </div>
</template>

<script>
export default {
  props: [
    'label',
    'type',
    'disabled',
    'icon'
  ],
  methods: {
    getImgUrl: (name) => {
      const images = require.context('../../assets/', false);
      return images(`./${name}`);
    }
  }
};
</script>

<style scoped>

.button {
  padding-left: 10px;
  padding-right: 10px;
  height: 35px;
  border-radius: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  user-select: none;
  text-shadow: 2px 1px 2px #444;
}

.button > svg {
  filter: drop-shadow(2px 1px 2px #444);
}

.button > span {
  margin-left: 5px;
}

.button.positive {
  background: var(--primary-color);
}

.button.disabled {
  background: #d0d0d0;
  cursor: default;
}

.button.positive:hover:not(.disabled),
.button.neutral:hover:not(.disabled) {
  background: var(--primary-darker-color);
}
</style>

