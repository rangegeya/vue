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
                 @change="searchSubjectChange">
        <el-option v-for="item in searchdropSelectData"
                   :key="item.subject_id"
                   :label="item.subject_name"
                   :value="item.subject_id">
        </el-option>
      </el-select>
      <el-select v-model="search.searchdroplistQuestions"
                 placeholder="请选择">
        <!-- @change="searchKnnowledgeChange" -->
        <el-option v-for="item in searchdropSelectDataQuestions"
                   :key="item.id"
                   :label="item.knowledge"
                   :value="item.id">
        </el-option>
      </el-select>

      <!-- <el-button type="primary"
                 @click.stop="questionsShow">添加试题</el-button> -->
      <el-dropdown @command="handleCommand"
                   style="margin-left: 110px;">
        <el-button type="primary">
          下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="singleDanDuo">单个添加单选/多选试题</el-dropdown-item>
          <el-dropdown-item command="singlePandaun">单个添加判断试题</el-dropdown-item>
          <el-dropdown-item command="multiPanduan"
                            divided>批量导入判断试题</el-dropdown-item>
          <el-dropdown-item command="multiDanDuo"
                            divided>批量导入单选多选试题</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-button type="primary"
                 @click.stop="batchAdd">导入</el-button>
    </div>

    <!-- 表格 -->
    <el-table ref="singleTable"
              :data="tableData"
              highlight-current-row
              style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55">
      </el-table-column>
      <!-- 详细信息 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <div v-if="props.row.type_id === 1 || props.row.type_id === 2">
            <el-form label-position="left"
                     inline
                     class="demo-table-expand">
              <el-form-item label="科目">
                <span>{{ props.row.subject }}</span>
              </el-form-item>
              <el-form-item label="知识点名称">
                <span>{{ props.row.knowledge }}</span>
              </el-form-item>
              <el-form-item label="类型">
                <span>{{ props.row.type_id |leiXing}}</span>
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
                <span>{{ props.row.type_id |leiXing}}</span>
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
      <el-table-column property="content"
                       label="题目"
                       width="400">
      </el-table-column>
      <!-- <el-table-column label="题目">
        <template slot-scope="props">
          <span @click="detialsItem(props)">{{ props.row.content }}</span>
        </template>
      </el-table-column> -->
      <el-table-column property=""
                       label="状态"
                       width="240">
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
                       width="320">
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
                     @click="deleteQuestions(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px;margin-bottom: 10px;">
      <el-button :disabled="this.multipleSelection.length === 0"
                 @click="batchDelete()">批量删除</el-button>
    </div>
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

    <!-- 添加试题弹窗 -->
    <!-- visible控制窗口的显示与隐藏 -->
    <el-dialog title="添加试题"
               :visible.sync="addQuestionsShow">
      <el-form :model="questionAddData"
               :rules='rules'
               ref="registerForm">
        <!-- 双向数据绑定，操作表单数据 -->
        <el-form-item label="科目名字"
                      label-width="200px"
                      prop="subject">
          <el-select v-model="questionAddData.subject"
                     placeholder="请选择"
                     @change="subjectChange">
            <el-option v-for="item in display.subject_name"
                       :key="item.subject_id"
                       :label="item.subject_name"
                       :value="item.subject_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="知识点名字"
                      label-width="200px"
                      prop="knowledge">
          <el-select v-model="questionAddData.knowledge"
                     @change="pointsChange"
                     placeholder="请选择">
            <el-option v-for="item in display.subject_points"
                       :key="item.id"
                       :label="item.knowledge"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="hidden"
                      label="知识点id"
                      label-width="50px"
                      prop="knowid">
          <el-input v-model="questionAddData.knowid"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="试题类型"
                      label-width="200px"
                      prop="type_id">
          <el-input v-model="questionAddData.type_id"
                    placeholder='(1:单选，2：多选，3：判断)'
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目"
                      label-width="200px"
                      prop="content">
          <el-input v-model="questionAddData.content"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="A选项"
                      label-width="200px"
                      prop="A">
          <el-input v-model="questionAddData.A"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="B选项"
                      label-width="200px"
                      prop="B">
          <el-input v-model="questionAddData.B"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="C选项"
                      label-width="200px"
                      prop="C">
          <el-input v-model="questionAddData.C"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="D选项"
                      label-width="200px"
                      prop="D">
          <el-input v-model="questionAddData.D"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="答案"
                      label-width="200px"
                      prop="answer">
          <el-input v-model="questionAddData.answer"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <!-- 关闭窗口 -->
        <el-button @click="addQuestionsQuit">取 消</el-button>
        <!-- 把数据入库 -->
        <el-button type="primary"
                   @click.stop="addQuestionsPost('registerForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加单个试题 判断 -->
    <el-dialog title="添加单判断试题"
               :visible.sync="addQuestionsSingleShow">
      <el-form :model="questionAddSingleData"
               :rules='rulesAddSinglePanduan'
               ref="registerFormSingle">
        <!-- 双向数据绑定，操作表单数据 -->
        <el-form-item label="科目名字"
                      label-width="200px"
                      prop="subject">
          <el-select v-model="questionAddSingleData.subject"
                     placeholder="请选择"
                     @change="SingleSubjectChange">
            <el-option v-for="item in display.single_subject_name"
                       :key="item.subject_id"
                       :label="item.subject_name"
                       :value="item.subject_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="知识点名字"
                      label-width="200px"
                      prop="knowledge">
          <el-select v-model="questionAddSingleData.knowledge"
                     @change="singlePointsChange"
                     placeholder="请选择">
            <el-option v-for="item in display.SingleSubject_points"
                       :key="item.id"
                       :label="item.knowledge"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="hidden"
                      label="知识点id"
                      label-width="50px"
                      prop="knowid">
          <el-input v-model="questionAddSingleData.knowid"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="试题类型"
                      label-width="200px"
                      prop="type_id">
          <el-input v-model="questionAddSingleData.type_id"
                    placeholder='(1:单选，2：多选，3：判断)'
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目"
                      label-width="200px"
                      prop="content">
          <el-input v-model="questionAddSingleData.content"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="答案"
                      label-width="200px"
                      prop="answer">
          <el-input v-model="questionAddSingleData.answer"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <!-- 关闭窗口 -->
        <el-button @click="addSingleQuestionsQuit">取 消</el-button>
        <!-- 把数据入库 -->
        <el-button type="primary"
                   @click.stop="addSingleQuestionsPost('registerFormSingle')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改试题弹窗 -->
    <!-- visible控制窗口的显示与隐藏 -->
    <el-dialog title="修改试题"
               :visible.sync="editQuestionsShow">
      <el-form :model="questionsEditData"
               :rules='rulesEdit'
               ref="rulesEdit">
        <el-form-item label="科目名字"
                      label-width="200px"
                      prop="type_id">
          <el-input v-model="questionsEditData.subject"
                    disabled
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="知识点名字"
                      label-width="200px"
                      prop="type_id">
          <el-input v-model="questionsEditData.knowledge"
                    disabled
                    autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="试题类型"
                      label-width="200px"
                      placeholder='(1:单选，2：多选，3：判断)'
                      prop="type_id">
          <el-input v-model="questionsEditData.type_id"
                    disabled
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目"
                      label-width="200px"
                      prop="content">
          <el-input v-model="questionsEditData.content"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="A选项"
                      label-width="200px"
                      prop="A">
          <el-input v-model="questionsEditData.A"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="B选项"
                      label-width="200px"
                      prop="B">
          <el-input v-model="questionsEditData.B"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="C选项"
                      label-width="200px"
                      prop="C">
          <el-input v-model="questionsEditData.C"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="D选项"
                      label-width="200px"
                      prop="D">
          <el-input v-model="questionsEditData.D"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="答案"
                      label-width="200px"
                      prop="answer">
          <el-input v-model="questionsEditData.answer"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <!-- 关闭窗口 -->
        <el-button @click="editQuestionsQuit">取 消</el-button>
        <!-- 把数据入库 -->
        <el-button type="primary"
                   @click.stop="editQuestionsPost('rulesEdit')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改试题弹窗   判斷 -->
    <!-- visible控制窗口的显示与隐藏 -->
    <el-dialog title="修改试题"
               :visible.sync="editSingleQuestionsShow">
      <el-form :model="questionsSingleEditData"
               :rules='rulesEditPanDuan'
               ref="rulesEditPanDuan">
        <el-form-item label="科目名字"
                      label-width="200px"
                      prop="type_id">
          <el-input v-model="questionsSingleEditData.subject"
                    disabled
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="知识点名字"
                      label-width="200px"
                      prop="type_id">
          <el-input v-model="questionsSingleEditData.knowledge"
                    disabled
                    autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="试题类型"
                      label-width="200px"
                      placeholder='(1:单选，2：多选，3：判断)'
                      prop="type_id">
          <el-input v-model="questionsSingleEditData.type_id"
                    disabled
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目"
                      label-width="200px"
                      prop="content">
          <el-input v-model="questionsSingleEditData.content"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="答案"
                      label-width="200px"
                      prop="answer">
          <el-input v-model="questionsSingleEditData.answer"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <!-- 关闭窗口 -->
        <el-button @click="editSingleQuestionsQuit">取 消</el-button>
        <!-- 把数据入库 -->
        <el-button type="primary"
                   @click.stop="editSingleQuestionsPost('rulesEditPanDuan')">确 定</el-button>
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
    // 搜索知识点
    this.$myHttp({
      url: 'list_know',
      method: 'get',
      headers: {
        'Authorization': window.localStorage.getItem('token')
      }
    }).then(res => {
      if (res.status === 200) {
        console.log(res.data)
        console.log('res')
        this.searchdropSelectDataQuestions = res.data
      }
    }).catch((res) => {
      // console.log(res)
      this.$message.error('token错误')
      this.$router.push({
        name: 'Login'
      })
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
      editQuestionsShow: false,
      editSingleQuestionsShow: false,
      // 修改试题数据
      questionsEditData: {},
      questionsSingleEditData: {},

      // 删除多个的变量
      multipleSelection: [],
      a: [],

      // 搜索数据
      search: {
        searchdroplist: '',
        searchdroplistQuestions: '',
        searchData: ''
      },
      // 选择显示的搜索数据（科目）
      searchdropSelectData: {},
      // 选择显示的搜索数据（知识点）
      searchdropSelectDataQuestions: {},
      // 显示数据
      tableData: [],

      // 显示添加弹窗添加
      addQuestionsShow: false,
      // 显示添加弹窗添加 单个判断
      addQuestionsSingleShow: false,
      // 批量删除
      batchAddShow: false,

      // 添加表单数据显示的部分
      display: {
        subject_name: {},
        single_subject_name: {},
        subject_points: {},
        SingleSubject_points: {},
        knowid: 0,
        singleKnowid: 0

      },
      // 隐藏字段  添加的
      hidden: false,
      // 添加表单数据
      questionAddData: {
        subject: '',
        knowledge: '',
        knowid: '',
        content: '',
        A: '',
        B: '',
        C: '',
        D: '',
        answer: '',
        type_id: ''
      },
      // 添加表单数据  判断
      questionAddSingleData: {
        subject: '',
        knowledge: '',
        knowid: '',
        content: '',
        answer: '',
        type_id: ''
      },
      // 验证规则 rulesAddSinglePanduan
      rules: {
        subject: [{
          required: true,
          message: '请选择科目',
          trigger: 'blur'
        }],
        knowledge: [{
          required: true,
          message: '请选择知识点',
          trigger: 'blur'
        }],
        subject_points: [{
          required: true,
          message: '请选择知识点',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '请输入试题名称',
          trigger: 'blur'
        }],
        A: [{
          required: true,
          message: '请输入第一个选项',
          trigger: 'blur'
        }],
        B: [{
          required: true,
          message: '请输入第二个选项',
          trigger: 'blur'
        }],
        C: [{
          required: true,
          message: '请输入第三个选项',
          trigger: 'blur'
        }],
        D: [{
          required: true,
          message: '请输入第四个选项',
          trigger: 'blur'
        }],
        answer: [{
          required: true,
          message: '请输入答案',
          trigger: 'blur'
        }],
        type_id: [{
          required: true,
          message: '试题类型不能为空',
          trigger: 'blur'
        }]

      },
      rulesAddSinglePanduan: {
        subject: [{
          required: true,
          message: '请选择科目',
          trigger: 'blur'
        }],
        knowledge: [{
          required: true,
          message: '请选择知识点',
          trigger: 'blur'
        }],
        subject_points: [{
          required: true,
          message: '请选择知识点',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '请输入试题名称',
          trigger: 'blur'
        }],
        answer: [{
          required: true,
          message: '请输入答案',
          trigger: 'blur'
        }],
        type_id: [{
          required: true,
          message: '试题类型不能为空',
          trigger: 'blur'
        }]

      },
      rulesEdit: {
        content: [{
          required: true,
          message: '请输入试题名称',
          trigger: 'blur'
        }],
        A: [{
          required: true,
          message: '请输入第一个选项',
          trigger: 'blur'
        }],
        B: [{
          required: true,
          message: '请输入第二个选项',
          trigger: 'blur'
        }],
        C: [{
          required: true,
          message: '请输入第三个选项',
          trigger: 'blur'
        }],
        D: [{
          required: true,
          message: '请输入第四个选项',
          trigger: 'blur'
        }],
        answer: [{
          required: true,
          message: '请输入答案',
          trigger: 'blur'
        }]
      },
      rulesEditPanDuan: {
        content: [{
          required: true,
          message: '请输入试题名称',
          trigger: 'blur'
        }],
        answer: [{
          required: true,
          message: '请输入答案',
          trigger: 'blur'
        }]
      }
    }
  },
  filters: {
    leiXing: function (val) {
      let num = Number(val)
      let ret = ''
      if (num === 1) {
        ret = '单选题'
      } else if (num === 2) {
        ret = '多选题'
      } else if (num === 3) {
        ret = '判断题'
      } else if (num === 4) {
        ret = '填空题'
      } else {
        ret = '其他类型题'
      }
      return ret
    }
  },
  methods: {
    handleCommand (command) {
      // this.$message('click on item ' + command)
      if (command === 'singleDanDuo') {
        this.questionsShow()
        console.log('单个添加单选多选试题')
      } else if (command === 'singlePandaun') {
        console.log('单个添加判断试题')
        this.singlePanduan()
      } else if (command === 'multiPanduan') {
        console.log('批量导入判断试题')
      } else if (command === 'multiDanDuo') {
        // 以后再改
        console.log('批量导入单选多选试题')
      }
    },
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
        url = `page_topic?page=${this.page}&pagesize=${this.sizePage}`
      } else {
        url =
          `page_topic?&page=${this.page}&pagesize=${this.sizePage}&query=${search.searchData}&know=${search.searchdroplistQuestions}&subject=${search.searchdroplist}`
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
        // console.log(data)
        // this.$message.error('token错误')
        // this.$router.push({ name: 'Login' })
      })
    },
    // 根据科目选搜索知识点  搜索
    searchSubjectChange (val) {
      this.search.searchdroplistQuestions = ''
      this.$myHttp({
        url: 'knowledge?subject_id=' + val,
        method: 'get',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      })
        .then(res => {
          if (res.status === 200) {
            console.log(res)
            console.log('subject')
            this.searchdropSelectDataQuestions = res.data
          }
        })

      // this.searchdropSelectDataQuestions = res.data
    },
    // // 选择知识点       搜索        双向数据绑定
    // searchKnnowledgeChange (val) {
    //   // this.search.searchdroplistQuestions = val
    // },
    // 搜索 search
    searchGet () {
      // console.log(this.search)
      this.getUserList(this.search)
    },
    // 根据科目获取知识点 判断
    SingleSubjectChange (val) {
      this.questionAddSingleData.knowledge = ''
      this.$myHttp({
        url: 'knowledge?subject_id=' + val,
        method: 'get',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      })
        .then(res => {
          if (res.status === 200) {
            if (res.data.length < 1) {
              this.$confirm('此科目还没有知识点是否要新建知识点?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$router.push({
                  name: 'Points'
                })
                this.$store.commit('tabChange', 'points')
              }).catch(() => {
                // 点击取消
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
            } else {
              this.display.SingleSubject_points = res.data
            }
          }
        })
    },
    // 根据科目获取知识点
    subjectChange (val) {
      this.questionAddData.knowledge = ''
      this.$myHttp({
        url: 'knowledge?subject_id=' + val,
        method: 'get',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      })
        .then(res => {
          if (res.status === 200) {
            if (res.data.length < 1) {
              this.$confirm('此科目还没有知识点是否要新建知识点?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$router.push({
                  name: 'Points'
                })
                this.$store.commit('tabChange', 'points')
              }).catch(() => {
                // 点击取消
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
                // this.addQuestionsShow = false
              })
            } else {
              this.display.subject_points = res.data
            }
          }
        })
    },
    // 确定选择的知识点  判断
    singlePointsChange (val) {
      this.questionAddSingleData.knowid = val
    },
    // 确定选择的知识点
    pointsChange (val) {
      this.questionAddData.knowid = val
    },
    // 显示添加面板  单个 判断
    singlePanduan () {
      this.addQuestionsSingleShow = true
      this.$myHttp({
        url: 'get_all_subject',
        method: 'post',
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res.data)
        if (res.status === 200) {
          this.display.single_subject_name = res.data
        } else {
          this.$message.error('获取科目错误')
        }
      })
    },
    // 显示添加面板  show
    questionsShow () {
      this.addQuestionsShow = true
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
      })
    },
    // 批量添加
    batchAdd () {
      this.batchAddShow = true
    },
    // 取消添加面板
    addQuestionsQuit () {
      this.addQuestionsShow = false
      this.questionAddData = {}
    },
    // 取消添加面板  判断
    addSingleQuestionsQuit () {
      this.addQuestionsSingleShow = false
      this.questionAddSingleData = {}
    },
    // 添加题  add  判断
    addSingleQuestionsPost (ruleForm) {
      this.$refs[ruleForm].validate((res) => {
        if (res) {
          this.$myHttp({
            url: 'judge_topic',
            method: 'post',
            data: this.questionAddSingleData,
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
                this.addQuestionsSingleShow = false
                // 清空添加数据
                this.questionAddSingleData = {}
                // 重新获取数据
                this.getUserList()
              }
            })
        }
      })
    },
    // 添加题  add
    addQuestionsPost (ruleForm) {
      this.$refs[ruleForm].validate((res) => {
        if (res) {
          this.$myHttp({
            url: 'insert_topic',
            method: 'post',
            data: this.questionAddData,
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

                // 清空添加数据
                this.questionAddData = {}
                // 重新获取数据
                this.getUserList()
                // 关闭弹窗
                this.addQuestionsShow = false
              }
            })
        }
      })
    },
    // 删除知识点
    deleteQuestions (scope) {
      this.$confirm('此操作将永久删除该试题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定
        this.$myHttp({
          url: 'delete_topic',
          method: 'post',
          data: {
            id: scope.row.id
          }
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
    // 批量删除
    async batchDelete () {
      // console.log(this.multipleSelection)
      var ids = this.multipleSelection.map(item => item.id).join()
      // console.log(ids)
      this.$confirm('此操作将永久删除该知识点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定
        this.$myHttp({
          url: 'delete_topic',
          method: 'post',
          data: {
            id: ids
          }
        }).then(res => {
          // console.log(res)
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
    // 选择要删除的
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 修改试题状态
    modifyStatus (scope) {
      var index = scope.$index
      console.log(scope.row)
      this.$myHttp({
        url: 'update_qus_status?id=' + scope.row.id,
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
    // 查看详情
    detialsItem (scope) {
      console.log(scope)
    },
    // 显示修改知识点面板
    modifyShow (scope) {
      if (scope.row.type_id === 1 || scope.row.type_id === 2) {
        this.editQuestionsShow = true
        this.questionsEditData = scope.row
      } else if (scope.row.type_id === 3) {
        this.editSingleQuestionsShow = true
        let row = JSON.parse(JSON.stringify(scope.row))
        this.questionsSingleEditData = row
      }
    },
    // 关闭修改知识点面板
    editQuestionsQuit () {
      this.editQuestionsShow = false
      this.questionsEditData = {}
    },
    // 关闭修改知识点面板
    editSingleQuestionsQuit () {
      this.editSingleQuestionsShow = false
      this.questionsSingleEditData = {}
    },
    // 修改知识点
    editQuestionsPost (ruleForm) {
      let Data = {}
      Data = this.questionsEditData
      this.$refs[ruleForm].validate((res) => {
        if (res) {
          this.$myHttp({
            url: 'update_topic',
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
                  message: '修改成功',
                  type: 'success'
                })
                // 关闭弹窗
                this.editQuestionsShow = false
                // 清空添加数据
                this.questionsEditData = {}
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
    editSingleQuestionsPost (ruleForm) {
      let Data = {}
      Data = this.questionsSingleEditData
      this.$refs[ruleForm].validate((res) => {
        if (res) {
          this.$myHttp({
            url: 'update_judge',
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
                  message: '修改成功',
                  type: 'success'
                })
                // 关闭弹窗
                this.editSingleQuestionsShow = false
                // 清空添加数据
                this.questionsSingleEditData = {}
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
    }
    // 控制修改试题的窗口显示
    // editUserisShow (scope) {
    //   // 显示弹出
    //   this.editQuestionsShow = true
    //   // 传入数据
    //   this.userEditData = scope.row
    //   // console.log(scope.row)
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-main {
  line-height: 30px;
  text-align: left;
}

.ipt {
  width: 30%;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

/* 下拉 */
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}
/* 页数 */
.el-pagination total {
  margin-left: 30px !important;
}
</style>
