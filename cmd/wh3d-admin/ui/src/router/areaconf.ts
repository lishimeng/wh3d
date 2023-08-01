export default [{
    path: '/areaconf',
    name: 'areaconf',
    component: () => import('/@/layout/routerView/parent.vue'),
    redirect: '/areaconf/list',
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
            path: '/areaconf/list',
            name: 'areaconflist',
            component: () => import('/@/views/areaconf/index.vue'),
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

