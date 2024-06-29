import React from "react";

const SubsTableItem = ({ email, date, mongoId, deleteEmail }) => {
  const emailDate = new Date(date);

  return (
    <tr className="bg-white border-b">
      <td className="px-6 py-4">{email}</td>
      <td className="px-6 py-4 hidden sm:block">{emailDate.toDateString()}</td>
      <td className="px-6 py-4">
        <button
          className="text-blue-500 hover:underline"
          onClick={() => deleteEmail(mongoId)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default SubsTableItem;
