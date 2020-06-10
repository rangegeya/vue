<template>
  <div class="login-wrap">
    <el-form :model="ruleForm"
             status-icon
             ref="ruleForm"
             label-width="100px"
             class="demo-ruleForm login-from">
      <h2>用户登录</h2>
      <el-form-item label="用户名"
                    prop="pass">
        <el-input type="text"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码"
                    prop="checkPass">
        <el-input type="password"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   class="login-btn">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      ruleForm: {
        pass: '',
        checkPass: ''
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>
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
