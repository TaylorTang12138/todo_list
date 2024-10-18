import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { TextField } from "@mui/material";
import { Add, FormatListBulleted } from "@mui/icons-material";
// PostAdd

import { getAllCustomGroup, addGroup } from "../../../../api/group";
import { staticGroup } from "./conifg";

const HEIGHTS = {
  userInfoHeight: "105px",
  actionAreaHeight: "25px",
};

const SideWrapper = styled.div`
  width: 200px;
  height: 100vh;
  background-color: var(--borderColor);
  padding: 10px 10px 10px 10px;

  /* background-color: #e9ebec; */

  .user_info {
    padding: 10px 0;
    height: ${HEIGHTS.userInfoHeight};
    /* border: 1px solid red; */
    .search_input {
      margin-top: 5px;
      .MuiInputBase-input {
        padding: 0;
      }
    }
  }
  p {
    color: #605e5c;
  }
  h3,
  p {
    margin: 0;
  }
  /* 
  ::webkit-scrollbar {
    display: none;
  } */

  .all_group_wrapper {
    height: calc(
      100vh - ${HEIGHTS.actionAreaHeight} - ${HEIGHTS.userInfoHeight} - 20px
    );
    /* border: 1px solid red; */
    font-size: 13px;
    scrollbar-width: none;
    overflow-y: scroll;

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .group_list,
    .custom_list {
      margin: 0;
      padding: 0 0 10px 0;
      border-bottom: 1px solid #b9b9bf;
      li {
        cursor: pointer;
        padding: 3px 0;
        margin-bottom: 3px;
        display: flex;
        align-items: center;
        transition: border-bottom-right-radius 0.1s linear;

        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }

        img {
          width: 19px;
          margin: 0 5px;
          transition: transform 0.2s linear;
        }

        &[active="true"] {
          background-color: var(--primaryColor);
          border-bottom-right-radius: 20px;
          color: white;
          img {
            transform: scale(1.2);
          }
        }
      }
    }

    .custom_list {
      border-bottom: none;
      margin-top: 7px;

      .tag {
        display: inline-block;
        width: 0;
        /* width: 20px; */
        height: 100%;
        overflow: hidden;
        transition: width 0.1s linear;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      li[active="true"] {
        background-color: var(--successColor);
        border-bottom-right-radius: 0;

        .tag {
          width: 20px !important;
          text-align: center;
        }
      }
    }
  }

  .action_area {
    font-size: 13px;
    height: ${HEIGHTS.actionAreaHeight};
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* border: 1px solid red; */

    > * {
      cursor: pointer;
    }
    span {
      display: flex;
      align-items: center;
    }
  }
`;

const SideBar = (props) => {
  const { changeGroup, changeSearchValue } = props;
  const [customGroup, setCustomGroup] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selGroup, setSelGroup] = useState("day");
  const [selCustomGroup, setselCustomGroup] = useState("");

  useEffect(() => {
    getCustomGroup();
  }, []);

  // done: 获取所有自定义组
  const getCustomGroup = async () => {
    const { data } = await getAllCustomGroup();
    setCustomGroup(data.list);
  };

  // done: 添加自定义列表组
  const addCustomGroup = async () => {
    const { message } = await addGroup({
      label: "无标题列表_" + (customGroup.length + 1),
      type: `custom_${Math.random()}`,
    });

    if (message === "success") {
      getCustomGroup();
    }
  };

  return (
    <SideWrapper>
      <div className="user_info no_drag">
        <h3>Development✨</h3>
        {/* <p>xxxxxxx@qq.com</p> */}
        <TextField
          label="search"
          variant="standard"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            changeSearchValue(e.target.value);
          }}
        />
      </div>
      <div className="all_group_wrapper no_drag">
        <ul className="group_list">
          {staticGroup.map((item) => {
            return (
              <li
                key={item.type}
                active={(item.type === selGroup).toString()}
                onClick={() => {
                  changeGroup(item);
                  setSelGroup(item.type);
                }}
              >
                <img src={item.img} alt="" />
                {item.label}
              </li>
            );
          })}
        </ul>

        <ul
          className="custom_list"
          style={{ display: customGroup.length > 0 ? "block" : "none" }}
        >
          {customGroup.map((item) => {
            return (
              <li
                key={item.type}
                active={(item.type === selCustomGroup).toString()}
                onClick={() => {
                  changeGroup(item);
                  setselCustomGroup(item.type);
                }}
              >
                <span className="tag">
                  {/* {" "} */}
                  {/* &gt; */}
                  <FormatListBulleted sx={{ fontSize: 15 }} />
                </span>
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="action_area no_drag">
        <span onClick={addCustomGroup}>
          <Add sx={{ fontSize: 18 }}></Add>
          新建列表
        </span>
        {/* <PostAdd sx={{ fontSize: 18 }} /> */}
      </div>
    </SideWrapper>
  );
};

export default SideBar;
