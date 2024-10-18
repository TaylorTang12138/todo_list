import request from "../utils/request";

// 获取自定义组
export const getAllCustomGroup = () => {
  return request.get("/group");
};

// 新增一个组
export const addGroup = (data) => {
  return request.post("/group", data);
};
