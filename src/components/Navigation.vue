<template>
  <div class="navigation-bar">
    <div class="navigation-logo flex-center" @click="$router.push('/timeline')">
      <img src="@/assets/logo.svg"/>
    </div>
    <div class="grow flex-center-v">
      <md-field class="roadmap-select">
        <md-select v-model="roadmapSelection" @md-selected="updateRoadmap()">
          <md-option
            v-for="r in roadmaps"
            v-bind:key="r.id"
            v-bind:value="r.id"
          >
            {{ r.title }}
          </md-option>
        </md-select>
      </md-field>
    </div>
    <div class="flex">
      <div class="navigation-item flex-center" @click="$router.push('/roadmaps')">
        <div class="navigation-item-icon"><img src="@/assets/map.svg"/></div>
        <div>Roadmaps</div>
      </div>
      <!-- <div class="navigation-item flex-center">
        <div class="navigation-item-icon"><img src="@/assets/settings.svg"/></div>
        <div>Settings</div>
      </div> -->
      <md-menu class="navigation-item flex-center" md-size="small" md-align-trigger>
        <div class="flex-center" md-menu-trigger>
          <div class="navigation-item-icon"><img src="@/assets/user.svg"/></div>
          <div>Profile</div>
        </div>
        <md-menu-content>
          <md-menu-item @click="logout">Logout</md-menu-item>
        </md-menu-content>
    </md-menu>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  data: () => ({
    roadmapSelection: null
  }),
  computed: {
    ...mapState({
      roadmaps: state => state.roadmap.all.map(r => ({ id: r.id, title: r.title })),
      isInitialized: state => state.roadmap.isInitialized
    }),
    ...mapGetters('roadmap', ['selectedRoadmap'])
  },
  methods: {
    ...mapActions({
      logoutAction: 'app/logout',
      selectRoadmap: 'roadmap/selectRoadmap'
    }),
    logout() {
      this.logoutAction(this.$router);
    },
    updateRoadmap() {
      if (this.roadmapSelection && this.isInitialized) {
        this.selectRoadmap(this.roadmapSelection);
      }
    }
  },
  watch: {
    selectedRoadmap(val) {
      this.roadmapSelection = val;
    }
  }
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
  height: 100%;
  margin-right: 10px;
  cursor: pointer;
}

.navigation-logo > img {
  height: 100%;
}

.md-menu-content:last-of-type {
  right: 0 !important;
}

.roadmap-select {
  max-width: 200px;
  cursor: pointer;
}

@media only screen and (max-width: 600px) {
  .roadmap-select {
    display: none;
  }
}
</style>

