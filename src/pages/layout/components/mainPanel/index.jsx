import styled from "@emotion/styled";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Checkbox,
} from "@mui/material";
import {
  MoreHoriz,
  FormatPaint,
  SwapVert,
  Add,
  RadioButtonUnchecked,
  RadioButtonChecked,
  Star,
  StarBorder,
  CalendarMonth,
} from "@mui/icons-material";
import SelectThemeDialog from "./components/selectTheme";
import TaskConfigPanel from "./components/editTask";
import defaultBg from "../../../../assets/images/bg/5.jpg";
import { formatTime } from "@utils/index";

import {
  getTaskByType,
  addTask,
  deleteTask,
  updateTask,
} from "../../../../api/task";

const MainWrapper = styled.div`
  width: calc(100% - 200px);
  background: url(${(props) => props.background}) center center no-repeat;
  background-size: cover;
  /* padding: 10px; */
  padding: 20px 10px 10px 10px;

  color: white;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    line-height: 30px;

    .title {
      font-weight: bold;
      font-size: 20px;
    }

    .config {
      font-size: 12px;
      padding: 1px 8px;
      cursor: pointer;
      background-color: var(--darkColor);
      border-radius: 3px;
      color: white;
      min-width: unset;
    }
  }

  .task_panel {
    height: calc(100% - 30px);
    position: relative;
    padding-top: 5px;

    ul {
      height: calc(100% - 35px);
      scrollbar-width: none;
      overflow-y: scroll;

      li {
        background-color: white;
        padding: 5px 8px;
        color: black;
        opacity: 0;
        border-radius: 3px;
        margin-bottom: 4px;
        transform: translateY(20px);
        animation: showList 0.5s ease forwards;
        display: flex;
        align-items: center;
        .MuiButtonBase-root {
          padding: 0;
          margin-right: 5px;
        }
        .info {
          flex: 1;

          .name {
            font-size: 13px;
            font-weight: bold;
            word-break: break-all;
            white-space: pre-wrap;

            &[finished="true"] {
              text-decoration: line-through;
              color: #78787a;
            }
          }

          .remark {
            padding-left: 5px;
            font-size: 12px;
            color: #78787a;
            word-break: break-all;
            white-space: pre-wrap;
          }
        }

        .date {
          align-items: center;
          font-size: 12px;
          color: #78787a;
          margin-right: 5px;
          color: var(--primaryColor);

          svg {
            font-size: 18px;
            margin-right: 2px;
          }
        }

        &:hover {
          opacity: 0.4 !important;
        }
      }

      @keyframes showList {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }

    .add_line {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 35px;
      display: flex;
      align-items: center;
      padding: 0 5px;
      background-color: var(--darkColor);
      border-radius: 6px;
      input {
        outline: none;
        border: none;
        background-color: transparent;
        color: white;
        font-weight: bold;
        font-size: 13px;
      }
    }
  }

  ::v-deep(.MuiPaper-root) {
    border: 1px solid red;
  }
`;

