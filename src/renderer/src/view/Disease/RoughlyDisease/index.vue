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
        <el-form-item label="重复次数">
          <el-input-number v-model="formInline.repetitions" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item>
          <div class="specialLabel">
            <div>前后</div>
            <el-input-number
              v-model="formInline.repeatTimes"
              placeholder="请输入"
              clearable
              class="form_input"
            />
            <div>天合并</div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="specialLabel">
            <div>前后</div>
            <el-input-number
              v-model="formInline.mileageDeviation"
              placeholder="请输入"
              clearable
              class="form_input"
            />
            <div>米合并</div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button type="primary" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-loading="loading" class="bottom">
      <el-tabs v-model="activeName" type="card" class="demo-tabs">
        <el-tab-pane label="重点病害处所" name="first">
          <el-table
            :data="filterTableData"
            style="width: 100%"
            max-height="calc(100vh - 150px)"
            @row-click="clickRow"
          >
            <el-table-column prop="gongWuDuan" label="工务段" />
            <el-table-column prop="lineName" label="线名" />
            <el-table-column prop="lineNum" label="线号" />
            <el-table-column prop="xingBie" label="行别" />
            <el-table-column prop="liCheng" label="里程" />
            <el-table-column prop="repeatMergeCounts" label="重复合并次数" />
            <el-table-column prop="repeatCount" label="报警总数量" />
            <el-table-column prop="chuizhiMax" label="垂加最大值" />
            <el-table-column prop="shuipingMax" label="水加最大值" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="同期对比" name="third">
          <div class="div_container">
            <div class="table_item">
              <div class="table_title">线路对比</div>
              <el-table :data="lineTableData" max-height="calc(100vh - 150px)" style="width: 100%">
                <el-table-column prop="lineName" label="线名" width="180" />
                <el-table-column prop="counts" label="本周数量" />
                <el-table-column prop="lastWeekCounts" label="上周数量" />
              </el-table>
            </div>
            <div class="table_item">
              <div class="table_title">工务段对比</div>
              <el-table :data="duanTableData" style="width: 100%">
                <el-table-column prop="gongWuDuan" label="工务段" width="180" />
                <el-table-column prop="counts" label="本周数量" />
                <el-table-column prop="lastWeekCounts" label="上周数量" />
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="重点病害明细" name="four">
          <el-table
            v-loading="loading"
            :data="tableData"
            max-height="calc(100vh - 150px)"
            style="width: 100%"
            @row-click="clickRow"
          >
            <el-table-column prop="gongWuDuan" label="工务段" />
            <el-table-column prop="lineName" label="线名" />
            <el-table-column prop="lineNum" label="线号" />
            <el-table-column prop="xingBie" label="行别" />
            <el-table-column prop="liCheng" label="里程" />
            <el-table-column prop="repeatMergeCounts" label="重复合并次数" />
            <el-table-column prop="repeatCount" label="报警总次数" />
            <el-table-column prop="chuizhiMax" label="垂加最大值" />
            <el-table-column prop="shuipingMax" label="水加最大值" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog v-model="dialogVisible" title="详细数据" width="80%" :before-close="handleClose">
      <el-table
        v-loading="loading"
        element-loading-text="正在请求数据中，请稍后……"
        :data="descTableData"
        style="width: 100%"
        max-height="500px"
      >
        <el-table-column prop="duanName" label="工务段" />
        <el-table-column prop="lineName" label="线名" />
        <el-table-column prop="clinenum" label="线号" />
        <el-table-column prop="ixingBie" label="行别" />

        <el-table-column prop="flicheng" label="里程" />

        <el-table-column prop="ddate" label="日期" width="180">
          <template #default="scope">
            {{ dayjs(scope.row.ddate).format('YYYY-MM-DD hh:mm') }}
          </template>
        </el-table-column>
        <el-table-column prop="fchuizhi" label="垂加" />
        <el-table-column prop="fchuizhilevel" label="垂加等级" />
        <el-table-column prop="fshuiping" label="水加" />
        <el-table-column prop="fshuipinglevel" label="水加等级" />
        <el-table-column prop="fspeed" label="车速" />
        <el-table-column prop="cmodel" label="车型" />
        <el-table-column prop="cnum" label="车号" />
        <el-table-column prop="ccheci" label="车次" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Disease'
})
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import { doPostRepeatLargeValue } from '@renderer/api/Disease'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

interface RepeatInfo {
  gongWuDuan: string
  lineName: string
  lineNum: number
  xingBie: number
  repeatMergeCounts: number
  repeatCount: number
  chuizhiMax: number
  shuipingMax: number
}
const formInline = reactive({
  daterange: null,
  repeatTimes: 7,
  repetitions: 5,
  mileageDeviation: 20,
  startDate: '',
  endDate: ''
})
onMounted(() => {
  //初始化时间
  formInline.daterange = initDate.value
  getTableData()
})
const activeName = ref('first')
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
  formInline.repeatTimes = 5
  formInline.repetitions = 7
  formInline.mileageDeviation = 20
  formInline.startDate = ''
  formInline.endDate = ''
}
//查询
const onSearch = (): void => {
  if (formInline.repeatTimes && formInline.repetitions && formInline.mileageDeviation) {
    getTableData()
  } else {
    ElMessage.error('请填写查询条件！')
    return
  }
}
const loading = ref(false)
const tableData = ref([])
const lineTableData = ref([])
const duanTableData = ref([])
//重点病害处所
const filterTableData = ref([])
//获取表格数据
const getTableData = async () => {
  try {
    loading.value = true
    // 将响应式对象转换为普通 JavaScript 对象
    const formData = { ...toRaw(formInline) }
    formData.startDate = formInline.daterange[0]
    formData.endDate = formInline.daterange[1]
    delete formData.daterange
    const res = await doPostRepeatLargeValue(formData)
    if (res.code === '200') {
      tableData.value = res.data.repeatInfoList
      filterTableData.value = res.data.repeatInfoList.filter((item: RepeatInfo) => {
        return item.repeatCount >= 10
      })
      lineTableData.value = res.data.lineRepeatCounts
      duanTableData.value = res.data.duanRepeatCounts
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    console.log('error: ', error)
  } finally {
    loading.value = false
  }
}
const dialogVisible = ref(false)
const descTableData = ref([])
const handleClose = () => {
  dialogVisible.value = false
}
const clickRow = (row) => {
  const { receiveDataSet } = row
  descTableData.value = receiveDataSet
  dialogVisible.value = true
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
