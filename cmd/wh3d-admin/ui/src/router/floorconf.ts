export default [{
    path: '/floorconf',
    name: 'floorconf',
    component: () => import('/@/layout/routerView/parent.vue'),
    redirect: '/floorconf/list',
    meta: {
        title: '地板配置',
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
            path: '/floorconf/list',
            name: 'floorconflist',
            component: () => import('/@/views/floorconf/index.vue'),
            meta: {
                title: '地板列表',
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

