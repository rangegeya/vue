<template>
  <div class="uploadBox">
    <!-- 返回主页 -->
    <div class="homeBox">
      <router-link to="/">
        <el-tooltip content="返回列表页面"
                    placement="top">
          <i class="el-icon-tickets"></i>
        </el-tooltip>
      </router-link>
    </div>

    <!-- 上传文件按钮 -->
    <div class="buttonBox">
      <div class="picture"><img  src="/static/images/document.png"
             alt="logo">
        <el-upload action
                   accept=".xlsx, .xls"
                   :auto-upload="false"
                   :show-file-list="false"
                   :on-change="handle">
          <el-button type="primary"
                     slot="trigger"
                     style="margin-top: 100px;">选取EXCEL文件</el-button>
        </el-upload>
      </div>
      <div class="picture"><img src="/static/images/data.png"
              alt="logo"
              style="margin-bottom:128px;">
        <el-button type="primary"
                   @click="submit"
                   :disabled="disable"
                   style="margin-left: -120px;">采集数据提交</el-button>
      </div>
    </div>

    <!-- 解析出来的数据 -->
    <div class="tableBox"
         v-show="show">
      <h3>
        <i class="el-icon-info"></i>
        小主，以下是采集完成的数据，请您检查无误后，点击“采集数据提交”按钮上传至服务器哦！
      </h3>

      <el-table :data="tempData"
                style="width: 100%"
                :height="height"
                border>
        <el-table-column prop="type_id"
                         label="题类型"
                         min-width="50%"></el-table-column>
        <el-table-column prop="knowid"
                         label="知识点id"
                         min-width="50%"></el-table-column>
        <el-table-column prop="content"
                         label="题目"
                         min-width="50%"></el-table-column>

        <el-table-column prop="A"
                         label="A选项"
                         min-width="50%"></el-table-column>
        <el-table-column prop="B"
                         label="B选项"
                         min-width="50%"></el-table-column>
        <el-table-column prop="C"
                         label="C选项"
                         min-width="50%"></el-table-column>
        <el-table-column prop="D"
                         label="D选项"
                         min-width="50%"></el-table-column>

        <el-table-column prop="answer"
                         label="答案"
                         min-width="50%"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import xlsx from 'xlsx'
import { Loading } from 'element-ui'
import { readFile, character, delay } from '../../assets/lib/utils'

import { createAPI } from '../../api/index'

export default {
  data () {
    return {
      height: document.documentElement.clientHeight - 130,
      tempData: [],
      show: false,
      disable: false
    }
  },
  methods: {
    // 采集EXCEL数据
    async handle (ev) {
      let file = ev.raw
      if (!file) return

      this.show = false
      let loadingInstance = Loading.service({
        text: '小主，请您稍等片刻，奴家正在玩命处理中！',
        background: 'rgba(0,0,0,.5)'
      })

      await delay(100)
      // 读取FILE中的数据（变为JSON格式）
      let data = await readFile(file)
      let workbook = xlsx.read(data, { type: 'binary' })
      // 第一个表格 的数据
      let worksheet = workbook.Sheets[workbook.SheetNames[0]]
      // 第一个表格数据 转换成json
      data = xlsx.utils.sheet_to_json(worksheet)
      console.log('data')
      console.log(data)
      console.log('data')

      // 把读取出来的数据变为最后可以传递给服务器的数据（姓名：name  电话：phone）
      let arr = []
      data.forEach(item => {
        console.log('item')
        console.log(item)
        console.log('item')
        let obj = {}
        for (let key in character) {
          if (!character.hasOwnProperty(key)) break
          let v = character[key]
          console.log('v')
          console.log(v)
          console.log('v')
          let text = v.text
          let type = v.type
          // console.log(text)
          // console.log(type)
          v = item[text] || ''
          // console.log(v)
          if (type === 'string') {
            v = String(v)
          }
          if (type === 'number') {
            v = Number(v)
          }
          obj[key] = v
        }
        arr.push(obj)
      })
      console.log('arr')
      console.log(arr)
      console.log('arr')
      await delay(100)
      // 展示到页面中
      this.show = true
      this.tempData = arr
      loadingInstance.close()
    },
    // 提交数据给服务器
    async submit () {
      if (this.tempData.length <= 0) {
        this.$message({
          message: '小主，请您先选择EXCEL文件！',
          type: 'warning',
          showClose: true
        })
      }

      this.disable = true
      let loadingInstance = Loading.service({
        text: '小主，请您稍等片刻，奴家正在玩命处理中！',
        background: 'rgba(0,0,0,.5)'
      })

      // 完成后处理的事情
      let complate = () => {
        this.$message({
          message: '小主，奴家已经帮您把数据上传了！',
          type: 'success',
          showClose: true
        })
        this.show = false
        this.disable = false
        loadingInstance.close()
      }

      // // 需要把数据一条条传递给服务器
      let n = 0

      console.log('statrt')
      console.log(n)
      let send = async () => {
        if (n > this.tempData.length - 1) {
          // 都传递完了
          complate()
          return
        }
        let body = this.tempData[n]
        console.log('body')
        console.log(body)
        console.log('body')
        let result = await createAPI(body)
        // let result = await this.add(body)
        console.log('result')
        console.log(result)
        console.log('result')
        if (parseInt(result.status) === 200) {
          // 成功
          console.log(parseInt(result.status))
          console.log('parseInt(result.status)')
          console.log(n)
          n++
          console.log(n)
        }
        console.log(n)
        send()
        console.log(n)
      }
      console.log(n)
      send()
      console.log(n)
      console.log('end')
    },
    add (options) {
      return this.$myHttp({
        url: 'insert_topic',
        method: 'post',
        data: options,
        headers: {
          'Authorization': window.localStorage.getItem('token')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.homeBox {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  font-size: 35px;
}

.uploadBox {
  padding: 20px;
}

.buttonBox {
 display: flex;
}
.picture{
 display: inline-block;
 margin-left: 200px;
}
.tableBox {
  h3 {
    font-size: 16px;
    font-weight: normal;
    line-height: 50px;
    color: lightcoral;
  }
}
//
</style>
