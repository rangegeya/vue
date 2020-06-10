<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索添加 -->
    <div style="margin-top: 10px;margin-bottom: 10px;">
      <el-input placeholder="请输入内容"
                v-model='searchData'
                class="input-with-select ipt">
        <el-button slot="append"
                   icon="el-icon-search"
                   @click.stop="searchGet"></el-button>
      </el-input>
      <el-button type="primary"
                 @click.stop="addExams"
                 style="margin-left:610px;">添加试卷</el-button>
    </div>
    <!-- 表格 -->
    <el-table ref="singleTable"
              :data="tableData"
              highlight-current-row
              style="width: 100%">
      <el-table-column type="index"
                       width="80">
      </el-table-column>
      <el-table-column property="exam_subject"
                       label="科目"
                       width="220">
      </el-table-column>
      <el-table-column property="exam_name"
                       label="试卷名称"
                       width="220">
      </el-table-column>
      <el-table-column property=""
                       label="状态"
                       width="220">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status"
                     @change="msgStateChange(scope)"
                     active-color="#13ce66"
                     inactive-color="#ff4949">
          </el-switch>
        </template>

      </el-table-column>
      <el-table-column property=""
                       label="操作"
                       width="220">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="mini"
                     plain
                     icon="el-icon-edit"
                     @click="editUserisShow(scope)"></el-button>
          <el-button type="primary"
                     size="mini"
                     plain
                     icon="el-icon-check"
                     @click="showDetials(scope)"></el-button>
          <el-button type="primary"
                     size="mini"
                     plain
                     icon="el-icon-delete"
                     @click="deleteUser(scope)"></el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分ye -->
    <!--     :page-sizes="[5,10, 15, 20]" 每页更换显示条数时 触发 @size-change="sizeChange"   他会自动传递参数，所以不传递了，直接接受就行-->
    <el-pagination @size-change="sizeChange"
                   :page-sizes="[5,10, 15, 20]"
                   @current-change="pageChange"
                   :page-size="10"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total"
                   style="margin-top: 10px;margin-bottom: 10px;">
    </el-pagination>

    <!-- 添加试卷弹窗 -->
    <!-- visible控制窗口的显示与隐藏 -->
    <el-dialog title="添加用户"
               :visible.sync="addExamShow">
      <el-form :model="userAddData"
               :rules='rules'
               ref="ruleForm">
        <!-- 双向数据绑定，操作表单数据 -->
        <el-form-item label="科目名字"
                      label-width="200px"
                      prop="subject_name">
          <el-input v-model="userAddData.subject_name"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <!-- 关闭窗口 -->
        <el-button @click="addUserShow = false">取 消</el-button>
        <!-- 把数据入库 -->
        <el-button type="primary"
                   @click.stop="addUserPost('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户弹窗 -->
    <el-dialog title="修改用户"
               :visible.sync="editUserShow">
      <el-form :model="userEditData"
               :rules='rules'
               ref="ruleForm">
        <!-- 双向数据绑定，操作表单数据 -->
        <el-form-item label="科目名字"
                      label-width="200px"
                      prop="subject_name">
          <el-input v-model="userEditData.subject_name"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <!-- 关闭窗口 -->
        <el-button @click="editquxiao">取 消</el-button>
        <!-- 把数据入库 -->
        <el-button type="primary"
                   @click.stop="EditUserPost('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户角色弹窗 -->
    <el-dialog title="修改用户"
               :visible.sync="rolesShow">
      <el-form :model="userEditData"
               :rules='rules'
               ref="ruleForm">
        <!-- 双向数据绑定，操作表单数据 -->
        <el-form-item label="科目名字"
                      label-width="200px"
                      prop="subject_name">
          <span></span>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <!-- 关闭窗口 -->
        <el-button @click="editquxiao">取 消</el-button>
        <!-- 把数据入库 -->
        <el-button type="primary"
                   @click.stop="EditUserPost('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
