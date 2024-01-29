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
          <div class="specialLabel">
            <div>区段长度</div>
            <el-input-number
              v-model="formInline.sectionLength"
              placeholder="请输入"
              clearable
              class="form_input"
            />
            <div>公里</div>
          </div>
        </el-form-item>
        <el-form-item label="数据等级">
          <el-select v-model="formInline.dengji" multiple placeholder="Select" style="width: 240px">
            <el-option v-for="item in options" :key="item" :label="item" :value="item" />
          </el-select>
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
        <el-table-column prop="startLiCheng" label="开始里程" />
        <el-table-column prop="endLiCheng" label="结束里程" />
        <el-table-column prop="oneLevelCount" label="一级数量" />
        <el-table-column prop="twoLevelCount" label="二级数量" />
        <el-table-column prop="threeLevelCount" label="三级数量" />
        <el-table-column prop="fourLevelCount" label="四级数量" />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Disease'
})
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import { doPostDenseList } from '@renderer/api/dense'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const formInline = reactive({
  daterange: null,
  sectionLength: 2,
  dengji: [1, 2, 3],
  startDate: '',
  endDate: ''
})
const options = ref([1, 2, 3, 4])
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
  formInline.sectionLength = 2
  formInline.dengji = [1, 2, 3]
  formInline.startDate = ''
  formInline.endDate = ''
}
//查询
const onSearch = (): void => {
  if (formInline.sectionLength && formInline.dengji.length > 0) {
    getTableData()
  } else {
    ElMessage.error('请填写查询条件！')
    return
  }
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
    const res = await doPostDenseList(formData)
    if (res.code === '200') {
      tableData.value = res.data
    } else {
      ElMessage.error(res.message)
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
