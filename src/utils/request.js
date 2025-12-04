import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

const baseURL = '/api'; // 使用代理解决跨域
const instance = axios.create({ baseURL });

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (err) => Promise.reject(err)
);

// 响应拦截器
instance.interceptors.response.use(
    (res) => {
        if (res.data.code === 0) {
            return res.data;
        }
        // 业务失败
        ElMessage.error(res.data.message || '服务异常');
        return Promise.reject(res.data);
    },
    (err) => {
        if (err.response?.status === 401) {
            ElMessage.error('登录失效，请重新登录');
            localStorage.removeItem('token');
            router.push('/login');
        } else {
            ElMessage.error('服务异常');
        }
        return Promise.reject(err);
    }
);

export default instance;