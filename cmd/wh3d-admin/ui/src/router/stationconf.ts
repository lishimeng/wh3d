export default [{
    path: '/stationconf',
    name: 'stationconf',
    component: () => import('/@/layout/routerView/parent.vue'),
    redirect: '/stationconf/list',
    meta: {
        title: '站台配置',
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
            path: '/stationconf/list',
            name: 'stationconflist',
            component: () => import('/@/views/stationconf/index.vue'),
            meta: {
                title: '站台列表',
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

