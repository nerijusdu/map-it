<template>
  <md-table class="paged-list">
    <md-table-toolbar class="toolbar">
      <h1>{{title}}</h1>
      <div class="page-controls">
        <img src="@/assets/arrow-left.svg" v-show="page !== 1" @click="changePage(page - 1)"/>
        <div>Page: {{page}} of {{totalPages}}</div>
        <img src="@/assets/arrow-right.svg" v-show="page !== totalPages" @click="changePage(page + 1)"/>
      </div>
      <div class="additional-filters">
        <slot
          name="filters"
          :getData="getData"
          :filters="filterValues"
        ></slot>
      </div>
    </md-table-toolbar>
    <md-table-row class="header">
      <md-table-head v-for="c in columns" :key="c.field+c.name">
        {{c.name}}
      </md-table-head>
    </md-table-row>
    <md-table-row
      class="main-bg-color"
      v-for="dataItem in data"
      :key="dataItem[uniqueColumn]"
      @click="handleClick(dataItem)">
      <md-table-cell
        class="clickable"
        v-for="c in columns"
        :key="c.field+c.name"
      >
        {{ dataItem[c.field] }}
      </md-table-cell>
    </md-table-row>
  </md-table>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    uniqueColumn: {
      type: String,
      required: true
    },
    fetchDataFunc: {
      type: Function,
      required: true
    },
    filterValues: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    data: [],
    page: 1,
    totalPages: 1
  }),
  methods: {
    handleClick(item) {
      this.$emit('rowClick', item);
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.page = page;
        this.getData();
      }
    },
    async getData({ resetPaging, filters } = { filters: {} }) {
      if (resetPaging) {
        this.page = 1;
      }

      const res = await this.fetchDataFunc({
        page: this.page,
        ...filters
      });

      if (res.ok) {
        this.data = res.data.items;
        this.totalPages = res.data.pageCount || 1;
      }
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style scoped>
.paged-list, .header, .toolbar, .main-bg-color {
  background-color: var(--main-bg-color);
}

.toolbar {
  display: flex;
  justify-content: space-between;
}

.page-controls, .additional-filters {
  display: flex;
}

.page-controls > div {
  margin: 5px;
}

.page-controls > img {
  cursor: pointer;
}
</style>
