import { useState, useEffect } from "react";
import { Drawer, TextField } from "@mui/material";
import {
  LocalFireDepartment,
  Star,
  StarBorder,
  Add,
  Close,
  ChevronRight,
  DeleteForever,
} from "@mui/icons-material";
import styled from "@emotion/styled";

import { formatTime } from "@utils/index";

const BOX_HEIGHT = {
  header: "50px",
  bottom: "40px",
};

const DrawerWrapper = styled(Drawer)`
  .whole_wrapper {
    width: 240px;
    height: 100%;
    input,
    textarea {
      font-size: 13px;
    }

    .top_header {
      height: ${BOX_HEIGHT.header};
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 5px;
      box-shadow: 0 1px 3px 0 #dfdede;

      .title_icon {
        font-size: 28px;
        color: var(--primaryColor);
      }
      .title_field {
        margin: 0 5px;

        .MuiInputBase-root {
          &::after,
          &::before {
            display: none;
          }
        }
        input {
          font-size: 15px;
          padding-bottom: 0;
          font-weight: bold;
        }
      }

      svg:nth-of-type(2) {
        position: absolute;
        right: 10px;
      }
    }

    .form_wrapper {
      height: calc(100% - ${BOX_HEIGHT.header} - ${BOX_HEIGHT.bottom});
      padding: 10px 15px 0 15px;

      > div,
      > ul {
        width: 100%;
        margin-bottom: 10px;
      }

      .steps {
        > span {
          font-size: 15px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 2px;
        }

        .add_row {
          display: flex;
          align-items: center;
          margin-bottom: 5px;

          svg {
            color: var(--primaryColor);
            cursor: pointer;
          }

          .add_step {
            flex: 1;
            input {
              padding: 0 0 1px 3px;
              font-size: 14px;
            }
          }
        }

        li {
          display: flex;
          align-items: center;
          padding: 5px 6px;
          font-size: 14px;
          border-radius: 3px;
          background-color: var(--primaryColor);
          color: white;
          margin-bottom: 2px;

          span {
            font-size: 14px;
            flex: 1;
          }

          svg {
            font-size: 16px;
            cursor: pointer;
          }
        }
      }
    }

    .bottom_action {
      width: 100%;
      margin-bottom: 0;
      box-shadow: 0 -1px 3px 0 #dfdede;

      height: ${BOX_HEIGHT.bottom};

      padding: 0 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #8c8b8b;
      span {
        font-size: 11px;
      }

      svg {
        font-size: 20px;
        cursor: pointer;
      }
    }
  }
`;

const TaskConfigPanel = (props) => {
  const { show, info, onChange, onClose, onDelete } = props;
  const [formData, setFormData] = useState({});
  const [addStepName, setAddStepName] = useState("");

  useEffect(() => {
    setFormData({
      ...{
        id: "",
        title: "",
        finished: false,
        important: false,
        date: "",
        steps: [],
        updateTime: "",
      },
      ...info,
    });
  }, [info]);

  // done:表单值更新
  const valueChange = (e) => {
    setFormData((prew) => {
      let newValue = e.target
        ? {
            ...prew,
            [e.target.name]: e.target.value,
          }
        : { ...e };
      newValue.updateTime = formatTime(new Date(), "YYYY-MM-DD HH:mm:ss");

      // onChange({ ...newValue });
      return newValue;
    });
  };

  const enterStepName = (e) => {
    // 回车
    if (e.which === 13) {
      addStep();
      setAddStepName("");
    }
  };

  // done: 添加步骤
  const addStep = () => {
    if (addStepName.trim().length !== 0) {
      valueChange({
        ...formData,
        steps: [
          ...formData.steps,
          {
            label: addStepName,
          },
        ],
      });

      setAddStepName("");
    }
  };

  // done: 删除步骤
  const delStep = (index) => {
    let steps = formData.steps;
    steps.splice(index, 1);
    valueChange({
      ...formData,
      steps,
    });
  };

  // done: 关闭编辑
  const closeEdit = () => {
    onChange({ ...formData });
    onClose();
  };

  return (
    <DrawerWrapper open={show} onClose={closeEdit} anchor="right">
      {/* {JSON.stringify(formData)} */}
      <div className="whole_wrapper">
        {/* 头部标题 */}
        <div className="top_header">
          <LocalFireDepartment className="title_icon" />

          <TextField
            placeholder="任务标题"
            name="title"
            value={formData.title}
            variant="standard"
            onChange={valueChange}
            className="title_field"
          />

          {formData.important ? (
            <Star
              sx={{ color: "var(--warningColor)" }}
              onClick={() => valueChange({ ...formData, important: false })}
            />
          ) : (
            <StarBorder
              onClick={() => valueChange({ ...formData, important: true })}
            />
          )}
        </div>

        <div className="form_wrapper">
          <div className="steps">
            <span>步骤</span>
            <div className="add_row">
              <Add onClick={addStep} />

              {/*  */}
              <TextField
                className="add_step"
                size="small"
                value={addStepName}
                onKeyDown={enterStepName}
                onChange={(e) => setAddStepName(e.target.value)}
                variant="standard"
              />
            </div>

            {/* 步骤列表 */}
            <ul>
              {formData.steps &&
                formData.steps.map((step, index) => {
                  return (
                    <li key={index}>
                      <span>
                        {index + 1}、{step.label}
                      </span>
                      <Close onClick={() => delStep(index)} />
                    </li>
                  );
                })}
            </ul>
          </div>

          {/* 时间选择 */}
          <TextField
            placeholder="截止时间"
            name="date"
            type="date"
            size="small"
            value={formData.date}
            onChange={valueChange}
          />

          <TextField
            name="remark"
            size="small"
            value={formData.remark}
            onChange={valueChange}
            multiline
            rows={3}
            placeholder="任务备注"
          />
        </div>

        <div className="bottom_action">
          <ChevronRight onClick={closeEdit} />
          <span style={{ display: formData.updateTime ? "block" : "none" }}>
            编辑于{formData.updateTime}
          </span>
          <DeleteForever onClick={onDelete} />
        </div>
      </div>
    </DrawerWrapper>
  );
};

export default TaskConfigPanel;
