import Dashboard from "@/views/dashboard.vue"
import TaskBoard from "@/views/taskboard.vue"

export default [
  {
    path: "/",
    name: "home",
    redirect: "/dashboard"
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard
  },
  {
    path: "/boards/:id",
    name: "task-board",
    component: TaskBoard
  }
]
