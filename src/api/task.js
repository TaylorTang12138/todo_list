import request from "../utils/request";

// 根据类型获取task
export const getTaskByType = (query) => {
  return request.get(`/task?type=${query.type}`);
};

// 添加任务
export const addTask = (data) => {
  return request.post("/task", data);
};

// 删除任务
export const deleteTask = (data) => {
  return request.delete(`/task/${data.id}`);
};

// 更新任务
export const updateTask = (data) => {
  return request.put("/task", data);
};
