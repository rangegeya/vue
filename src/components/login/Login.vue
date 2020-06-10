<template>
  <div class="login-wrap">
    <el-form status-icon
             :rules='rules'
             :model="Form"
             ref="Form"
             label-width="100px"
             class="demo-ruleForm login-from">
      <h2>用户登录</h2>
      <el-form-item label="用户名"
                    prop='username'>
        <el-input type="text"
                  v-model="Form.username"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码"
                    prop='password'>
        <el-input type="password"
                  v-model="Form.password"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   class="login-btn"
                   @click="loginCilck">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      Form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginCilck () {
      this.$refs.Form.validate(res => {
        // 验证成功
        if (res) {
          // 发送ajax请求
          this.$myHttp({
            url: 'login',
            method: 'post',
            data: this.Form
          })
            .then((backData) => {
              let { data, status } = backData
              if (status === 200) {
                window.localStorage.setItem('token', data.results.token)
                // 提示成功
                this.$message({
                  message: '登陆成功',
                  type: 'success'
                })
                // this.$router.push('/')
                // 登陆成功跳转到主页
                this.$router.push({ name: 'Home' })
              }
            })
            .catch((data) => {
              this.$message.error('登录失败,请检查')
              this.$router.push({ name: 'Login' })
            })
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  >
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-from {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}
.login-warp .login-from .login-btn {
  width: 100%;
}
</style>
