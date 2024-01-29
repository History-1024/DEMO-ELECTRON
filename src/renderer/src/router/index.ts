import { Router, createRouter, createWebHistory } from 'vue-router'
export const router: Router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@renderer/view/Login/index.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/',
      redirect: '/Home',
      children: [
        {
          path: '/Home',
          name: 'Home',
          component: () => import('@renderer/view/Home/index.vue')
        },
        {
          path: '/Desc',
          name: 'Desc',
          component: () => import('@renderer/layout/index.vue'),
          meta: {
            title: '大屏详情'
          },
          children: [
            // {
            //   path: '/test2',
            //   name: 'Test2',
            //   redirect: '/test2/test2-1',
            //   meta: {
            //     title: '线路分区',
            //     icon: 'message'
            //   },
            //   children: [
            //     {
            //       path: '/test2-1',
            //       name: 'Test2-1',
            //       component: () => import('@renderer/view/Test/test1.vue'),
            //       meta: {
            //         title: '线路区段状况统计'
            //       }
            //     },
            //     {
            //       path: '/test2-2',
            //       name: 'Test2-2',
            //       component: () => import('@renderer/view/Test/test2.vue'),
            //       meta: {
            //         title: '百公里数据统计'
            //       }
            //     }
            //   ]
            // },
            {
              path: '/Disease',
              name: 'Disease',
              redirect: '/Disease/RepeatedDisease',
              meta: {
                title: '病害查询',
                icon: 'menu'
              },
              children: [
                {
                  path: '/Disease/Desc',
                  name: 'RepeatedDisease',
                  component: () => import('@renderer/view/Disease/Desc/index.vue'),
                  meta: {
                    title: '病害明细'
                  }
                },
                {
                  path: '/Disease/RepeatedDisease',
                  name: 'RepeatedDisease',
                  component: () => import('@renderer/view/Disease/RepeatedDisease/index.vue'),
                  meta: {
                    title: '重复病害统计'
                  }
                },

                {
                  path: '/Disease/RoughlyDisease',
                  name: 'RoughlyDisease',
                  component: () => import('@renderer/view/Disease/RoughlyDisease/index.vue'),
                  meta: {
                    title: '大峰值病害统计'
                  }
                }
              ]
            },
            {
              path: '/Dense',
              name: 'dense',
              component: () => import('@renderer/view/Dense/index.vue'),
              meta: {
                title: '密集区段数据统计',
                icon: 'set-up'
              }
            },
            {
              path: '/SirenLine',
              name: 'SirenLine',
              component: () => import('@renderer/view/Siren/Line/index.vue'),
              meta: {
                title: '线路病害统计',
                icon: 'operation'
              }
            },

            {
              path: '/SirenHaulageMotor',
              name: 'SirenHaulageMotor',
              component: () => import('@renderer/view/Siren/HaulageMotor/index.vue'),
              meta: {
                title: '机车报警数据统计',
                icon: 'messageBox'
              }
            }
          ]
        }
      ]
    }
  ]
})
router.beforeEach(async (_, __, next) => {
  try {
    next()
  } catch (error) {
    console.log('error: ', error)
  }
})
export default router
