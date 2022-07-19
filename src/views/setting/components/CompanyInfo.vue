<template>
  <div>
    <el-alert
      title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
      type="info"
      show-icon
      :closable="false"
    />
    <el-form label-width="120px" style="margin-top: 50px">
      <el-form-item label="公司名称">
        <el-input v-model="formData.name" disabled style="width: 400px" />
      </el-form-item>
      <el-form-item label="公司地址">
        <el-input
          v-model="formData.companyAddress"
          disabled
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="formData.mailbox" disabled style="width: 400px" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="formData.remarks"
          type="textarea"
          :rows="3"
          disabled
          style="width: 400px"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCompanyInfo } from '@/api/setting'
export default {
  filters: {},
  components: {},
  data () {
    return {
      formData: {}
    }
  },
  computed: { ...mapGetters(['companyId']) },
  watch: {},
  created () {
    this.getCompanyInfo()
  },
  methods: {
    // 获取的公司的信息
    async getCompanyInfo () {
      this.formData = await getCompanyInfo(this.companyId)
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
