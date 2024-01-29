<template>
  <div>
    <div class="top">
      <el-form :inline="true" :model="formInline" label-position="right">
        <el-form-item label="时间范围" style="font-weight: bold">
          <el-date-picker
            v-model="formInline.daterange"
            :clearable="false"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button type="primary" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-loading="loading" class="bottom">
      <el-table :data="tableData" style="width: 100%" max-height="calc(100vh - 100px)">
        <el-table-column prop="lineName" label="线名" />
        <el-table-column prop="lineNum" label="线号" />
        <el-table-column prop="xingBie" label="行别" />
        <el-table-column prop="tangCi" label="趟次" />
        <el-table-column prop="oneLevel" label="一级数量" />
        <el-table-column prop="twoLevel" label="二级数量" />
        <el-table-column prop="threeLevel" label="三级数量" />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'HaulageMotor'
})
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import { doPostLineData } from '@renderer/api/siren'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const formInline = reactive({
  daterange: null,
  startDate: '',
  endDate: ''
})
onMounted(() => {
  //初始化时间
  formInline.daterange = initDate.value
  getTableData()
})
//时间修改
const handleDateChange = (value) => {
  const [startDate, endDate] = value
  formInline.startDate = startDate
  formInline.endDate = endDate
}
//给时间区间设置默认值
const initDate = computed(() => {
  const currentDate = dayjs()
  const threeDaysAgo = currentDate.subtract(3, 'day').format('YYYY-MM-DD')
  const formattedDate = currentDate.format('YYYY-MM-DD')
  return [threeDaysAgo, formattedDate]
})
//重置
const onReset = () => {
  formInline.daterange = initDate
  formInline.startDate = ''
  formInline.endDate = ''
}
//查询
const onSearch = (): void => {
  getTableData()
}
const loading = ref(false)
//重点病害处所
const tableData = ref([])
//获取表格数据
const getTableData = async () => {
  try {
    loading.value = true
    // 将响应式对象转换为普通 JavaScript 对象
    const formData = { ...toRaw(formInline) }
    formData.startDate = formInline.daterange[0]
    formData.endDate = formInline.daterange[1]
    delete formData.daterange
    const res = await doPostLineData(formData)
    if (res.code === '200') {
      tableData.value = res?.data || []
    } else {
      ElMessage.error(res?.message)
    }
  } catch (error) {
    console.log('error: ', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.specialLabel {
  display: flex;
  font-weight: bold;
  align-items: flex-start;
  .form_input {
    margin: 0 10px;
    width: 150px;
  }
}

.div_container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  .table_item {
    width: 48%;
    .table_title {
      color: var(--el-text-color-secondary);
      margin-bottom: 3px;
    }
  }
}
</style>
