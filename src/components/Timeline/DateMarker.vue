<template>
  <div
      :class="`date-marker arrow-container ${classes}`"
      :style="{
        background: `${isMouseOver ? color : 'transparent'}`,
        height: `${dateMarkerHeigh}px`,
        'margin-left': `${((window.width - otherElementsSize) * percentage / 100) + categoryLabelSize}px`
      }"
      @click="click"
      :data-cy="`date-marker-${title.replace(' ', '-')}`"
    >
      <div class="arrow-down">
        <md-tooltip md-direction="top">{{title}}</md-tooltip>
        <svg height="30" width="15" @mouseover="() => mouseOver(true)" @mouseleave="() => mouseOver(false)">
          <polygon points="1,13 1,15 7,29 9,29 14,15 14,13" :style="{ fill: color, 'stroke-width':0 }"/>
          <circle cx="7.5" cy="12" r="7" :style="{ fill: color, 'stroke-width':0 }"/>
          <circle cx="7.5" cy="12" r="4" style="fill:#33333d;stroke-width:0"/>
        </svg>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    dateMarkerHeigh: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    hasEpics: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#1eb980'
    },
    classes: {
      type: String,
      default: ''
    },
    click: {
      type: Function,
      default: () => null
    }
  },
  computed: {
    categoryLabelSize() {
      return this.window.width > 600 ? 195 : 10;
    },
    otherElementsSize() {
      const epicSize = this.hasEpics ? 40 : 0;
      return this.categoryLabelSize + epicSize;
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  data: () => ({
    window: {
      width: 0,
      height: 0
    },
    isMouseOver: false
  }),
  methods: {
    mouseOver(arg) {
      this.isMouseOver = arg;
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    }
  }
};
</script>

<style scoped>
.arrow-container {
  position: absolute;
  margin-top: 5px;
  cursor: pointer;
}

.arrow-container:hover {
  position: absolute;
  box-shadow: 0px 0px 3px #5f5f5f;
  width: 2px;
}

.arrow-down {
  width: 2px;
  position: relative;
  top: -25px;
  left: -7px;
}

.arrow-down > div {
  line-height: .8;
  position: relative;
  left: -20px;
}

@media only screen and (max-width: 600px) {
  .arrow-down {
    top: -15px;
  }
}
</style>
