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
                 @click.stop="userShow"
                 style="margin-left: 610px;"
                 class="el-button-add">添加科目</el-button>
    </div>
    <!-- 表格 -->
    <el-table ref="singleTable"
              :data="tableData"
              highlight-current-row
              style="width: 100%;">
      <el-table-column type="index"
                       width="80">
      </el-table-column>
      <el-table-column property="subject_name"
                       label="科目"
                       width="220">
      </el-table-column>
      <el-table-column label="科目二维码"
                       width="220">
        <template slot-scope="scope">
          <el-image :src="$store.state.BaseImgsUrl+scope.row.code"
                    alt="加载中"
                    :preview-src-list="[$store.state.BaseImgsUrl+scope.row.code]"
                    style="width: 65px;height: 65px">
          </el-image>
        </template>
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
                     @click="rolesShowClick(scope)"></el-button>
          <el-button type="primary"
                     size="mini"
                     plain
                     icon="el-icon-delete"
                     @click="deleteUser(scope)"></el-button>

          <div> <a href="http://www.baidu.com/img/baidu_jgylogo3.gif"
               download /> </div>
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
    <el-dialog title="添加用户"
               :visible.sync="addUserShow">
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

    <!-- <el-upload class="avatar-uploader"
               action="http://127.0.0.1:81/xgexam/public/index.php/api/v1/fileupload"
               name="pic"
               :show-file-list="false"
               :auto-upload="true"
               :on-success="handleAvatarSuccess">
      <img v-if="imageUrl"
           :src="imageUrl"
           class="avatar">
      <i v-else
         class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload> -->
    <!-- <el-upload class="upload-demo"
               action="http://127.0.0.1:81/xgexam/public/index.php/api/v1/fileupload"
               name="pic"
               :limit="1"
               :on-success="handleAvatarSuccess"
               :file-list="fileList">
      <el-button size="small"
                 type="primary">点击上传</el-button>
      <div slot="tip"
           class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload> -->
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

    // this.$myHttp({
    //   url: 'http://121.36.6.20/test2/public/index.php/get_all_subject',
    //   // data: { token: window.localStorage.getItem('token') },
    //   method: 'post',
    //   headers: {
    //     'Authorization': window.localStorage.getItem('token')
    //   }
    // }).then(res => {
    //   if (res.status === 200) {
    //     this.tableData = res.data
    //     console.log(res.data)
    //   }
    // })
    // 调用引入的js
    // console.log(MD5('abc'))
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
      addUserShow: false,

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
        url = `page_subject?page=${this.page}&pagesize=${this.sizePage}`
      } else {
        url = `page_subject?page=${this.page}&pagesize=${this.sizePage}&query=${query}`
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
      this.addUserShow = true
    },
    // 添加科目  add
    addUserPost (ruleForm) {
      this.$refs[ruleForm].validate((res) => {
        if (res) {
          this.$myHttp({
            url: 'insert_subject',
            method: 'post',
            // userAddData 就是表单的数据
            data: this.userAddData,
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
                this.addUserShow = false
                this.userAddData = {}
                // 重新获取数据
                this.getUserList()
              }
            })
        }
      })
    },
    msgStateChange (scope) {
      var index = scope.$index
      console.log(scope.row)
      this.$myHttp({
        url: 'update_status',
        method: 'post',
        data: { subject_id: scope.row.subject_id }
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
          url: 'delete_subject',
          method: 'delete',
          data: { subject_id: scope.row.subject_id }
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
    rolesShowClick (scope) {
      this.$myHttp({
        url: 'http://121.36.6.20/test2/public/qrcode/15896183048884162.png',
        method: 'get'
      }).then(res => {
        console.log(res)
      })
      // let url = 'http://121.36.6.20/test2/public/qrcode/'
      // let name = '15896183048884162' + '.png'
      // console.log(url + name)
      // this.downloadIamge(url + name, 'pic')
    },
    downloadIamge (imgsrc, name) { // 下载图片地址和图片名
      let image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        let canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        let context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        let url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
        let a = document.createElement('a') // 生成一个a元素
        let event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        console.log(a)
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = imgsrc
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
.el-pager li{
 margin-left:20px;
 }
 .el-pager{
   margin-right:20px;
 }
 .el-{
   margin-left:300px;
 }
</style>
