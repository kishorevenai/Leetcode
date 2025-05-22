export type TypographyProps = {
  variant?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
};

const CustomTypography = ({
  variant = "p",
  children,
  style,
  onClick = () => {},
}: TypographyProps) => {
  const variants: any = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-bold",
    h3: "text-2xl font-bold",
    h4: "text-xl font-bold",
    h5: "text-lg font-bold",
    h6: "text-base font-bold",
    p: "text-base",
    span: "inline",
  };

  const className = variants[variant] || variants.p;

  return (
    <span onClick={onClick} style={style} className={`${className}`}>
      {children}
    </span>
  );
};

export default CustomTypography;
