import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import Users from '@/components/users/Users'
import Points from '@/components/points/Points'
import Questions from '@/components/questions/Questions'
import Test from '@/components/test/Test'
import TestPanDuan from '@/components/test/TestPanDuan'
import Exam from '@/components/exam/Exam'
import AddExam from '@/components/exam/AddExam'
import ExamDetial from '@/components/exam/ExamDetial'
import Imgs from '@/components/imgs/Imgs'
import UploadExcel from '@/components/views/excels/upload-excel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/users',
          name: 'Users',
          component: Users
        }, {
          path: '/points',
          name: 'Points',
          component: Points
        }, {
          path: '/questions',
          name: 'Questions',
          component: Questions,
          menus: ['Points']
        }, {
          path: '/test',
          name: 'Test',
          component: Test
        }, {
          path: '/imgs',
          name: 'Imgs',
          component: Imgs
        }, {
          path: '/testPanDuan',
          name: 'TestPanDuan',
          component: TestPanDuan
        }, {
          path: '/exam',
          name: 'Exam',
          component: Exam
        }, {
          path: '/addExam',
          name: 'AddExam',
          component: AddExam
        }, {
          path: '/examDetial',
          name: 'ExamDetial',
          component: ExamDetial
        }, {
          path: 'upload-excel',
          component: UploadExcel,
          name: 'UploadExcel',
          meta: { title: 'Merge Header', charset: 'utf8' }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
