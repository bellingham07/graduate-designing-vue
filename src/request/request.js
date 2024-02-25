import axios from 'axios'

export const Request = axios.create({
    baseURL: 'http://127.0.0.1:14005',
})

Request.interceptors.request.use(function (config) {
    // if (localStorage.getItem('token')) {
        config.headers = {
            'Authorization': localStorage.getItem('token'), //携带权限参数
            'Content-Type': 'application/json'
        };
    // }
    return config
}, function (error) {
    return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
    return response
}, function (error) {
    console.log(error)
    return Promise.reject(error)
})