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
                rounded
                class="primary"
                small
                @click="addTask"
              >
                <v-icon
                  left
                  v-text="'mdi-plus'"
                />
                add task
              </v-btn>

              <v-spacer />

              <v-btn
                class="mr-4 success"
                small
                rounded
                @click="startAll"
              >
                <v-icon
                  left
                  v-text="'mdi-play'"
                />
                start all
              </v-btn>

              <v-btn
                class="mr-4 warning"
                rounded
                small
                @click="stopAll"
              >
                <v-icon
                  left
                  v-text="'mdi-stop'"
                />
                stop all
              </v-btn>

              <v-btn
                class="error"
                rounded
                small
                @click="reset"
              >
                <v-icon
                  left
                  v-text="'mdi-delete'"
                />
                delete all
              </v-btn>
            </v-card-title>

            <v-card-text style="max-height: 60vh; overflow: auto">
              <v-data-table
                :headers="headers"
                :items="tasks"
                hide-default-footer
              >
                <template v-slot:item.store="{ item }">
                  <span>{{ item.store.name }}</span>
                </template>

                <template v-slot:item.entries="{ item }">
                  <span>{{ item.success }} / {{ getEntries(item) }}</span>
                </template>

                <template v-slot:item.delays="{ item }">
                  <span>{{ item.delays }}ms</span>
                </template>

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
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <TaskDialog ref="taskDialog" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { ipcRenderer } from 'electron'

import Constant from '@/config/constant'
import TaskDialog from '@/components/Dialogs/Task'

export default {
  components: { TaskDialog },
  data () {
    return {
      headers: [
        { text: 'Store', value: 'store' },
        { text: 'Entries', value: 'entries', align: 'center' },
        { text: 'Delays', value: 'delays', align: 'center' },
        { text: 'Elapse', value: 'elapse', align: 'center' },
        { text: 'Status', value: 'status', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ]
    }
  },
  computed: {
    ...mapState('task', { tasks: 'items' }),
    ...mapState('account', { accounts: 'items' })
  },
  methods: {
    ...mapActions('task', { updateTask: 'updateItem', deleteTask: 'deleteItem', reset: 'reset' }),
    /**
     * return total entries
     */
    getEntries (item) {
      try {
        return this.accounts.find((element) => element.id === item.id).accounts.length
      } catch (error) {
        return 0
      }
    },
    /**
     * add task event
     */
    addTask () {
      this.$refs.taskDialog.dialog = true
    },
    /**
     * on start task event
     */
    startTask (item) {
      this.updateTask({
        ...item,
        status: {
          id: Constant.TASK.STATUS.RUNNING,
          msg: 'running',
          class: 'warning'
        }
      })

      ipcRenderer.send('automate', JSON.stringify(item))
    },
    /**
     * on stop task event
     */
    stopTask (item) {
      this.updateTask({
        ...item,
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
