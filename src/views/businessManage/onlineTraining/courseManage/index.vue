<template>
  <div class="vlt-card">
    <el-tabs tab-position="left" v-model="active">
      <el-tab-pane label="课程列表" name="1">
        <!-- <course-list></course-list> -->
      </el-tab-pane>
      <el-tab-pane label="标签列表" name="2">
        <course-mark-list></course-mark-list>
      </el-tab-pane>
      <el-tab-pane label="类型列表" name="3">
        <course-type-list></course-type-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
// import CourseList from './courseList'
import CourseMarkList from './courseMarkList'
import CourseTypeList from './courseTypeList'

export default {
  name: "",
  components: {
    // CourseList,
    CourseMarkList,
    CourseTypeList
  },
  data() {
    return {
      active: '1'
    }
  },
  methods: {
  },
}
</script>

<style lang="less" scoped>
</style>
