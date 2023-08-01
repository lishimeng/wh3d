export default [{
    path: '/locationconf',
    name: 'locationcof',
    component: () => import('/@/layout/routerView/parent.vue'),
    redirect: '/locationconf/list',
    meta: {
        title: '库位配置',
        isLink: '',
        isHide: false,
        isKeepAlive: true,
        isAffix: false,
        isIframe: false,
        roles: ['admin'],
        icon: 'iconfont icon-xitongshezhi',
    },
    children: [
        {
            path: '/locationconf/list',
            name: 'locationcoflist',
            component: () => import('/@/views/locationconf/index.vue'),
            meta: {
                title: '库位列表',
                isLink: '',
                isHide: false,
                isKeepAlive: true,
                isAffix: false,
                isIframe: false,
                roles: ['admin'],
                icon: 'iconfont icon-caidan',
            },
        },
    ],
},]

