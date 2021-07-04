import React, { ReactNode } from "react";
import {
  Draggable,
  DraggableProps,
  Droppable,
  DroppableProps,
  DroppableProvided,
  DroppableProvidedProps,
} from "react-beautiful-dnd";

// 去掉DroppableProps自身的children属性(从index.d.ts中可以看到，它的类型是一个函数)，添加自己定义的children属性(它的类型是ReactNode型)
type DropProps = Omit<DroppableProps, "children"> & { children: ReactNode };

export const Drop = ({ children, ...props }: DropProps) => {
  // 本地没有安装types文件时，是没有代码提示的 yarn add @types/react-beautiful-dnd -D
  return (
    <Droppable {...props}>
      {(provided) => {
        if (React.isValidElement(children)) {
          // children 是Drop的子元素，cloneElement的第二个参数是给元素加props
          // 连贯起来： 将children元素克隆一下，并且在克隆后的元素上加上props
          // 加了props后，子元素children不用在显示的传递props
          return React.cloneElement(children, {
            ...provided.droppableProps,
            ref: provided.innerRef,
            provided,
          });
        }
        return <div></div>;
      }}
    </Droppable>
  );
};

// DroppableProvided 是 provided的类型； DroppableProvidedProps 是 droppableProps 的类型
type DropChildProps = Partial<
  { provided: DroppableProvided } & DroppableProvidedProps
> &
  React.HTMLAttributes<HTMLDivElement>;

// forwardRef 让用户可以传入ref属性
export const DropChild = React.forwardRef<HTMLDivElement, DropChildProps>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
      {props.provided?.placeholder}
    </div>
  )
);

type DragProps = Omit<DraggableProps, "children"> & { children: ReactNode };
export const Drag = ({ children, ...props }: DragProps) => {
  return (
    <Draggable {...props}>
      {(provided) => {
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            ...provided.draggableProps,
            ...provided.dragHandleProps,
            ref: provided.innerRef,
          });
        }
        return <div></div>;
      }}
    </Draggable>
  );
};