// import MD5 from '../../assets/js/test.js'
export default {
  //  headers: {
  //       'Authorization': window.localStorage.getItem('token')
  //     }
  mounted () {
    this.getUserList()
  },
  data () {
    return {
      // 表单数据
      userAddData: {
        subject_name: ''
      },
      // 总条数
      total: 0,
      // 每页显示条数
      sizePage: 10,
      // 第几页
      page: 1,
      // 控制角色窗口展示
      rolesShow: false,
      // 显示弹窗修改
      editUserShow: false,
      userEditData: {
        subject_name: ''
      },
      // 显示弹窗添加
      addExamShow: false,

      // 搜索数据
      searchData: '',
      // 显示数据
      tableData: [],
      rules: {
        subject_name: [
          { required: true, message: '请输入科目名', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 每页显示条数
    sizeChange (size) {
      this.sizePage = size
      this.getUserList()
    },
    // 改变页数2
    pageChange (page) {
      this.page = page
      this.getUserList()
    },
    // 获取数据
    getUserList (query = '') {
      var url = ''
      if (query === '') {
        url = `show_exam?page=${this.page}&pagesize=${this.sizePage}`
      } else {
        url = `show_exam?page=${this.page}&pagesize=${this.sizePage}&query=${query}`
      }
      this.$myHttp({
        url,
        method: 'get',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.data
          this.total = res.data.total
          console.log(res.data)
        }
      }).catch((data) => {
        console.log(data)
        this.$message.error('token错误')
        this.$router.push({ name: 'Login' })
      })
    },
    // 搜索 search
    searchGet () {
      this.getUserList(this.searchData)
    },
    // 显示添加面板  show
    userShow () {
      // this.addUserShow = true
    },
    // 添加试卷
    addExams () {
      // this.addExamShow = true
    },
    // 添加科目  add
    addUserPost (ruleForm) {
      // this.$refs[ruleForm].validate((res) => {
      //   if (res) {
      //     this.$myHttp({
      //       url: 'insert_subject',
      //       method: 'post',
      //       // userAddData 就是表单的数据
      //       data: this.userAddData,
      //       headers: {
      //         'Authorization': window.localStorage.getItem('token')
      //       }
      //     })
      //       .then(res => {
      //         if (res.status === 200) {
      //           // 提示成功
      //           this.$message({
      //             message: '添加成功',
      //             type: 'success'
      //           })
      //           // 关闭弹窗
      //           this.addUserShow = false
      //           this.userAddData = ''
      //           // 重新获取数据
      //           this.getUserList()
      //         }
      //       })
      //   }
      // })
    },
    msgStateChange (scope) {
      var index = scope.$index
      console.log(scope.row)
      this.$myHttp({
        url: 'update_exam_status?exam_id=' + scope.row.exam_id,
        method: 'get'
      }).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '修改状态成功',
            type: 'success'
          })
        } else {
          this.tableData[index].status = !scope.row.status
          this.$message.error('状态修改失败')
        }
      })
    },
    deleteUser (scope) {
      this.$confirm('此操作将永久删除该科目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定
        this.$myHttp({
          url: 'delete_exam',
          method: 'post',
          data: { exam_id: scope.row.exam_id }
        }).then(res => {
          console.log(res)
          if (res.status === 200) {
            this.$message({
              message: '刪除成功',
              type: 'success'
            })
            this.getUserList()
          }
        })
      }).catch(() => {
        // 点击取消
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 控制修改用户的窗口显示
    editUserisShow (scope) {
      // 显示弹出
      this.editUserShow = true
      // 传入数据
      this.userEditData = scope.row
      // console.log(scope.row)
    },
    // 修改用户
    EditUserPost () {
      let id = this.userEditData.subject_id
      let name = this.userEditData.subject_name
      console.log(id)
      console.log(name)
      this.$myHttp({
        url: 'update_subject',
        method: 'post',
        data: { subject_id: name }
      }).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message.error('修改失敗')
        }
        this.editUserShow = false
        this.getUserList()
      })
    },
    // 取消修改
    editquxiao () {
      this.editUserShow = false
      // 因为数据使用双向数据绑定所以要是修改的话，要重新获取
      this.getUserList()
    },
    showDetials (scope) {
      this.$router.push({ name: 'ExamDetial', params: { id: scope.row.exam_id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.el-main {
  line-height: 30px;
  text-align: left;
}
.ipt {
  width: 30%;
}
</style>
