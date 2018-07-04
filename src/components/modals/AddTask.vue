<template>
  <modal name="addTask" height="auto">
    <div class="modal-title">
      <div>Add new task</div>
    </div>
    <form class="modal-content">
      <md-field>
        <label>Title</label>
        <md-input></md-input>
      </md-field>
      <md-field>
        <label>Description</label>
        <md-textarea></md-textarea>
      </md-field>
      <md-field>
        <label for="category">Category</label>
        <md-select name="category" id="category">
          <md-option value="1">Web</md-option>
          <md-option value="2">Mobile</md-option>
          <md-option value="3">Design</md-option>
        </md-select>
      </md-field>
      <md-datepicker md-immediately>
        <label>Start date</label>
      </md-datepicker>
      <md-datepicker md-immediately>
        <label>End date</label>
      </md-datepicker>
    </form>
    <div class="modal-footer">
      <md-button class="md-raised md-accent" @click="() => $modal.hide('addTask')">Cancel</md-button>
      <md-button class="md-raised md-primary">Save</md-button>
    </div>
  </modal>
</template>

<script>
export default {};
</script>