const MainPanel = function (props) {
  const { group, searchValue } = props;
  const [anchorEl, setAnchorEl] = useState(null); // 显示dropdown menu
  const [showDialog, setShowDialog] = useState(false); // 显示背景选择dialog
  const [showBg, setShowBg] = useState(defaultBg); // 默认背景图片
  const [showTaskList, setShowTaskList] = useState([]); // 展示的任务列表
  const [addTaskName, setAddTaskName] = useState(""); // 添加的任务名称
  const [showMessage, setShowMessage] = useState(false); // Message提示
  const [showConfigPanel, setShowConfigPanel] = useState(false); // 显示任务编辑弹框
  const [selectedTask, setSelectedTask] = useState({}); // 选择的任务
  const [showNotice, setShowNotice] = useState([]);

  const listRef = useRef();
  const showMenu = Boolean(anchorEl);

  // 切换组
  useEffect(() => {
    getTask();
  }, [group]);

  // 搜索值改变
  useEffect(() => {
    setShowTaskList((prew) => {
      return showTaskList.map((item) => {
        item.show = item.title.indexOf(searchValue) !== -1;
        return item;
      });
    });
  }, [searchValue]);

  // done: 根据类型获取任务
  const getTask = async () => {
    const { data } = await getTaskByType({
      type: group.type,
    });
    data.list = data.list.map((item) => {
      item.id = item._id;
      item.show = true;
      return item;
    });
    setShowTaskList(data.list);

    setShowNotice((prew) => {
      let tasks = data.list.filter((item) => {
        return item.date && item.date === formatTime(new Date());
      });
      if (
        !showNotice.includes(group.type) &&
        window.electronApi &&
        tasks.length > 0
      ) {
        window.electronApi.invokeMethod("sendNotice", {
          title: "待办",
          body: `${tasks.length}条任务待执行`,
        });
        return [...prew, group.type];
      } else {
        return prew;
      }
    });
  };

  // done: 打开下拉
  const showDropMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  // done:关闭下拉
  const hideDropMenu = () => {
    setAnchorEl(null);
  };

  // done: 打开主题选择
  const openThemeSelect = () => {
    setShowDialog(!showDialog);
  };

  // done: 关闭主题选择弹框
  const closeThemeSelect = () => {
    setShowDialog(false);
  };

  // done: 确认改变主题
  const changeTheme = (e) => {
    closeThemeSelect();
    hideDropMenu();
    setShowBg(e.img);
  };

  // done: 添加的标题input改变
  const changeValue = (e) => {
    setAddTaskName(e.target.value);
  };

  // done: 标题input回车
  const inputKeyDown = (e) => {
    if (e.which === 13) {
      addShowTask();
    }
  };

  // done: 添加一个任务
  const addShowTask = async () => {
    if (addTaskName.trim().length === 0) {
      setShowMessage(true);
      return;
    }

    const { message, data } = await addTask({
      title: addTaskName,
      type: group.type,
    });

    if (message === "success") {
      setShowTaskList([...showTaskList, { ...data, show: true, id: data._id }]);
      setAddTaskName("");
      // 清空值
      setTimeout(() => {
        // console.log(listRef);
        const componentNode = listRef.current;

        if (listRef) {
          const isScrolledToBottom =
            componentNode.scrollTop + componentNode.clientHeight ===
            componentNode.scrollHeight;
          if (!isScrolledToBottom) {
            componentNode.scrollTo(0, componentNode.scrollHeight);
          }
        }
      }, 50 * showTaskList.length);
    }
  };

  // done: 修改任务的属性
  const editShowTask = async (newValue) => {
    const { message, data } = await updateTask(newValue);
    if (message === "success") {
      let updateData = showTaskList.map((item) => {
        if (item.id === data._id) {
          item = newValue;
        }
        return item;
      });
      setShowTaskList(updateData);
    }
  };

  // done: 删除任务
  const deleteShowTask = async () => {
    const { id } = selectedTask;
    const { message } = await deleteTask({ id });
    if (message === "success") {
      setShowConfigPanel(false);
      setTimeout(() => {
        getTask();
      }, 500);
    }
  };

  // done: 选择任务
  const selectTask = (item) => {
    setShowConfigPanel(Object.keys(item).length > 0);
    setSelectedTask(item);
  };

  return (
    <MainWrapper background={showBg}>
      <div className="wrapper"></div>
      {/* 头部标题 设置 */}
      <div className="header">
        <div className="title">{group.label}</div>
        <Button
          id="basic-button"
          aria-controls={showMenu ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={showMenu ? "true" : undefined}
          className="config no_drag"
          onClick={showDropMenu}
        >
          <MoreHoriz></MoreHoriz>
          {/* Dashboard */}
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={showMenu}
          onClose={hideDropMenu}
          MenuListProps={{
            "aria-labelledby": "basic-button",
            sx: {
              padding: "0",
            },
          }}
          className="no_drag"
        >
          <MenuItem
            onClick={openThemeSelect}
            sx={{
              fontSize: "13px",
            }}
          >
            <FormatPaint sx={{ fontSize: "16px", marginRight: "3px" }} />
            修改主题
          </MenuItem>
          <MenuItem
            onClick={hideDropMenu}
            sx={{
              fontSize: "13px",
            }}
          >
            <SwapVert sx={{ fontSize: "18px", marginRight: "3px" }} />
            排序
          </MenuItem>
        </Menu>
      </div>

      {/* 操作面板 */}
      <div className="task_panel no_drag">
        <ul ref={listRef}>
          {showTaskList
            .filter((item) => item.show)
            .map((item, index) => (
              <li
                key={item.id}
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <Checkbox
                  checked={item.finished}
                  onChange={() =>
                    editShowTask({
                      ...item,
                      finished: !item.finished,
                    })
                  }
                  icon={<RadioButtonUnchecked />}
                  checkedIcon={<RadioButtonChecked />}
                ></Checkbox>
                <div className="info" onClick={() => selectTask(item)}>
                  <span className="name" finished={item.finished.toString()}>
                    {item.title}
                  </span>
                  <div className="remark">{item.remark}</div>
                </div>
                <span
                  className="date"
                  style={{
                    display: item.date ? "flex" : "none",
                  }}
                >
                  <CalendarMonth />
                  {item.date}
                </span>

                <Checkbox
                  checked={item.important}
                  onChange={() =>
                    editShowTask({
                      ...item,
                      important: !item.important,
                    })
                  }
                  icon={<StarBorder />}
                  checkedIcon={<Star />}
                ></Checkbox>
              </li>
            ))}
        </ul>
        <div className="add_line">
          <Add onClick={addTask} />
          <input
            value={addTaskName}
            onChange={changeValue}
            onKeyDown={inputKeyDown}
          />
        </div>
      </div>

      {/* 选择主题Dialog */}
      <SelectThemeDialog
        onClose={closeThemeSelect}
        show={showDialog}
        onConfirm={changeTheme}
      />
      {/* 提示 */}
      <Snackbar
        open={showMessage}
        autoHideDuration={1500}
        onClose={() => setShowMessage(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert sx={{ bgcolor: "background.paper" }} severity="warning">
          请添加任务标题！
        </Alert>
      </Snackbar>

      {/* 编辑drawer */}
      <TaskConfigPanel
        show={showConfigPanel}
        info={selectedTask}
        onChange={(e) => editShowTask(e)}
        onClose={() => selectTask({})}
        onDelete={(e) => deleteShowTask(e)}
      ></TaskConfigPanel>
    </MainWrapper>
  );
};

export default MainPanel;
