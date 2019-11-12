<template>
  <div class="">
    <div class="" v-if="isProjectBoard">
      <!-- <span> PROJECT BOARD</span> -->
      <!-- <button @click.prevent="applyFilterProjet"> FILTER </button> -->
      <select class="" name="projectFilterSelect" v-model="projectFilterValue">
        <option value="all-project"> - Choisissez un projet - </option>
        <option :value="projectItem.id" v-for="(projectItem, index) in getBoard.project_list" >{{ projectItem.name }}</option>
      </select>
      <div v-for="(projectItem, index) in getBoard.project_list" :key="index"  class="project-issues" v-if="projectItem.id == projectFilterValue  || projectFilterValue == 'all-project' ">
          <div class="">
            <span class="project-title-side ">{{ projectItem.name }} </span>
            <div class="" style="display: flex; margin-top: 25px;">
              <draggable v-model="lists" class="row flex-nowrap mt-1" v-bind="getDragOptions">
                <TaskList v-for="(listItem, index) in projectItem.lists" :key="index"
                          :board="projectItem"
                          :list="listItem"
                          :fulldata="getFullData"></TaskList>
              </draggable>
            </div>
          </div>
      </div>
    </div>
    <draggable v-model="lists" class="row flex-nowrap mt-1" v-bind="getDragOptions" v-if="!isProjectBoard">
      <TaskList v-for="(listItem, index) in lists" :key="index"
                :board="getBoard"
                :list="listItem"
                :fulldata="getFullData"></TaskList>
    </draggable>
  </div>
</template>
<script>
import TaskList from "@/components/Lists/TaskList"
import Draggable from "vuedraggable"
import { mapGetters, mapActions } from "vuex"
export default {
  name: "Board",
  data() {
    return {
        projectFilterValue: 'all-project'
    }
  },
  components: {
    TaskList,
    Draggable
  },
  computed: {
    ...mapGetters({
      boards: "allBoards",
      isLoading: "isLoading"
    }),
    getDragOptions() {
      return {
        animation: "200",
        ghostClass: "ghost",
        handle: ".heading",
        disabled: !this.shouldAllowListOrder,
        group: "kanban-board-lists"
      }
    },
    param() {
      return this.$route.params.id
    },
    shouldAllowListOrder() {
      return this.isDesktop || this.isTablet
    },
    getBoard() {
      return this.boards.find(b => b.id == this.param)
    },
    getFullData() {
      return this.boards[0].issue
    },
    isProjectBoard(){
      // console.log("TASKLIST:" + this.getBoard)
      if(this.getBoard.hasOwnProperty('project_list')){
        // console.log(this.board.project_list)
        return true
      }
      return false
    },

    lists: {
      get() {
        // console.log(this.getBoard)
        if(this.getBoard.hasOwnProperty('project_list')){
          return this.getBoard ? this.getBoard.project_list.filter(l => !l.archived) : []
        }
        return this.getBoard ? this.getBoard.lists.filter(l => !l.archived) : []
      },
      async set(value) {
        await this.reorderTaskLists({
          boardId: this.param,
          lists: value
        })
      }
    }
  },
  methods: {
    ...mapActions({
      reorderTaskLists: "reorderTaskLists",
      setActiveTaskBoard: "setActiveTaskBoard"
    }),

    applyFilterProjet(){
      this.projectFilterValue = "DamPim"
    }
  },

  created() {
    if (this.getBoard) {
      this.setActiveTaskBoard({
        board: this.getBoard
      })
    }
  }
}
</script>
