<template>
  <div class="body">
    <!-- 步骤条 -->
    <el-steps :active="active"
              finish-status="success"
              style="width: auto;">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
    </el-steps>
    <!-- 第一个界面 -->
    <div v-if="active===0"
         class="content">
      <el-form :model="examData01"
               :rules='rules'
               ref="registerForm">
        <!-- 双向数据绑定，操作表单数据 -->
        <el-form-item label="试卷标题"
                      label-width="100px"
                      prop="examName"
                      style="margin-left:-20px;">
          <el-input v-model="examData01.examName"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="科目"
                      label-width="100px"
                      style="margin-left:-47px;"
                      prop="subject">
          <el-select v-model="examData01.subject"
                     style="margin-left:30px;width: 120px;"
                     placeholder="请选择"
                     @change="getPoints">
            <el-option v-for="item in display.subject_name"
                       :key="item.subject_id"
                       :label="item.subject_name"
                       :value="item.subject_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模式选择"
                      prop="resource">
          <el-radio-group v-model="examData01.resource"
                          @change='addAttr'>
            <el-radio label="1">练习</el-radio>
            <el-radio label="2">测试</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间(min)"
                      v-if="addTime"
                      label-width="100px"
                      prop="time"
                      style="margin-left:-14px;">

          <template>
            <el-time-select v-model="examData01.time"
                            :picker-options="{start: '00:10',step: '00:05',end: '3:00'}"
                            placeholder="选择时间">
            </el-time-select>
          </template>
        </el-form-item>
        <el-form-item label="选择日期"
                      v-if="addTime"
                      style="margin-left:-28px;"
                      label-width="100px"
                      prop="start">
          <el-date-picker v-model="examData01.start"
                          value-format="timestamp"
                          type="datetimerange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['12:00:00']">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <!-- 第二个界面 -->
    <div v-if="active===1">
      <el-table :data="display.subject_points"
                highlight-current-row>
        <el-table-column property="knowledge"
                         label="题目"
                         width="520"
                         style="margin-left:100px;">
        </el-table-column>
        <el-table-column label="操作"
                         width="520">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       plain
                       icon="el-icon-edit"
                       @click="selectionQuestions(scope)"></el-button>
            <el-button type="primary"
                       size="mini"
                       plain
                       icon="el-icon-check"
                       @click="selectedQuestionsShowClick(scope)"></el-button>
            <el-button type="primary"
                       size="mini"
                       plain
                       icon="el-icon-delete"
                       @click="deleteQuestions(scope)"></el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="qesData.count "
                         property="count"
                         label="已选个数"
                         width="650">
        </el-table-column>
      </el-table>
    </div>
    <!-- 按钮 -->

    <div v-if="active!==0"
         style="margin:30px 30px;">
      <el-button v-if="active!==0"
                 @click="prev"
                 style=" margin-right:800px">上一步</el-button>
      <el-button @click="submitExam">提交</el-button>
    </div>
    <div v-if="active!==1">
      <el-button @click="next('registerForm')">下一步</el-button>
    </div>
    <!-- 选择试题列表 -->
    <el-dialog title="选择试题"
               :visible.sync="pointsQuestionsShow">
      <el-table :data="pointsQuestions"
                :row-key="getRowKeys"
                ref="multipleTable"
                highlight-current-row
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         :reserve-selection="true"
                         width="55">
        </el-table-column>
        <el-table-column property="id"
                         label="题号"
                         width="150">
        </el-table-column>
        <el-table-column property="content"
                         label="题目"
                         width="400">
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChange"
                     :page-sizes="[5,10, 15, 20]"
                     @current-change="pageChange"
                     :page-size="10"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-dialog>

    <!-- 查看知识点选择的试题 -->

    <el-dialog title="已选试题"
               :visible.sync="selectedVisible">
      <el-table :data="display.questionsLists">
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column property=""
                         width="640">
          <template slot-scope="props">
            <!-- <div>
              <div>
                {{scope.$index}}
                {{scope.row.content}}
              </div>
              <div>
                <span>{{scope.row.A}}</span>
                <span>{{scope.row.B}}</span>
                <span>{{scope.row.C}}</span>
                <span>{{scope.row.D}}</span>
              </div>
              <div>
                {{scope.row.answer}}
                类型: {{scope.row.type_id|leixing}}
              </div>
            </div> -->
            <div v-if="props.row.type_id === 1 || props.row.type_id === 2">
              <el-form label-position="left"
                       inline
                       class="demo-table-expand">
                <el-form-item label="科目名称">
                  <span>{{ props.row.subject }}</span>
                </el-form-item>
                <el-form-item label="知识点名称">
                  <span>{{ props.row.knowledge }}</span>
                </el-form-item>
                <el-form-item label="类型">
                  <span>{{ props.row.type_id |leixing}}</span>
                </el-form-item>
                <el-form-item label="题目">
                  <span>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item label="A选项">
                  <span>{{ props.row.A }}</span>
                </el-form-item>
                <el-form-item label="B选项">
                  <span>{{ props.row.B }}</span>
                </el-form-item>
                <el-form-item label="C选项">
                  <span>{{ props.row.C }}</span>
                </el-form-item>
                <el-form-item label="D选项">
                  <span>{{ props.row.D }}</span>
                </el-form-item>
                <el-form-item label="答案">
                  <span>{{ props.row.answer }}</span>
                </el-form-item>
              </el-form>
            </div>
            <div v-if="props.row.type_id === 3">
              <el-form label-position="left"
                       inline
                       class="demo-table-expand">
                <el-form-item label="科目名称">
                  <span>{{ props.row.subject }}</span>
                </el-form-item>
                <el-form-item label="知识点名称">
                  <span>{{ props.row.knowledge }}</span>
                </el-form-item>
                <el-form-item label="类型">
                  <span>{{ props.row.type_id |leixing}}</span>
                </el-form-item>
                <el-form-item label="题目">
                  <span>{{ props.row.content }}</span>
                </el-form-item>
                <el-form-item label="选项一">
                  <span>{{ props.row.A }}</span>
                </el-form-item>
                <el-form-item label="选项二">
                  <span>{{ props.row.B }}</span>
                </el-form-item>
                <el-form-item label="答案">
                  <span>{{ props.row.answer }}</span>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>

  </div>
