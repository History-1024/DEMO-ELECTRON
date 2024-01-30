import { Router, createRouter, createWebHistory } from 'vue-router'
import Home from '@/view/Home.vue'
export const router: Router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'Home',
          component: Home,
          meta: {
            title: '首页',
          },
        },
        {
          path: '/test',
          name: 'test',
          component: () => import('@/view/test.vue'),
          meta: {
            title: '测试',
          },
          // children: [
          //   {
          //     path: '/Disease',
          //     name: 'Disease',
          //     redirect: '/Disease/RepeatedDisease',
          //     meta: {
          //       title: '病害查询',
          //       icon: 'menu'
          //     },
          //     children: [
          //       {
          //         path: '/Disease/Desc',
          //         name: 'RepeatedDisease',
          //         component: () => import('@renderer/view/Disease/Desc/index.vue'),
          //         meta: {
          //           title: '病害明细'
          //         }
          //       },
          //       {
          //         path: '/Disease/RepeatedDisease',
          //         name: 'RepeatedDisease',
          //         component: () => import('@renderer/view/Disease/RepeatedDisease/index.vue'),
          //         meta: {
          //           title: '重复病害统计'
          //         }
          //       },

          //       {
          //         path: '/Disease/RoughlyDisease',
          //         name: 'RoughlyDisease',
          //         component: () => import('@renderer/view/Disease/RoughlyDisease/index.vue'),
          //         meta: {
          //           title: '大峰值病害统计'
          //         }
          //       }
          //     ]
          //   },
          //   {
          //     path: '/Dense',
          //     name: 'dense',
          //     component: () => import('@renderer/view/Dense/index.vue'),
          //     meta: {
          //       title: '密集区段数据统计',
          //       icon: 'set-up'
          //     }
          //   },
          //   {
          //     path: '/SirenLine',
          //     name: 'SirenLine',
          //     component: () => import('@renderer/view/Siren/Line/index.vue'),
          //     meta: {
          //       title: '线路病害统计',
          //       icon: 'operation'
          //     }
          //   },
          //   {
          //     path: '/SirenHaulageMotor',
          //     name: 'SirenHaulageMotor',
          //     component: () => import('@renderer/view/Siren/HaulageMotor/index.vue'),
          //     meta: {
          //       title: '机车报警数据统计',
          //       icon: 'messageBox'
          //     }
          //   }
          // ]
        },
      ],
    },
  ],
})
router.beforeEach(async (_, __, next) => {
  try {
    next()
  } catch (error) {
    console.log('error: ', error)
  }
})
export default router
