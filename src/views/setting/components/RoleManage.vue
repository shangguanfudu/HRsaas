<template>
  <div>
    <!-- 新增角色按钮 -->
    <el-row style="height: 60px">
      <el-button
        icon="el-icon-plus"
        size="small"
        type="primary"
        @click="isEditShow = true"
        >新增角色</el-button
      >
    </el-row>
    <!-- 表格 -->
    <el-table border="" :data="roleList">
      <el-table-column align="center" type="index" label="序号" width="120" />
      <el-table-column align="center" prop="name" label="名称" width="240" />
      <el-table-column align="center" prop="description" label="描述" />
      <el-table-column align="center" label="操作">
        <template slot-scope="{ row }">
          <el-button size="small" type="success">分配权限</el-button>
          <el-button size="small" type="primary" @click="editClick(row.id)"
            >编辑</el-button
          >
          <el-button size="small" type="danger" @click="delRole(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-row type="flex" justify="center" align="middle" style="height: 60px">
      <!-- 分页组件 -->
      <el-pagination
        :current-page="page.page"
        :page-size="page.pagesize"
        :total="page.total"
        layout="prev,pager,next"
        @current-change="changePage"
      />
    </el-row>
    <!-- 编辑弹出层 -->
    <el-dialog
      :title="roleForm.id ? '编辑角色' : '添加角色'"
      :visible="isEditShow"
      @close="editCancel"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="editCancel">取消</el-button>
          <el-button size="small" type="primary" @click="editConfirm"
            >确定</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
export default {
  filters: {},
  components: {},
  data () {
    return {
      roleList: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 4,
        total: 0 // 记录总数
      },
      isEditShow: false,
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getRoleList() // 获取角色列表
  },
  methods: {
    async getRoleList () {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.roleList = rows
    },
    changePage (newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList()
    },
    async delRole (id) {
      //  提示
      try {
        await this.$confirm('确认删除该角色吗')
        // 只有点击了确定 才能进入到下方
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
        this.$message('取消了删除')
      }
    },
    async editClick (id) {
      this.roleForm = await getRoleDetail(id)
      this.isEditShow = true // 为了不出现闪烁的问题 先获取数据 再弹出层
    },
    async editConfirm () {
      await this.$refs.roleForm.validate()
      // 只有校验通过的情况下 才会执行await的下方内容
      // roleForm这个对象有id就是编辑 没有id就是新增
      if (this.roleForm.id) {
        await updateRole(this.roleForm)
      } else {
        // 新增业务
        await addRole(this.roleForm)
      }
      // 重新拉取数据
      this.getRoleList()
      this.$message.success('操作成功')
      this.isEditShow = false
    },
    editCancel () {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.isEditShow = false
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
