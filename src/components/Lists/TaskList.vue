<template>
  <div class="col-3 list-column list-width">
    <div class="heading" :style="{ backgroundColor: list.headerColor }">
      <h4 class="heading-text text-center">{{ list.name == "0" ? "BACKLOG" : "SPRINT - "+list.name  }}</h4>
      <!-- <TaskListActions :board="board" :list="list"></TaskListActions> -->
    </div>
    <div class="cards cards-list">
      <TaskListItem
        class="fixed-card"
        :item="defaultItem"
        :list="list"
        :board="board"
        :fulldata="fulldata"
        @item-edited="itemEdited"
        @item-cancelled="itemCancelled"
        @item-editing="itemEditing"
      ></TaskListItem>
      <draggable v-model="items" v-bind="dragOptions">
        <TaskListItem
          v-for="item in items"
          :item="item"
          :list="list"
          :board="board"
          :fulldata="fulldata"
          :key="item.id"
          @item-edited="itemEdited"
          @item-cancelled="itemCancelled"
          @item-editing="itemEditing"
        ></TaskListItem>
      </draggable>

    </div>
  </div>
</template>
<script>
import Draggable from "vuedraggable"
import TaskListActions from "@/components/Lists/TaskListActions"
import TaskListItem from "@/components/Items/TaskListItem"
import { mapActions } from "vuex"
export default {
  components: {
    TaskListItem,
    TaskListActions,
    Draggable
  },
  props: ["board", "list", "fulldata"],
  data() {
    return {
      isEditing: false
    }
  },
  beforeCreate() {
    console.log("taskList start")
  },
  computed: {
    defaultItem() {
      return {
        id: "",
        text: ""
      }
    },
    
    dragOptions() {
      return {
        animation: "200",
        ghostClass: "ghost",
        group: "kanban-board-list-items",
        disabled: this.isEditing || !this.shouldAllowTaskItemsReorder
      }
    },
    items: {
      get() {
        return this.list.items
      },
      set(reorderedListItems) {
        const payload = {
          boardId: this.board.id,
          listId: this.list.id,
          items: reorderedListItems
        }
        this.reorderTaskListItems(payload)
      }
    },
    shouldAllowTaskItemsReorder() {
      return this.isDesktop || this.isTablet
    }
  },
  methods: {
    ...mapActions({
      reorderTaskListItems: "reorderTaskListItems"
    }),
    itemEditing() {
      this.isEditing = true
    },
    itemEdited() {
      this.isEditing = false
    },
    itemCancelled() {
      this.isEditing = false
    }
  }
}
</script>
