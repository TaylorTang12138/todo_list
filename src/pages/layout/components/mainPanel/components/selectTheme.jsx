import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import styled from "@emotion/styled";
import { defaultBgList } from "../config";

const CustomDialog = styled(Dialog)`
  .MuiDialogTitle-root,
  .MuiDialogContent-root {
    font-size: 18px;
    padding: 5px;
  }

  .MuiDialogContent-root {
    padding: 0 10px 5px 10px;
    font-size: 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .bg {
      width: calc((100% - 40px) / 5);
      font-size: 0;
      border-radius: 3px;
      overflow: hidden;

      img {
        width: 100%;
        transition: transform 0.1s linear;
        cursor: pointer;
      }

      &:hover {
        img {
          transform: scale(1.05);
        }
      }

      &[select="true"] {
        border: 1px solid var(--primaryColor);
      }
    }
  }

  .MuiDialogActions-root {
  }

  .MuiButtonBase-root {
    border: 1px solid red;
    font-size: 14px;
    padding: 3px 10px;
  }
`;

const SelectThemeDialog = (props) => {
  const { onClose, onConfirm, show } = props;

  return (
    <CustomDialog open={show} onClose={onClose}>
      <DialogTitle className="title">选择主题</DialogTitle>
      <DialogContent className="content">
        {defaultBgList.map((bg, index) => {
          return (
            <div className="bg" key={index} onClick={() => onConfirm(bg)}>
              <img src={bg.img} alt=""></img>
            </div>
          );
        })}
      </DialogContent>
    </CustomDialog>
  );
};

export default SelectThemeDialog;
