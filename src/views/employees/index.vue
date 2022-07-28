<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <span slot="before">共166条记录</span>
        <template #after>
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import?type=user')"
            >excel导入</el-button
          >
          <el-button size="small" type="danger" @click="exportMore"
            >复杂表头excel导出</el-button
          >
          <el-button size="small" type="success" @click="exportExcel"
            >普通excel导出</el-button
          >
          <el-button
            icon="plus"
            type="primary"
            size="small"
            @click="showDialog = true"
            >新增员工</el-button
          >
        </template>
      </PageTools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="employList">
          <el-table-column align="center" label="序号" sortable type="index" />
          <el-table-column
            align="center"
            label="姓名"
            sortable
            prop="username"
          />
          <el-table-column align="center" label="头像">
            <template slot-scope="scope">
              <img
                v-imageerror
                :src="
                  scope.row.staffPhoto ||
                  'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
                "
                alt=""
                style="width: 50px; height: 50px; border-radius: 50%"
                @click="QRClick(scope.row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="手机号"
            sortable
            prop="mobile"
          />

          <el-table-column
            align="center"
            label="工号"
            sortable
            prop="workNumber"
          />
          <el-table-column
            :formatter="formatEmployment"
            align="center"
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
          />
          <el-table-column
            align="center"
            label="部门"
            sortable
            prop="departmentName"
          />
          <el-table-column
            align="center"
            label="入职时间"
            sortable
            prop="timeOfEntry"
          >
            <template slot-scope="obj">
              {{ obj.row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            label="在职状态"
            align="center"
            sortable
            prop="enableState"
          >
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            fixed="right"
            width="280"
          >
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push('/employee/detail/' + row.id)"
                >查看</el-button
              >
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="roleEdit(row.id)"
                >角色</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
      <AddEmployee :show-dialog.sync="showDialog"></AddEmployee>
      <template v-if="isRoleShow">
        <RoleChoose
          :id="currentId"
          :is-role-show.sync="isRoleShow"
        ></RoleChoose>
      </template>
      <!-- 二维码对话框 -->
      <el-dialog title="图片二维码" :visible.sync="isQRShow">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/constant/employees'
import AddEmployee from './components/AddEmployee.vue'
import RoleChoose from './components/RoleChoose.vue'
import QRcode from 'qrcode'
export default {
  filters: {},
  components: { AddEmployee, RoleChoose },
  data () {
    return {
      showDialog: false,
      isRoleShow: false,
      isQRShow: false,
      currentId: 'null',
      loading: false,
      employList: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      }
    }
  },
  computed: {},
  watch: {},
  created () { this.getEmployeeList() },
  methods: {
    changePage (newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    async getEmployeeList () {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.employList = rows
      this.loading = false
    },
    // 格式化聘用形式
    formatEmployment (row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async deleteEmployee (id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
        this.$message('取消了删除')
      }
    },
    roleEdit (id) {
      this.currentId = id
      this.isRoleShow = true
    },
    // 生成二维码
    QRClick (url) {
      // console.log(url)
      if (url) {
        this.isQRShow = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QRcode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    // 导出
    async exportExcel () {
      // 获取所有数据
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      const data = []
      rows.forEach(item => {
        data.push(Object.values(item))
      })
      // console.log(data)
      const headers = {
        'id': '编号',
        'username': '姓名',
        'mobile': '手机',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门'
      }
      const tHeader = Object.keys(rows[0]).map(item => (headers[item]))
      // 懒加载
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: '人力资源员工表', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    // 复杂导出
    async exportMore () {
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const header = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      // 获取所有数据
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      const data = []
      rows.forEach(item => {
        data.push(Object.values(item))
      })
      // console.log(data)
      // 懒加载
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header,
          data,
          filename: '员工资料表',
          multiHeader, // 复杂表头
          merges // 合并选项
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
