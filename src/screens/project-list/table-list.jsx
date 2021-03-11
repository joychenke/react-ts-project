export const TableList = ({list, users}) => {
  return (
  <table>
    <thead>
      <tr>
        <th>名称</th>
        <th>负责人</th>
      </tr>
    </thead>
    <tbody>
      {list.map(data => (
      <tr key={data.id}>
        <td>{data.name}</td>
        <td>{users.find(user => user.id === data.personId)?.name || "未知"}</td>
      </tr>))}
    </tbody>
  </table>);
}