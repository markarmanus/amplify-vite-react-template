import React from "react";

interface CheckboxProps {
  onClick: () => void;
  boxChecked: boolean;
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ onClick, boxChecked, label }) => {
  return (
    <div onClick={onClick}>
      <input
        type="checkbox"
        value="greenEggs"
        style={{ margin: "5px" }}
        checked={boxChecked}
        readOnly
      />
      <label style={{ color: "#c1c1c1" }}>{label}</label>
    </div>
  );
};

export default Checkbox;
