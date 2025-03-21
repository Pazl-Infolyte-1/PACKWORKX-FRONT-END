const UserTable = ({ users }) => (
  <div className="mt-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
    <h2 className="text-xl font-semibold mb-4">Existing Users</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            {['Name', 'Role', 'Email', 'Phone', 'Permissions'].map((header) => (
              <th key={header} className="py-3 px-4 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm">
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
              {['name', 'role', 'email', 'phone', 'permissions'].map((field) => (
                <td key={field} className="py-3 px-4">{user[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default UserTable;