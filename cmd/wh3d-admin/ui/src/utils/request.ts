import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Session } from '/@/utils/storage';
// 顶级路径
export const baseURL = 'main'
// 配置新建一个 axios 实例
const service = axios.create({
	baseURL: import.meta.env.VITE_API_URL as any,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		// 在发送请求之前做些什么 token
		if (Session.get('token')) {
			config.headers.common['Authorization'] = `${Session.get('token')}`;
		}
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		// 对响应数据做点什么
		const res = response.data;
		if (res.code && res.code !== 200) {
			// `token` 过期或者账号已在别处登录
			if (res.code === 401 || res.code === 4001) {
				Session.clear(); // 清除浏览器全部临时缓存
				window.location.href = '/'; // 去登录页
				ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
					.then(() => { })
					.catch(() => { });
			}
			return Promise.reject(service.interceptors.response);
		} else {
			return response.data;
		}
	},
	(error) => {
		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时');
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误');
		} else {
			if (error.response.data) ElMessage.error(error.response.statusText);
			else ElMessage.error('接口路径找不到');
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
}

export function post(url: string, params: object) {
	return service.request({
		url: url,
		method: 'post',
		data: params,
	});
}

export function put(url: string, params: object) {
	return service.request({
		url: url,
		method: 'put',
		data: params,
	});
}

export function del(url: string, params: object) {
	return service.request({
		url: url,
		method: 'delete',
		data: params,
	});
}

export function postFrom(url: string, params: object) {
	return service.request({
		headers: {
			'Content-Type': 'multipart/form-data'
		},
		url: url,
		method: 'post',
		data: params,
	});
}

// export function getExcelOnline(url, data = {}, fun) {
// 	service.request({
// 		method: 'get',
// 		url: url,
// 		params: data,
// 		headers: {
// 			'Content-Type': 'application/octet-stream'
// 		},
// 		responseType: 'blob'
// 	}).then(fun)
// 	// return service.request({
// 	// 	headers: {
// 	// 		'Content-Type': 'application/octet-stream'
// 	// 	},
// 	// 	url: url,
// 	// 	method: 'get',
// 	// 	data: data,
// 	// });
// }

//获取服务器文件，并下载到浏览器
export async function getExcelOnlineForDownloading(url, data = {}) {
	data = {
		...data,
		_t: Date.parse(new Date()) / 1000
	}
	let res = await service.request({
		method: 'get',
		url: url,
		params: data,
		headers: {
			'Content-Type': 'application/json'
		},
		responseType: 'blob'
	})
	// 浏览器下载文件
	download(res)
}

// 获取服务器文件，不提交下载动作
export function getExcelOnline(url, data = {}, fun) {
	data = {
		...data,
		_t: Date.parse(new Date()) / 1000
	}
	service.request({
		method: 'get',
		url: url,
		params: data,
		headers: {
			'Content-Type': 'application/octet-stream'
		},
		responseType: 'blob'
	}).then(fun)
}

// 下载文件
const download = (res: any) => {

	let data = res.data;
	if (!res.data) {
		return;
	}
	data = {
		...data,
		_t: Date.parse(new Date()) / 1000
	}

	// 设置下载文件名称，使用正则取出名称
	const pat = new RegExp("(?<=filename=).*");
	let contentDisposition = "";
	//浏览器问题可能会出现 content-disposition 匹配不到
	if (res.headers["content-disposition"]) contentDisposition = res.headers["content-disposition"];
	if (res.headers["Content-Disposition"]) contentDisposition = res.headers["Content-Disposition"];
	console.log(contentDisposition)
	const result = pat.exec(contentDisposition);
	console.log(result)
	let fileName = result && result[0];
	if (fileName == undefined) {
		fileName = "excel.xlsx";
	} else {
		fileName = decodeURIComponent(fileName);
	}

	let url = window.URL.createObjectURL(new Blob([data]));
	let link = document.createElement("a");
	link.style.display = "none";
	link.href = url;
	link.setAttribute("download", fileName);
	document.body.appendChild(link);
	link.click();
}

// 导出 axios 实例
export default service;
