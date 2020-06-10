<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索添加 -->
    <div style="margin-top: 5px;">
      <el-button type="primary"
                 @click.stop="addExams">添加试卷</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData"
              highlight-current-row
              style="width: 100%">
      <el-table-column type="index"
                       width="50">
      </el-table-column>
      <el-table-column property=""
                       width="640">
        <template slot-scope="scope">
          <div v-if="scope.row.type_id === 1 || scope.row.type_id === 2">
            <div>
              <!-- {{scope.$index}} -->
              {{scope.row.type_id|leixing}} {{scope.$index + 1}} {{scope.row.content}}
            </div>
            <div>
              <span>{{scope.row.A}}</span>
              <span>{{scope.row.B}}</span>
              <span>{{scope.row.C}}</span>
              <span>{{scope.row.D}}</span>
            </div>
            <div>
              {{scope.row.answer}}
            </div>
          </div>

          <div v-if="scope.row.type_id === 3">
            <div>
              <!-- {{scope.$index}} -->
              {{scope.row.type_id|leixing}} {{scope.$index + 1}} {{scope.row.content}}
            </div>
            <div>
              <span>{{scope.row.A}}</span>
              <span>{{scope.row.B}}</span>
            </div>
            <div>
              {{scope.row.answer}}
            </div>
          </div>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>
<script>
export default {
  mounted () {
    let id = this.$route.params.id
    console.log(id)
    if (id === undefined) {
      console.log('a')
      history.back()
    } else {
      this.getUserList(id)
    }

    // this.getUserList()
  },
  data () {
    return {
      // 总条数
      total: 0,
      // 显示数据
      tableData: []
    }
  },
  methods: {
    // 获取数据
    getUserList (id) {
      this.$myHttp({
        url: 'check_exam?exam_id=' + id,
        method: 'get',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      }).then(res => {
        console.log('aaaaaaaa')
        if (res.status === 200) {
          console.log('aaa')
          console.log(res.data)
          // this.tableData = res.data.data
          let a = res.data.data.sort(this.toSort('type_id'))
          console.log(a)
          this.tableData = a
          this.total = res.data.number
          console.log(res.data)
        }
      }).catch((data) => {
        console.log('bbb')
        // console.log(data)
        // this.$message.error('token错误')
        // this.$router.push({ name: 'Login' })
      })
    },
    toSort (propertyName) {
      return function (a, b) {
        return a[propertyName] - b[propertyName] // 升序
        // return b[propertyName] - a[propertyName]    // 降序
      }
    },
    // 添加试卷
    addExams () {

    }
  },
  filters: {
    leixing (val01) {
      let val = Number(val01)
      console.log(val)
      console.log(typeof (val))
      if (val === 1) {
        return '单选'
      } else if (val === 2) {
        return '多选'
      } else if (val === 3) {
        return '判断'
      } else if (val === 4) {
        return '填空'
      } else {
        return '其他'
      }
    }
  }
}
</script>

<style >
</style>
