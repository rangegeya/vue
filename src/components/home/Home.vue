<template>
  <el-container class="height100">
    <!-- 头部 -->
    <el-header>
      <el-col :span="4">
        <div class="grid-content bg-purple"><img class="logo"
               src="/static/images/one.png"
               alt="logo"></div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light">
          后台管理系统
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-button type="warning"
                     @click.stop="logOut">退出</el-button>
        </div>
      </el-col>
    </el-header>
    <el-container>
      <!-- 左侧导航 -->
      <el-aside width="200px">
        <el-col :span="24">
          <el-menu :default-active="this.$store.state.active"
                   :router='true'
                   class="el-menu-vertical-demo">

            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span class="span">用户管理</span>
              </template>

              <el-menu-item-group>
                <el-menu-item index="users"> <i class="el-icon-menu"></i>用户列表 </el-menu-item>
                <el-menu-item index="points"><i class="el-icon-menu"></i>知识点列表</el-menu-item>
                <el-menu-item index="questions"><i class="el-icon-menu"></i>试题列表</el-menu-item>
                <el-menu-item index="test"><i class="el-icon-menu"></i>test</el-menu-item>
                <el-menu-item index="testPanDuan"><i class="el-icon-menu"></i>批量导入判断题</el-menu-item>
                <el-menu-item index="exam"><i class="el-icon-menu"></i>试卷列表</el-menu-item>
                <el-menu-item index="addExam"><i class="el-icon-menu"></i>添加试卷</el-menu-item>
                <el-menu-item index="imgs"><i class="el-icon-menu"></i>下载图片</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span class="span">权限列表</span>
              </template>

              <el-menu-item-group>
                <el-menu-item index="2-1"><i class="el-icon-menu"></i>选项1</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <!--  显示区域  -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  mounted () {
    var token = window.localStorage.getItem('token')
    if (!token) {
      this.$message.error('请登录！')
      this.$router.push({ name: 'Login' })
    }
  },
  methods: {
    logOut () {
      window.localStorage.clear('token')
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.height100 {
  height: 100%;
}
/* logo */
.logo {
  heigh: 100px;
  width: 190px;
  margin-left: 90px;
}
.el-header,
.el-footer {
  /* background-color: #b3c0d1; */
  background-color: #302b2b;
  color: #ffffff;
  text-align: center;
  line-height: 60px;
  font-size: 25px;
}
/* 退出按钮样式 */
.el-button--warning {
  color: #fff;
  background-color: #302b2b;
  border-color: #211e1e;
}
.el-button--warning:hover {
  color: #005599;
  background-color: #f5f5f5;
  border-color: #f5f5f5;
}
/* 左栏 */
.el-aside {
  /* background-color: #d3dce6; */
  background-color: #403a3a;
  text-align: center;
  line-height: 200px;
}
.span,
.el-menu-item {
  color: #ffffff;
}
.el-menu-item-group,
.el-submenu {
  background-color: #403a3a;
  color: #ffffff;
}

.el-menu-item:hover,
.template:hover {
  color: #005599;
}

.el-main {
  /* background-color: #e9eef3; */
  background-color: #f5f5f5;
  color: #333;
  /* text-align: center;
  line-height: 160px; */
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
