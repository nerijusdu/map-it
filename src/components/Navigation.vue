<template>
  <div class="navigation-bar">
    <div class="navigation-logo flex-center">
      <span>MapIt</span>
    </div>
    <div class="grow flex-center-v">
      <!-- Roadmap selection goes here -->
    </div>
    <div class="flex">
      <div class="navigation-item flex-center">
        <div class="navigation-item-icon"><img src="@/assets/settings.svg"/></div>
        <div>Settings</div>
      </div>
      <div class="navigation-item flex-center">
        <div class="navigation-item-icon"><img src="@/assets/user.svg"/></div>
        <div>Profile</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style scoped>
.navigation-bar {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  background: var(--secondary-bg-color);
}

.navigation-item {
  padding: 10px;
  text-shadow: 2px 1px 2px #222;
}

.navigation-item:hover{
  background: var(--primary-color);
  cursor: pointer;
}

.navigation-item:hover > div > svg {
  filter: drop-shadow(2px 1px 2px #222);
}

.navigation-item-icon {
  margin-right: 10px;
}

.navigation-logo {
  width: 100px;
  height: 50px;
  border-right: 1px solid var(--primary-color);
  margin-right: 10px;
}
</style>

