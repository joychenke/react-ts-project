import { Form, Input, Modal, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import { TaskTypeSelect } from "components/task-type-select";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useEditTask } from "utils/task";
import { useTasksModal, useTasksQueryKey } from "./util";

// 设置左边文字和右边表单的样式
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

// 修改任务内容的模态框
export const TaskModal = () => {
  const [form] = useForm();
  const {
    editingTaskId,
    close,
    editingTask,
    isLoading: isEditingTaskLoading,
  } = useTasksModal();
  const { mutateAsync: editTask, isLoading: editLoading } = useEditTask(
    useTasksQueryKey()
  );

  // 关闭时，先关掉，然后重置数据
  const onCancel = () => {
    close();
    form.resetFields();
  };

  // 确定时，将输入的内容覆盖掉查到的详情
  const onOk = async () => {
    editTask({ ...editingTask, ...form.getFieldsValue() });
    close();
  };

  // 当form 或者 editingTask改变时，更新form的数据
  useEffect(() => {
    form.setFieldsValue(editingTask);
  }, [form, editingTask]);

  // form表单，任务名、经办人、类型
  return (
    <Modal
      forceRender={true}
      onCancel={onCancel}
      onOk={onOk}
      visible={!!editingTaskId}
      cancelText={"取消"}
      confirmLoading={editLoading}
      okText={"确认"}
      title={"编辑"}
    >
      {isEditingTaskLoading ? (
        <div style={{ textAlign: "center" }}>
          <Spin size={"large"}></Spin>
        </div>
      ) : (
        <Form {...layout} form={form} initialValues={editingTask}>
          <Form.Item
            label={"任务名"}
            name={"name"}
            rules={[{ required: true, message: "请输入任务名" }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item label={"经办人"} name={"processorId"}>
            <UserSelect defaultOptionName={"经办人"}></UserSelect>
          </Form.Item>
          <Form.Item label={"类型"} name={"typeId"}>
            <TaskTypeSelect></TaskTypeSelect>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};