</template>
<script>
// import { selectAPI } from '../../api/index'
export default {
  mounted () {
    this.select()
  },
  data () {
    return {
      active: 0,
      addTime: false,
      // 選擇的科目 id
      points: '',
      // 展示列表數據部分
      display: {
        subject_name: [],
        subject_points: [],
        questionsLists: []
      },
      // 知识dian list
      examData01: {
        examName: '',
        subject: '',
        resource: ''
      },
      // 選擇的數據
      qesData: {
        questions: [],
        count: 0
      },
      // 列表内容 试题
      pointsQuestions: [],
      pointsQuestionsShow: false,
      // 总条数
      total: 0,
      // 每页显示条数
      sizePage: 10,
      // 第几页
      page: 1,
      // 多选删 除
      multipleSelection: [],
      scopeIndex: 0,
      scopeId: 0,
      row: [],
      // 已经选择试题查看弹窗
      selectedVisible: false,
      getRowKeys (row) {
        // console.log(row)
        // console.log('row')
        return row.id
      },
      rules: {
        examName: [
          { required: true, message: '请输入试卷名', trigger: 'blur' }
        ],
        subject: [
          { required: true, message: '请选择科目名', trigger: 'blur' }
        ],
        resource: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ]
      }
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
  },
  methods: {

    // 对比数组
    getArrDifference (arr1, arr2) {
      return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
    },
    // 每页显示条数
    sizeChange (size) {
      this.sizePage = size
      this.getLists()
    },
    // 改变页数
    pageChange (page) {
      this.page = page
      this.getLists()
    },
    // 上一页
    prev () {
      this.active--
    },
    // 下一页
    next (ruleForm) {
      this.$refs[ruleForm].validate((res) => {
        if (res) {
          this.active++
          this.$myHttp({
            url: 'knowledge?subject_id=' + this.points,
            method: 'get',
            headers: {
              'Authorization': window.localStorage.getItem('token')
            }
          }).then(res => {
            console.log(res.data)
            if (res.status === 200) {
              this.display.subject_points = res.data
              for (let i = 0; i < res.data.length; i++) {
                this.qesData.questions.push({ arr: [], arrSelected: [], status: false, count: 0 })
              }
            } else {
              this.$message.error('获取科目错误')
            }
          })
        } else {
          this.$message({
            message: '请按要求填写',
            type: 'warning'
          })
        }
      })
    },
    // 查询数据
    getLists () {
      this.$myHttp({
        url: `know_qus?knowid=${this.scopeId}&page=${this.page}&pagesize=${this.sizePage}`,
        method: 'get',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res.data)
        if (res.status === 200) {
          this.pointsQuestions = res.data.data
          this.total = res.data.total
          for (let i = 0; i < res.data.data.length; i++) {
            console.log(i)
            console.log(this.qesData.questions[this.scopeIndex].arr.indexOf(res.data.data[i].id))
            if (this.qesData.questions[this.scopeIndex].arr.indexOf(res.data.data[i].id) < 0) {
              console.log(this.qesData.questions[this.scopeIndex].arr.push(res.data.data[i].id))
            }
          }
          console.log(this.qesData.questions[this.scopeIndex])
        } else {
          this.$message.error('获取试题错误')
        }
      })
    },
    // 查询科目
    select () {
      this.$myHttp({
        url: 'get_all_subject',
        method: 'post',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res.data)
        if (res.status === 200) {
          this.display.subject_name = res.data
        } else {
          this.$message.error('获取科目错误')
        }
      }).catch(res => {
        this.$message.error('token错误')
        this.$router.push({ name: 'Login' })
      })
    },
    getPoints (val) {
      this.points = val
    },
    submitExam () {
      let count = this.qesData.count
      if (count < 1) {
        this.$message({
          message: '你还未选择试题，请先去选择试题',
          type: 'warning'
        })
        return
      }
      let id = this.examData01.subject
      let subject = this.display.subject_name.filter((v) => {
        if (v.subject_id === id) {
          return v
        }
      })
      subject = subject[0].subject_name
      let type = this.examData01.resource
      let show = 1
      let val = ''
      if (Number(type) === 1) {
        type = '练习'
      } else if (Number(type) === 2) {
        type = '测试'
        show = 2
      }

      if (show === 1) {
        val = `确定是否提交试卷:<br/>
        &emsp; 试卷科目 : ${subject}<br/>
        &emsp; 试卷题数 : ${count} <br/>
        &emsp; 试卷类型 : ${type}`
      } else if (show === 2) {
        let time = this.examData01.time
        val = `确定是否提交试卷:<br/>
        &emsp; 试卷科目 : ${subject}<br/>
        &emsp; 试卷题数 : ${count} <br/>
        &emsp; 试卷类型 : ${type}<br/>
        &emsp; 考试时间 : ${time}min`
      }
      this.open(val)
    },
    open (val) {
      this.$confirm(val, '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let Data = []
        Data.exam_name = this.examData01.examName
        Data.subject_id = this.examData01.subject
        Data.type = this.examData01.resource
        Data.question_id = this.multipleSelection.map(item => item.id).join()
        console.log(Data.question_id)
        if (Number(this.examData01.resource) === 2) {
          // Data.date = this.examData01.time
          Data.start = this.examData01.start[0]
          Data.date = this.examData01.start[1]
        }
        this.$myHttp({
          url: 'insert_exam',
          method: 'post',
          data: Data,
          headers: {
            'Authorization': window.localStorage.getItem('token')
          }
        }).then(res => {
          this.$message({
            type: 'success',
            message: '添加试卷成功!'
          })

          // 跳转到界面是显示列表
        }).catch(res => {
          this.$message.error('token错误')
          this.$router.push({ name: 'Login' })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 变更属性的方法
    addAttr (val) {
      console.log(val)
      if (Number(val) === 2) {
        this.$set(this.examData01, 'time', '')
        this.$set(this.examData01, 'start', '')
        this.addTime = true
        this.rules = {
          examName: [
            { required: true, message: '请输入试卷名', trigger: 'blur' }
          ],
          subject: [
            { required: true, message: '请选择科目名', trigger: 'blur' }
          ],
          resource: [
            { required: true, message: '请选择类型', trigger: 'blur' }
          ],
          time: [
            { required: true, message: '请输入考试时间(min)', trigger: 'blur' }
          ],
          start: [
            { required: true, message: '请输入考试时间范围', trigger: 'blur' }
          ]
        }
      } else {
        console.log('else')
        console.log(this.examData01.time)
        if (this.examData01.time !== undefined) {
          this.$delete(this.examData01, 'time')
          this.$delete(this.examData01, 'start')
        }
        this.addTime = false
        this.rules = {
          examName: [
            { required: true, message: '请输入试卷名', trigger: 'blur' }
          ],
          subject: [
            { required: true, message: '请选择科目名', trigger: 'blur' }
          ],
          resource: [
            { required: true, message: '请选择类型', trigger: 'blur' }
          ]
        }
      }
    },
    // 根据知识点查询试题
    selectionQuestions (scope) {
      this.scopeIndex = scope.$index
      this.scopeId = scope.row.id
      console.log(scope.$index)
      console.log(scope.row.id)
      this.$myHttp({
        url: `know_qus?knowid=${scope.row.id}&page=${this.page}&pagesize=${this.sizePage}`,
        method: 'get',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      }).then(res => {
        if (res.status === 200) {
          this.pointsQuestions = res.data.data
          this.pointsQuestionsShow = true
          this.total = res.data.total
          console.log(res.data)
          console.log(res.data.data.length)
          console.log('res.data.data.length')
          for (let i = 0; i < res.data.data.length; i++) {
            console.log(i)
            console.log(this.qesData.questions[scope.$index].arr.indexOf(res.data.data[i].id))
            if (this.qesData.questions[scope.$index].arr.indexOf(res.data.data[i].id) < 0) {
              console.log(this.qesData.questions[scope.$index].arr.push(res.data.data[i].id))
            }
            // else {
            //   this.qesData.questions[scope.$index].arr.push(res.data.data[i].id)
            //   console.log(this.qesData.questions[scope.$index].arr.push(res.data.data[i].id))
            // }
          }
          console.log(this.qesData.questions[scope.$index])
        } else {
          this.$message.error('获取试题错误')
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      let arrSelect = this.multipleSelection.map(item => item.id)
      let arr2 = this.qesData.questions[this.scopeIndex].arr
      console.log(arrSelect, arr2)
      let res = this.getArrEqual(arrSelect, arr2)
      let count = res.length
      this.$set(this.display.subject_points[this.scopeIndex], 'count', count)
      this.qesData.questions[this.scopeIndex].count = count
      this.qesData.questions[this.scopeIndex].arrSelected = res
      console.log(res)
      console.log(this.qesData.questions.length)
      let sum = 0
      for (let i = 0; i < this.qesData.questions.length; i++) {
        sum = sum + this.qesData.questions[i].count

        console.log(sum)
        console.log('this.qesData.questions[i].count')
        console.log(this.qesData.questions[i].count)
      }
      this.qesData.count = sum
      console.log(this.qesData.count)
    },
    // 取出两个数组的相同元素
    getArrEqual (arr1, arr2) {
      let newArr = []
      for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
          if (arr1[j] === arr2[i]) {
            newArr.push(arr1[j])
          }
        }
      }
      return newArr
    },
    selectedQuestionsShowClick (scope) {
      console.log(scope.$index)
      console.log(this.qesData.questions[scope.$index].arrSelected)
      if (this.qesData.questions[scope.$index].arrSelected[0]) {
        this.selectedVisible = true
        let arr = this.qesData.questions[scope.$index].arrSelected
        let ids = arr.join()
        console.log(ids)
        this.$myHttp({
          url: 'id_topic?id=' + ids,
          method: 'get',
          headers: {
            'Authorization': window.localStorage.getItem('token')
          }
        }).then(res => {
          console.log(res.data)
          if (res.status === 200) {
            this.display.questionsLists = res.data
          } else {
            this.$message.error('获取试题错误')
          }
        })
      } else {
        this.$message({
          message: '选择试题后方可预览选中的题',
          type: 'warning'
        })
      }
    },
    async batchDelete () {
      // // console.log(this.multipleSelection)
      // var ids = this.multipleSelection.map(item => item.id).join()
      // // console.log(ids)
      // this.$confirm('此操作将永久删除该知识点, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   // 点击确定
      //   this.$myHttp({
      //     url: 'delete_topic',
      //     method: 'post',
      //     data: { id: ids }
      //   }).then(res => {
      //     // console.log(res)
      //     if (res.status === 200) {
      //       this.$message({
      //         message: '刪除成功',
      //         type: 'success'
      //       })
      //       this.getUserList()
      //     }
      //   })
      // }).catch(() => {
      //   // 点击取消
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
    }

  }
  // watch: {
  //   qesData: {
  //     handler (newValue, oldValue) {
  //       console.log(newValue)
  //       let sum = 0
  //       for (let i; i < newValue.questions.length; i++) {
  //         sum = sum + newValue.questions[i].count
  //         console.log(sum)
  //       }
  //       this.qesData.count = sum
  //       console.log(sum)
  //       console.log(sum)
  //     },
  //     deep: true
  //   }
  // }
}
</script>

<style >
.body {
  display: table-cell;
  vertical-align: center;
  width: 900px;
}
.content {
  display: table-cell;
  vertical-align: center;
}
</style>
