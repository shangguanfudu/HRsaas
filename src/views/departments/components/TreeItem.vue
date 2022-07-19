<template>
  <div style="width: 100%">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; width: 100%"
    >
      <el-col>
        <span>{{ node.data ? node.data.name : node.name }}</span>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col>{{ node.data ? node.data.manager : "负责人" }}</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="onCommand">
              <span class="spanWidth">
                操作<i class="el-icon-arrow-down" />
              </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                <template v-if="node.data">
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 编辑弹出层 -->
    <el-dialog
      :title="isEdit ? '编辑部门' : '新增部门'"
      :visible.sync="isAddShow"
      width="50%"
      @click.native.stop
      @close="addClose"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="addForm.name"
            placeholder="1-50个字符"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="addForm.code"
            placeholder="1-50个字符"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            v-model="addForm.manager"
            placeholder="请选择负责人"
            filterable
          >
            <el-option
              v-for="item in managerOptions"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="addForm.introduce"
            type="textarea"
            :rows="2"
            placeholder="1-300个字符"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isaddShow = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { delDepart, addDepartment, getDepartment, editDepartment } from '@/api/department'
import { getUserList } from '@/api/user'
export default {
  filters: {},
  components: {},
  props: {
    node: {
      type: [Object],
      required: true
    }
  },
  data () {
    const validateName = async (rule, value, callback) => {
      const res = await getDepartment()
      if (this.isEdit) {
        const pid = this.node.data.pid
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      } else {
        const id = this.node.data ? this.node.data.id : ''
        res.depts.filter(item => item.pid === id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      }
    }
    const validateCode = async (rule, value, callback) => {
      const res = await getDepartment()
      if (this.isEdit) {
        const pid = this.node.data.pid
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.code === value) ? callback(new Error('部门编码重复')) : callback()
      } else {
        const id = this.node.data ? this.node.data.id : ''
        res.depts.filter(item => item.pid === id).some(item => item.code === value) ? callback(new Error('部门编码重复')) : callback()
      }
    }
    return {
      isAddShow: false,
      addForm: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      managerOptions: [],
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'change' }
        ],
        code: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { validator: validateCode, trigger: 'change' }

        ],
        introduce: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      isEdit: true
    }
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    async onCommand (key) {
      if (this.managerOptions.length === 0) {
        this.getUserList()
      }
      if (key === 'add') {
        this.isEdit = false
        this.isAddShow = true
      } else if (key === 'edit') {
        this.isEdit = true
        this.isAddShow = true
        this.addForm = { ...this.node.data }
      } else {
        // 删除部门
        try {
          await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await delDepart(this.node.data.id)
          this.$notify({
            message: '删除成功',
            duration: 1000,
            type: 'success'
          })
          this.$emit('change-event')
        } catch (error) {
          // 点击取消
          console.log(error)
          this.$notify({
            message: '取消了删除',
            duration: 1000
          })
        }
      }
    },
    // 获取用户列表
    async getUserList () {
      const res = await getUserList()
      // console.log(res)
      this.managerOptions = res
    },
    addClose () {
      this.$refs.addForm.resetFields()
    },
    // 表单确认
    async addConfirm () {
      this.isAddShow = false
      if (this.isEdit) {
        // 编辑部门
        await editDepartment({ ...this.addForm })
        this.$message.success('编辑成功')
      } else {
        // 添加部门
        await addDepartment({
          ...this.addForm, pid: this.node.data ? this.node.data.id : ''
        })
        // console.log(res)
        this.$message.success('添加成功')
      }
      this.$emit('change-event')
    }
  }
}
</script>

<style scoped lang='scss'>
.spanWidth {
  display: inline-block;
  width: 100px;
  text-align: center;
}
</style>
