type InputProps = {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
  required?: boolean;
  disabled?: boolean;
};

const Input = ({
  type = "text",
  placeholder = "Enter text",
  value,
  onChange,
  style,
  required = false,
  disabled = false,
}: InputProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    ref?: React.Ref<HTMLInputElement>;
  }) => {
  return (
    <input
      disabled={disabled}
      onChange={onChange}
      required={required}
      style={{
        paddingLeft: "5px",
        ...style,
      }}
      className="border border-gray-300 rounded-md"
      type={type}
      placeholder={placeholder}
      value={value}
    />
  );
};

export default Input;
