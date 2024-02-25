import {ElMessage} from "element-plus";

export const SuccessInfo = (message) => {
    ElMessage({
        showClose: true,
        message: message,
        type: 'success',
    })
}

export const ErrorInfo = (message) => {
    ElMessage.error(message)
}