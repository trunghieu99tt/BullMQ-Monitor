import JSONInput from "react-json-editor-ajrm";
import { dark_vscode_tribute, localeEn } from "../../constants/json-editor";

import classes from "./json-editor.module.css";

type Props = {
  data: any;
  onChange?: (data: any) => void;
};

const JSONEditor = ({ data, onChange }: Props) => {
  const onChangeData = (data: any) => {
    onChange &&
      typeof onChange === "function" &&
      onChange((data?.json && JSON.parse(data.json)) || {});
  };

  return (
    <div className={classes.root}>
      <JSONInput
        placeholder={data}
        onChange={onChangeData}
        viewOnly={!!!onChange}
        locale={localeEn}
        colors={dark_vscode_tribute}
        width="100%"
      />
    </div>
  );
};

export default JSONEditor;
