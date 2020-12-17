<template>
  <div>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          sm="2"
        >
          <v-card>
            <v-card-text />
          </v-card>
        </v-col>

        <v-col
          cols="12"
          sm="10"
        >
          <v-card>
            <v-card-title>
              <v-btn
                fab
                class="primary"
                x-small
                @click="addTask"
              >
                <v-icon v-text="'mdi-plus'" />
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="tasks"
                hide-default-footer
              >
                <template v-slot:item.status="{ item }">
                  <v-chip
                    :color="item.status.class"
                    small
                    outlined
                    v-text="item.status.msg"
                  />
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn
                    v-if="item.status.id === 1"
                    fab
                    x-small
                    class="mr-2 success"
                    @click="startTask(item)"
                  >
                    <v-icon
                      small
                      v-text="'mdi-play'"
                    />
                  </v-btn>

                  <v-btn
                    v-else
                    fab
                    x-small
                    class="mr-2 warning"
                    @click="stopTask(item)"
                  >
                    <v-icon
                      small
                      v-text="'mdi-stop'"
                    />
                  </v-btn>

                  <v-btn
                    fab
                    x-small
                    class="mr-2 primary"
                    @click="editTask(item)"
                  >
                    <v-icon
                      small
                      v-text="'mdi-pencil'"
                    />
                  </v-btn>

                  <v-btn
                    fab
                    x-small
                    class="mr-2 error"
                    @click="deleteTask(item)"
                  >
                    <v-icon
                      small
                      v-text="'mdi-delete'"
                    />
                  </v-btn>

                  <v-btn
                    fab
                    x-small
                    class="primary"
                  >
                    <v-icon
                      small
                      v-text="'mdi-dots-vertical'"
                    />
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-footer
      app
      padless
      class="transparent"
    >
      <v-card
        class="flex transparent"
        flat
        tile
      >
        <v-card-title class="pa-0">
          <v-row
            justify="center"
            align="center"
          >
            <v-col
              align-self="center"
              cols="auto"
              class="text-center"
            >
              <v-sheet class="pa-2 all-actions">
                <v-btn
                  class="mx-4 success"
                  fab
                  x-small
                  @click="startAll"
                >
                  <v-icon v-text="'mdi-play'" />
                </v-btn>

                <v-btn
                  class="mx-4 warning"
                  fab
                  x-small
                  @click="stopAll"
                >
                  <v-icon v-text="'mdi-stop'" />
                </v-btn>

                <v-btn
                  class="mx-4 error"
                  fab
                  x-small
                  @click="reset"
                >
                  <v-icon v-text="'mdi-delete'" />
                </v-btn>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text class="py-2 text-center">
          <small>{{ new Date().getFullYear() }} — <strong>Talos</strong></small>
        </v-card-text>
      </v-card>
    </v-footer>

    <TaskDialog ref="taskDialog" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Constant from '@/config/constant'
import TaskDialog from '@/components/Task/TaskDialog'

export default {
  components: { TaskDialog },
  data () {
    return {
      headers: [
        { text: 'Site', value: 'site' },
        { text: 'Entries', value: 'entries', align: 'center' },
        { text: 'Delays', value: 'delays', align: 'center' },
        { text: 'Elapse', value: 'elapse', align: 'center' },
        { text: 'Status', value: 'status', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ]
    }
  },
  computed: {
    ...mapState('task', { tasks: 'items' })
  },
  methods: {
    ...mapActions('task', { updateTask: 'updateItem', deleteTask: 'deleteItem', reset: 'reset' }),
    /**
     * add task event
     */
    addTask () {
      this.$refs.taskDialog.model = true
    },
    /**
     * on start task event
     */
    startTask (item) {
      this.updateTask({
        task: item,
        status: {
          id: Constant.TASK.STATUS.RUNNING,
          msg: 'running',
          class: 'warning'
        }
      })
    },
    /**
     * on stop task event
     */
    stopTask (item) {
      this.updateTask({
        task: item,
        status: {
          id: Constant.TASK.STATUS.STOPPED,
          msg: 'stopped',
          class: 'grey'
        }
      })
    },
    /**
     * on edit task event
     */
    editTask (item) {
      this.$refs.taskDialog.mapData(item)
    },
    /**
     * on start all event
     */
    startAll () {
      this.tasks.forEach(element => {
        this.startTask(element)
      })
    },
    /**
     * on stop all event
     */
    stopAll () {
      this.tasks.forEach(element => {
        this.stopTask(element)
      })
    }
  }
}
</script>

<style scoped>
.all-actions {
  border-radius: 100px !important
}
</style>
