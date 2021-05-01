import { Select } from "antd";
import { Raw } from "types";

type SelectProps = React.ComponentProps<typeof Select>;

// 将自己定义的props从SelectProps中删掉
// 不知
interface IdSelectProps
  extends Omit<SelectProps, "value" | "onChange" | "options"> {
  value: Raw | null | undefined;
  onChange: (value?: number) => void; // onChange的入参如果存在，都是number类型
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}
/**
 * value 可以传入多种类型的值
 * onChange 只会回调 number|undefined类型
 * 当isNaN(Number(value)) 为true的时候，代表选择默认类型
 * 当选择默认类型的时候，onChange会回调undefined
 * @param props
 */
export const IdSelect = (props: IdSelectProps) => {
  const { value, onChange, defaultOptionName, options, ...restProps } = props;
  return (
    <Select
      // options取到的时候，传value；没取到，传0
      value={options?.length ? toNumber(value) : 0}
      onChange={(value) => onChange(toNumber(value) || undefined)}
      {...restProps}
    >
      {defaultOptionName ? (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      ) : null}
      {options?.map((option) => (
        <Select.Option value={option.id} key={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};

const toNumber = (value: unknown) => (isNaN(Number(value)) ? 0 : Number(value));
