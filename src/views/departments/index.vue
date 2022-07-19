<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card v-loading="loading" class="tree-card" style="min-height: 700px">
        <el-tabs>
          <el-tab-pane label="用户管理">
            <!-- 用了一个行列布局 -->
            <TreeItem :node="header" @change-event="getDepartment"></TreeItem>
            <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
            <el-tree
              :data="departs"
              :props="defaultProps"
              :default-expand-all="true"
            >
              <!-- scoped slot 会传入两个参数node和data，分别表示当前节点的 Node 对象和当前节点的数据 -->
              <template v-slot="scope">
                <TreeItem
                  :node="scope.node"
                  @change-event="getDepartment"
                ></TreeItem>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import TreeItem from './components/TreeItem.vue'
import { getDepartment } from '@/api/department'
export default {
  filters: {},
  components: { TreeItem },
  data () {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [],
      header: {},
      loading: true
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getDepartment()
  },
  methods: {
    async getDepartment () {
      const res = await getDepartment()
      console.log(res)
      this.departs = this.transferListToTree(res.depts, '')
      this.header = res.depts[0]
      this.loading = false
      // console.log(this.departs)
      // region
      // const list1 = []
      // res.depts.forEach(item => {
      //   if (item.pid === '') {
      //     list1.push(item)
      //     // 再把儿子都找到
      //     item.children = []
      //     res.depts.forEach(items => {
      //       if (items.pid === item.id) {
      //         item.children.push(items)
      //       }
      //     })
      //   }
      // })
      // console.log(list1)
      // endregion
    },
    // 递归处理数据
    transferListToTree (list, pid) {
      const list1 = []
      list.forEach(item => {
        if (item.pid === pid) {
          list1.push(item)
          item.children = this.transferListToTree(list, item.id)
        }
      })
      return list1
    }
  }
}
</script>

<style scoped lang='scss'>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
