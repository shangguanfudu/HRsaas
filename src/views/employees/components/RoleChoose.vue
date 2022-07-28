<template>
  <el-dialog title="分配角色" :visible.sync="isRoleShow">
    <!-- 表单 -->
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="obj in roleList" :key="obj.id" :label="obj.id">{{
        obj.name
      }}</el-checkbox>
    </el-checkbox-group>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { roleChoose } from '@/api/employees'
import { getUserDetailById } from '@/api/user'
export default {
  props: {
    isRoleShow: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      roleList: [],
      checkList: []
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList () {
      const res = await getRoleList({ page: 1, pagesize: 5 })
      // console.log(res)
      this.roleList = res.rows
      console.log(this.id)
      const { roleIds } = await getUserDetailById(this.id)
      this.checkList = roleIds
    },
    // 点击确定时
    async btnOK () {
      await roleChoose({ id: this.id, roleIds: this.checkList })
      this.$message.success('分配成功')
      this.$parent.getEmployeeList()
      this.$emit('update:isRoleShow', false)
    },
    btnCancel () {
      // 重置原来的数据
      this.$emit('update:isRoleShow', false)
    }

  }
}
</script>

<style>
</style>
