export default [{
    path: '/areaconf',
    name: 'areaconf',
    component: () => import('/@/layout/routerView/parent.vue'),
    redirect: '/areaconf/list',
    meta: {
        title: '区域配置',
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
                title: '区域列表',
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

