<template>
  <div>
    <div class="top">
      <el-form :inline="true" :model="formInline" label-position="right">
        <el-row>
          <el-col :span="8">
            <el-form-item label="时间区间" style="font-weight: bold">
              <el-date-picker
                v-model="formInline.daterange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD"
                @change="handleDateChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="重复时间">
              <el-input v-model="formInline.repeatTimes" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="重复次数">
              <el-input v-model="formInline.repetitions" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="里程偏差">
              <el-input v-model="formInline.mileageDeviation" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button type="primary" @click="onSubmit">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="bottom">
      <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="重复病害数量统计" name="first">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="Date" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="address" label="Address" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="重复病害对比" name="second">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="Date1" width="180" />
            <el-table-column prop="name" label="Name1" />
            <el-table-column prop="address" label="Address1" width="180" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="工务段本周与上周对比" name="third">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="Date1" width="180" />
            <el-table-column prop="name" label="Name1" />
            <el-table-column prop="address" label="Address1" width="280" /><el-table-column
              fixed="right"
              label="Operations"
              width="120"
            >
              <template #default>
                <el-button link type="primary" size="small">Detail</el-button>
                <el-button link type="primary" size="small">Edit</el-button>
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >
        <el-tab-pane label="线路本周与上周对比" name="fourth">Task</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Test1'
})
import type { TabsPaneContext } from 'element-plus'
import { reactive, ref } from 'vue'

const formInline = reactive({
  daterange: '',
  repeatTimes: '',
  repetitions: '',
  mileageDeviation: '',
  startDateStr: '',
  endDateStr: ''
})

const onSubmit = () => {
  console.log('submit!')
}

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]
const handleDateChange = (value) => {
  const [startDateStr, endDateStr] = value
  formInline.startDateStr = startDateStr
  formInline.endDateStr = endDateStr
}
const onSearch = () => {
  console.log(formInline, 'formInline')
}
</script>

<style scoped lang="scss"></style>
