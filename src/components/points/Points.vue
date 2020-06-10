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
                v-model='search.searchData'
                class="input-with-select ipt">
        <el-button slot="append"
                   icon="el-icon-search"
                   @click.stop="searchGet"></el-button>
      </el-input>
      <el-select v-model="search.searchdroplist"
                 placeholder="请选择"
                 style="margin-right:390px;">
        <el-option v-for="item in searchdropSelectData"
                   :key="item.subject_id"
                   :label="item.subject_name"
                   :value="item.subject_name">
        </el-option>
      </el-select>

      <el-button type="primary"
                 @click.stop="pointsShow">添加知识点</el-button>
    </div>
    <!-- 表格 -->
    <el-table ref="singleTable"
              :data="tableData"
              highlight-current-row
              style="width: 100%">
      <el-table-column type="index"
                       width="80">
      </el-table-column>
      <el-table-column property="id"
                       label="知识点id"
                       width="150">
      </el-table-column>
      <el-table-column property="subject_name"
                       label="科目"
                       width="200">
      </el-table-column>
      <el-table-column property="knowledge"
                       label="知识点名称"
                       width="200">
      </el-table-column>
      <el-table-column property=""
                       label="状态"
                       width="200">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status"
                     @change="modifyStatus(scope)"
                     active-color="#13ce66"
                     inactive-color="#ff4949">
          </el-switch>
        </template>

      </el-table-column>
      <el-table-column property=""
                       label="操作"
                       width="200">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="mini"
                     plain
                     icon="el-icon-edit"
                     @click="modifyShow(scope)"></el-button>
          <el-button type="primary"
                     size="mini"
                     plain
                     icon="el-icon-check"
                     @click="rolesShowClick(scope)"></el-button>
          <el-button type="primary"
                     size="mini"
                     plain
                     icon="el-icon-delete"
                     @click="deletePoints(scope)"></el-button>
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

    <!-- 添加用户弹窗 -->
    <!-- visible控制窗口的显示与隐藏 -->
    <el-dialog title="添加知识点"
               :visible.sync="addPointsShow">
      <el-form :model="pointsAddData"
               :rules='rules'
               ref="registerForm">
        <!-- 双向数据绑定，操作表单数据 -->
        <el-form-item label="科目"
                      label-width="200px"
                      prop="subject_name">
          <el-select v-model="pointsAddData.subject_name"
                     placeholder="请选择">
            <el-option v-for="item in dropSelectData"
                       :key="item.value"
                       :label="item.subject_name"
                       :value="item.subject_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="知识点名字"
                      label-width="200px"
                      prop="subject_points">
          <el-input v-model="pointsAddData.subject_points"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <!-- 关闭窗口 -->
        <el-button @click="addpointsQuit">取 消</el-button>
        <!-- 把数据入库 -->
        <el-button type="primary"
                   @click.stop="addPointsPost('registerForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户弹窗 -->
    <!-- visible控制窗口的显示与隐藏 -->
    <el-dialog title="添加知识点"
               :visible.sync="editPointsShow">
      <el-form :model="pointsEditData"
               :rules='rulesEdit'
               ref="registerFormEdit">
        <!-- 双向数据绑定，操作表单数据 -->
        <el-form-item label="科目"
                      label-width="200px">
          <el-input v-model="pointsEditData.subject_name"
                    disabled
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="知识点名字"
                      label-width="200px"
                      prop="knowledge">
          <el-input v-model="pointsEditData.knowledge"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <!-- 关闭窗口 -->
        <el-button @click="EditpointsQuit">取 消</el-button>
        <!-- 把数据入库 -->
        <el-button type="primary"
                   @click.stop="EditPointsPost('registerFormEdit')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
