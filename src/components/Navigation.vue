<template>
  <div class="navigation-bar">
    <div class="navigation-logo flex-center" @click="$router.push('/timeline')">
      <img src="@/assets/logo.svg"/>
    </div>
    <div class="grow flex-center-v">
      <md-field class="roadmap-select" v-show="roadmaps.length > 0">
        <md-select v-model="roadmapSelection" @md-selected="updateRoadmap">
          <md-option
            v-for="r in roadmaps"
            :key="r.id"
            :value="r.id"
          >
            {{ r.title }}
          </md-option>
        </md-select>
      </md-field>
    </div>
    <div class="flex desktop-navigation">
      <div class="navigation-item flex-center" @click="$router.push('/timeline')">
        <div class="navigation-item-icon"><img src="@/assets/flag.svg"/></div>
        <div class="navigation-item-title">Timeline</div>
      </div>
      <div class="navigation-item flex-center" v-show="isAdmin" @click="$router.push('/logs')">
        <div class="navigation-item-icon"><img src="@/assets/book.svg"/></div>
        <div class="navigation-item-title">Logs</div>
      </div>
      <div class="navigation-item flex-center" @click="$router.push('/roadmaps')">
        <div class="navigation-item-icon"><img src="@/assets/map.svg"/></div>
        <div class="navigation-item-title">Roadmaps</div>
      </div>
      <md-menu class="navigation-item flex-center" md-size="small" md-align-trigger>
        <div class="flex-center" md-menu-trigger>
          <div class="navigation-item-icon"><img src="@/assets/user.svg"/></div>
          <div class="navigation-item-title">Profile</div>
        </div>
        <md-menu-content>
          <md-menu-item @click="$router.push('/settings')">Settings</md-menu-item>
          <md-menu-item @click="logout">Logout</md-menu-item>
        </md-menu-content>
      </md-menu>
    </div>
    <div class="mobile-navigation">
      <div class="navigation-item flex-center" @click="showDrawer = true">
        <div class="navigation-item-icon"><img src="@/assets/menu.svg"/></div>
      </div>

      <md-drawer :md-active.sync="showDrawer" md-swipeable class="drawer md-right">
        <md-toolbar class="md-transparent drawer-header" md-elevation="0">
          <img src="@/assets/logo.svg"/>
          <span class="md-title">Map-it</span>
        </md-toolbar>

        <md-list class="drawer-content">
          <md-list-item @click="navigateFromDrawer('/timeline')">
            <div class="flex-center">
              <div class="navigation-item-icon mobile"><img src="@/assets/flag.svg"/></div>
              <div>Timeline</div>
            </div>
          </md-list-item>
          <md-list-item v-show="isAdmin" @click="navigateFromDrawer('/logs')">
            <div class="flex-center">
              <div class="navigation-item-icon mobile"><img src="@/assets/book.svg"/></div>
              <div>Logs</div>
            </div>
          </md-list-item>
          <md-list-item @click="navigateFromDrawer('/roadmaps')">
            <div class="flex-center">
              <div class="navigation-item-icon mobile"><img src="@/assets/map.svg"/></div>
              <div>Roadmaps</div>
            </div>
          </md-list-item>
          <md-list-item :md-expanded.sync="expandProfile" md-expand>
            <div class="flex-center" md-menu-trigger>
              <div class="navigation-item-icon mobile"><img src="@/assets/user.svg"/></div>
              <div>Profile</div>
            </div>
            <md-list slot="md-expand">
              <md-list-item class="md-inset" @click="$router.push('/settings')">Settings</md-list-item>
              <md-list-item class="md-inset" @click="logout">Logout</md-list-item>
            </md-list>
          </md-list-item>
        </md-list>
      </md-drawer>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  data: () => ({
    roadmapSelection: null,
    showDrawer: false,
    expandProfile: false
  }),
  computed: {
    ...mapState({
      roadmaps: state => state.roadmap.all.map(r => ({ id: r.id, title: r.title })),
      isAdmin: state => state.app.user.isAdmin,
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
    navigateFromDrawer(path) {
      this.showDrawer = false;
      this.$router.push(path);
    },
    updateRoadmap() {
      if (this.roadmapSelection && this.isInitialized) {
        this.selectRoadmap({ roadmapId: this.roadmapSelection });
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

.navigation-logo > img, .drawer-header > img {
  height: 100%;
}

.md-menu-content:last-of-type {
  right: 0 !important;
}

.roadmap-select {
  max-width: 200px;
  cursor: pointer;
}

.mobile-navigation {
  display: none;
}

.drawer {
  background-color: var(--main-bg-color);
}

.drawer-content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.navigation-item-icon.mobile {
  margin: 10px;
}

.navigation-item.mobile {
  display: flex;
  justify-content: flex-start;
}

.drawer-header {
  display: flex;
  height: 50px;
  cursor: pointer;
}

.md-list-item-content /*> .md-list-expand-icon > svg > path*/ {
  stroke: black !important;
  background: red !important;
  color: red !important;
}

@media only screen and (max-width: 600px) {
  .navigation-item-title {
    display: none;
  }

  .navigation-item-icon {
    margin-right: 0px;
  }

  .desktop-navigation {
    display: none;
  }

  .mobile-navigation {
    display: flex;
  }

  .md-list-item-expand {
    border: none;
  }
}
</style>

<style>
.md-list-expand-icon > svg > path {
  stroke: none;
}
</style>
