import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/json'
export const baseURL = 'main'
// 配置新建一个 axios 实例
const service = axios.create({
	baseURL: '' as any,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
});

// 添加请求拦截器
service.interceptors.request.use(
	(config: any) => {
		config.headers.common['orgId'] = "1"
		config.headers.common['deptId'] = "1"
		config.headers.common['operatorId'] = "1"
		return config;
	},
	(error: any) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response: any) => {
		// 对响应数据做点什么
		const res = response.data;
		if (res.code && res.code !== 200) {
			return Promise.reject(service.interceptors.response);
		}
		return response.data;
	},
	(error: any) => {
		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			console.log('网络超时');
		} else if (error.message == 'Network Error') {
			console.log('网络连接错误');
		} else {
			if (error.response && error.response.data) console.log(error.response.statusText);
			else console.log('接口路径找不到');
		}
		return Promise.reject(error);
	}
);

export function get(url: string, params: object) {
	return service.request({
		url: url,
		method: 'get',
		params: params,
	});
};

export function post(url: string, params: object) {
	return service.request({
		url: url,
		method: 'post',
		data: params,
	});
};

export function put(url: string, params: object) {
	return service.request({
		url: url,
		method: 'put',
		data: params,
	});
};

export function del(url: string, params: object) {
	return service.request({
		url: url,
		method: 'delete',
		data: params,
	});
};

// 导出 axios 实例
export default service;
