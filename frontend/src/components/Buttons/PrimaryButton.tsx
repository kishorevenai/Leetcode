type InputProps = {
  type?: string | any;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  disabled?: boolean;
};

import { Button } from "antd";

const PrimaryButton = ({
  type = "button",
  value,
  onClick,
  children,
  style,
  disabled,
}: InputProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>;
  }): InputProps => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      value={value}
      type={type}
      style={{
        width: "100%",
        backgroundColor: "grey",
        color: "white",
        fontSize: "12px",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
