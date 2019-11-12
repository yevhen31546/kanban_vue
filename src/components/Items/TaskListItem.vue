<template>
  <div class="card tasklist-item" style="margin: 10px 5px;; border-bottom: 0.1rem solid rgba(0, 0, 0, 0.9) !import" v-if="!isEditing" @click.prevent="startEditing">
    <div :class="[!isNewItem ? 'card-body post-it-color' : 'card-body']" >
      <div :class="[isNewItem ? 'text-center text-dark font-weight-bold disable-select' : 'text-dark disable-select']">
        <div :class="[!isNewItem ? ' title-font' : '']" >
          <div class="task-kind text-center">
            <img :src="displayNewIcone"  width="90px" v-if=" displayNewIcone !== undefined">
          </div>
          <div :class="[!isNewItem ? 'display-flex' : '']">
            <div  v-if=" displayWorkload != undefined">
              <div class="task-workload">
                {{ displayWorkload }}
              </div>
            </div>
            <span class="new-post-it">
              {{ displayText }}
            </span>
          </div>
        </div>
        <div v-if="!isNewItem" class="post-it">
          <div class="task-kind">
            <img :src="displayIcone"  width="30px" v-if=" displayIcone !== undefined">
          </div>
          <ul>
            <li>
                <i>Assign to :</i><span class="post-it-data"> {{ displayAsigny }} </span>
            </li>
            <li>
                <i>Date due :</i><span class="post-it-data"> {{ displayDateDue }} </span>
            </li>
            <li v-if=" displayProject != undefined">
                <i>Projects :</i><span class="post-it-data"><b> {{ displayProject }} </b></span>
            </li>
          </ul>
        </div>
        <div class="delayed" v-if="!isNewItem ">
          <!-- <span class="delaytitle">Delayed:</span> -->
          <div class="pastille-red"  v-for="n in addDelay" v-if="addDelay >0"/>
          <div class="pastille-red"  v-for="n in displayTaskDelay" v-if="displayTaskDelay > 0 && addDelay==0"/>
        </div>
      </div>
    </div>
  </div>

  <div class="card" v-else>
    <div class="card-body">
      <form class="form">
        <div class="form-group">
          <label> Title: </label>
          <input
            name="itemTitle"
            class="form-control"
            v-model.trim="form.title"
            v-validate="'required'"
            data-vv-as="Item Title"
            placeholder="Task title"
          ></input>
          <br/>
          <label> Date due: </label>
          <datepicker
            :value= "datetoUpdate"
            class="form-control remove-input-border"></datepicker>
          <br/>
          <label> Assign to: </label>
          <input
            name="itemAssigny"
            class="form-control"
            v-model.trim="form.assign"
            data-vv-as="Item Assign"
            placeholder="Task Assigny"
          ></input>
          <br/>
          <label> Project(s): </label>
          <input
            name="itemAssigny"
            class="form-control"
            v-model.trim="form.projects"
            data-vv-as="Item Project"
            placeholder="Project dependency"
          ></input>
          <br/>
          <label> Workload: </label>
          <input
            name="itemAssigny"
            class="form-control"
            v-model.trim="form.workload"
            data-vv-as="Item Workload"
            placeholder="Task Workload"
          ></input>
          <br/>
          <div v-if="!isNewItem">
            <label> Delayed: </label>
            <input
              type="hidden"
              name="itemAssigny"
              class="form-control"
              v-model.trim="form.delayed"
              data-vv-as="Item Workload"
              placeholder="Task Workload"
            ></input>
            <div class="delayed" v-if="!isNewItem">
              <div class="pastille-add" @click.prevent="addDelaytoTask">
                  <span>+</span>
              </div>
              <div class="pastille-red"  v-for="n in addDelay" />
              <!-- <div class="pastille-red"  v-for="n in displayTaskDelay" v-if="displayTaskDelay !== undefined || newDelay"/> -->
            </div>
            <br/>
          </div>
          <label> Comment: </label>
          <textarea
            name="itemComment"
            rows="3"
            class="form-control"
            v-model.trim="form.text"
            v-validate="'required'"
            data-vv-as="Item Comment"
            placeholder="Your comment"
          ></textarea>
          <small class="text-danger">{{ errors.first("itemComment") }}</small>
        </div>

        <div :class="[isNewItem ? 'text-center' : 'd-flex justify-content-between', 'form-group']">
          <div>
            <button class="btn btn-outline-secondary btn-sm mr-2" @click.prevent="save" v-show="isNewItem">
              Save
            </button>
            <button class="btn btn-outline-secondary btn-sm" @click.prevent="cancel" v-if="isNewItem">
                Cancel
            </button>
            <button class="btn btn-outline-secondary btn-sm" @click.prevent="cancel" v-if="!isNewItem">
                Done
            </button>
          </div>
          <!-- <div v-show="!isNewItem">
            <button class="btn btn-sm text-danger" @click.prevent="remove">
              Delete
            </button>
          </div> -->
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex"
import Datepicker from 'vuejs-datepicker';