export default {
  mounted () {
    this.getUserList()
    // 获取科目信息进行搜索
    this.$myHttp({
      url: 'get_all_subject',
      method: 'post',
      headers: {
        'Authorization': window.localStorage.getItem('token')
      }
    }).then(res => {
      console.log(res.data)
      if (res.status === 200) {
        this.searchdropSelectData = res.data
      } else {
        this.$message.error('获取科目错误')
      }
    })
  },
  data () {
    return {

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

      // 搜索数据
      search: {
        searchdroplist: '',
        searchData: ''
      },
      // 选择显示的搜索数据（科目）
      searchdropSelectData: {},
      // 显示数据
      tableData: [],

      // 显示添加弹窗添加
      addPointsShow: false,
      // 添加数据的科目选择
      dropSelectData: '',
      // 添加表单数据
      pointsAddData: {
        // 下啦选择的id
        subject_name: '',
        subject_points: ''
      },
      // 修改面板展示与否
      editPointsShow: false,
      // 修改数据
      pointsEditData: {
        subject_points: ''
      },
      // 验证规则
      rules: {
        subject_name: [
          { required: true, message: '请输入科目名', trigger: 'blur' }
        ],
        subject_points: [
          { required: true, message: '请输入知识点名', trigger: 'blur' }
        ]
      },
      rulesEdit: {
        knowledge: [
          { required: true, message: '请输入知识点名', trigger: 'blur' }
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
    // 改变页数
    pageChange (page) {
      this.page = page
      this.getUserList()
    },
    // 获取数据
    getUserList (search = '') {
      var url = ''
      if (search === '') {
        url = `list_knowledge?page=${this.page}&pagesize=${this.sizePage}`
      } else {
        url = `list_knowledge?&page=${this.page}&pagesize=${this.sizePage}&query=${search.searchdroplist}&search=${search.searchData}`
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
      // console.log(this.search)
      this.getUserList(this.search)
    },
    // 显示添加面板  show
    pointsShow () {
      this.addPointsShow = true
      this.$myHttp({
        url: 'get_all_subject',
        method: 'post',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res.data)
        if (res.status === 200) {
          this.dropSelectData = res.data
        } else {
          this.$message.error('获取科目错误')
        }
      })
    },
    // 取消添加面板
    addpointsQuit () {
      this.addPointsShow = false
      this.pointsAddData = {}
    },
    // 添加科目  add
    addPointsPost (ruleForm) {
      let DATA = {}
      DATA.subject_id = this.pointsAddData.subject_name
      DATA.knowledge = this.pointsAddData.subject_points
      console.log(this.pointsAddData)
      this.$refs[ruleForm].validate((res) => {
        if (res) {
          this.$myHttp({
            url: 'insert_knowledge',
            method: 'post',
            // userAddData 就是表单的数据
            data: DATA,
            headers: {
              'Authorization': window.localStorage.getItem('token')
            }
          })
            .then(res => {
              if (res.status === 200) {
                // 提示成功
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                // 关闭弹窗
                this.addPointsShow = false
                // 清空添加数据
                this.pointsAddData = {}
                // 重新获取数据
                this.getUserList()
              }
            })
        }
      })
    },
    // 删除知识点
    deletePoints (scope) {
      this.$confirm('此操作将永久删除该知识点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定
        this.$myHttp({
          url: 'delete_knowledge',
          method: 'delete',
          data: { id: scope.row.id }
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
    // 修改知识点状态
    modifyStatus (scope) {
      var index = scope.$index
      console.log(scope.row)
      this.$myHttp({
        url: 'update_know_status',
        method: 'post',
        data: { id: scope.row.id }
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
    // 显示修改知识点面板
    modifyShow (scope) {
      this.editPointsShow = true
      this.pointsEditData = scope.row
      console.log(this.pointsEditData)
    },
    // 关闭修改知识点面板
    EditpointsQuit () {
      this.editPointsShow = false
      this.pointsEditData = {}
    },
    // 修改知识点
    EditPointsPost (ruleForm) {
      let Data = {}
      Data.id = this.pointsEditData.id
      Data.knowledge = this.pointsEditData.knowledge
      this.$refs[ruleForm].validate((res) => {
        if (res) {
          this.$myHttp({
            url: 'update_knowledge',
            method: 'post',
            data: Data,
            headers: {
              'Authorization': window.localStorage.getItem('token')
            }
          })
            .then(res => {
              if (res.status === 200) {
                // 提示成功
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                // 关闭弹窗
                this.editPointsShow = false
                // 清空添加数据
                this.pointsEditData = {}
                // 重新获取数据
                this.getUserList()
              }
            }).catch(res => {
              this.$message({
                message: '请修改',
                type: 'warning'
              })
            })
        }
      })
    },
    // 控制修改用户的窗口显示
    editUserisShow (scope) {
      // 显示弹出
      this.editUserShow = true
      // 传入数据
      this.userEditData = scope.row
      // console.log(scope.row)
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
