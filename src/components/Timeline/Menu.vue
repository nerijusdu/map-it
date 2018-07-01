<template>
  <div class="menu-bar">
    <div class="menu-bar-nav border-between-children">
      <div class="flex-center">Items</div>
      <div class="flex-center">Layout</div>
      <div class="flex-center">Colors</div>
    </div>
    <div class="flex">
      <Button label="Item" icon="plus.svg" type="positive" />
      <Button label="Category" icon="plus.svg" type="positive" />
      <Button label="Export" icon="export.svg" disabled="true"/>
    </div>
  </div>
</template>

<script>
import Button from '@/components/common/Button';

export default {
  components: {
    Button
  }
};
</script>


<style scoped>
.menu-bar {
  width: 99%;
  height: 40px;
  padding-top: 5px;
  padding-bottom: 5px;
  display: flex;
  align-items: space-between;
  justify-content: space-between;
  padding-right: 1%;
  position: fixed;
  bottom: 0px;
}

.menu-bar > div > div.button {
  margin-left: 5px;
  margin-right: 5px;
}

.menu-bar-nav {
  display: flex;
  font-size: 12pt;
}

.menu-bar-nav > div {
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  user-select: none;
  text-shadow: 2px 1px 2px #8a8a8a;
  cursor: pointer;
}

.menu-bar-nav > div:hover {
  color: var(--primary-color);
}
</style>