export default {
  components: {
    Datepicker
  },
  props: ["item", "list", "board", "fulldata"],
  computed: {
    isNewItem() {
      return this.item.id == ""
    },
    displayText() {
      return this.isNewItem ? "+ New Post-it" : this.item.title
    },
    displayAsigny() {
      return this.item.assign.name ? this.item.assign.name : "NC"
    },
    displayDateDue(){
      return this.item.due_date ? this.item.due_date : ""
    },
    datetoUpdate(){
      let curDate = this.item.due_date ? this.item.due_date : ""
      if (curDate !== ""){
        let tp = curDate.split("-")
        return  new Date(tp[0], tp[1]-1, tp[2])
      }
      return  new Date()
    },
    displayIcone(){
      let _tmp = this.fulldata[this.item.id];
      if (_tmp != undefined){
        if (_tmp["kind"].toLowerCase() == "dev"){
            return "img/i_dev.png";
        }

        if (_tmp.kind.toLowerCase() == "spec")
          return "img/i_spec.png"
      }
      return undefined
    },
    displayNewIcone(){
      let _tmp = this.fulldata[this.item.id];
      if (_tmp != undefined){
        if(_tmp["state"] != undefined){
          if (_tmp["state"].toLowerCase() == "new"){
              return "img/new-task.png";
          }
        }
      }
      return undefined
    },
    displayWorkload(){
      let _tmp = this.fulldata[this.item.id];
      if (_tmp != undefined){
        if(_tmp["workload"] != undefined){
            return _tmp.workload.str
        }
      }
      return undefined
    },
    displayTaskDelay(){
      let _tmp = this.fulldata[this.item.id];
      if (_tmp != undefined){
          if(_tmp["delayed"] != undefined){
            this.addDelay = _tmp["delayed"]
            return _tmp["delayed"]
          }
      }
      this.addDelay = 0
      return 0
    },
    displayProject(){
      let _tmp = this.fulldata[this.item.id];
      let prj = ""
      if (!Array.isArray(_tmp.project)){
        return _tmp.project;
      }else{
        for (var v in _tmp.project) {
          if (prj != "")
            prj += " / "
          prj += _tmp.project[v] ;
        }
        return prj
      }
      return undefined
    }
  },
  data() {
    return {
      state:{
        date: new Date()
      },
      addDelay: 0,
      isEditing: false,
      form: {
        id: "",
        title: "",
        assign: "",
        workload: "",
        projects:"",
        datedue:"",
        delayed:""
      }
    }
  },

  methods: {
    ...mapActions({
      saveTaskListItem: "saveTaskListItem",
      deleteTaskListItem: "deleteTaskListItem"
    }),
    getItemProject(){
      let _tmp = this.fulldata[this.item.id];
      let prj = ""
      if (!Array.isArray(_tmp.project)){
        return _tmp.project;
      }else{
        for (var v in _tmp.project) {
          if (prj != "")
            prj += " / "
          prj += _tmp.project[v] ;
        }
        return prj
      }
    },
    getItemWorkload(){
      let _tmp = this.fulldata[this.item.id];
      if (_tmp != undefined){
        if(_tmp["workload"] != undefined){
            return _tmp.workload.str
        }
      }
    },

    startEditing() {
      if (!this.isNewItem){
        this.form.id = this.item.id
        this.form.title = this.item.title
        this.form.assign = this.item.assign.name
        this.form.projects = this.getItemProject()
        this.form.workload = this.getItemWorkload()
      }
      this.isEditing = true
      this.$emit("item-editing")
    },

    addDelaytoTask(){
        let _tmp = this.fulldata[this.item.id];
        if (_tmp != undefined){
            if(_tmp["delayed"] != undefined){
               _tmp["delayed"] += 1
            }else{
              _tmp["delayed"] = 1
            }
        }
        this.addDelay = _tmp["delayed"]
        // console.log(_tmp)
        console.log(this.fulldata[this.item.id])
    },

    clearForm() {
      this.form.id = ""
      this.form.text = ""
    },

    save() {
      this.$validator.validateAll().then(result => {
        if (result) {
          const updatedItem = {
            id: this.form.id,
            text: this.form.text,
            workload: this.form.workload,
            title: this.form.title,
            delayed : this.form.delayed
          }
          this.saveTaskListItem({
            boardId: this.board.id,
            listId: this.list.id,
            item: updatedItem
          })
          this.isEditing = false
          this.$emit("item-edited")
          this.$validator.reset()
        }
      })
    },
    cancel() {
      this.isEditing = false
      this.$emit("item-cancelled")
    },
    remove() {
      this.deleteTaskListItem({
        boardId: this.board.id,
        listId: this.list.id,
        item: this.item
      })
      this.$emit("item-deleted")
    }
  }
}
</script>
