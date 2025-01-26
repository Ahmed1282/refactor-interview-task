"use client";

import { useState, ChangeEvent } from "react";

export type Issue = {
  id: string;
  name: string;
  message: string;
  status: "open" | "resolved";
  numEvents: number;
  numUsers: number;
  value: number;
};

type TableProps = {
  issues: Issue[];
};

const Table = ({ issues }: TableProps) => {
  // State for tracking checkbox states
  const [checkedState, setCheckedState] = useState(
    issues.map(issue => ({
      checked: false,
      backgroundColor: "#ffffff",
    }))
  );

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [totalSelectedValue, setTotalSelectedValue] = useState(0);

  /**
   * Handles individual checkbox changes.
   */
  const handleCheckboxChange = (index: number): void => {
    const updatedState = checkedState.map((state, idx) => {
      if (index === idx) {
        return {
          ...state,
          checked: !state.checked,
          backgroundColor: state.checked ? "#ffffff" : "#eeeeee",
        };
      }
      return state;
    });

    setCheckedState(updatedState);
    updateTotalSelectedValue(updatedState);
    updateSelectAllState(updatedState);
  };

  /**
   * Updates the total value of selected issues.
   */
  const updateTotalSelectedValue = (state: typeof checkedState): void => {
    const total = state.reduce((sum, currentState, index) => {
      return currentState.checked && issues[index].status === "open"
        ? sum + issues[index].value
        : sum;
    }, 0);
    setTotalSelectedValue(total);
  };

  /**
   * Updates the select-all checkbox's state.
   */
  const updateSelectAllState = (state: typeof checkedState): void => {
    const openIssuesCount = issues.filter(issue => issue.status === "open").length;
    const selectedCount = state.filter(s => s.checked).length;

    setSelectAllChecked(selectedCount === openIssuesCount);

    const selectAllCheckbox = document.getElementById("select-all") as HTMLInputElement | null;
    if (selectAllCheckbox) {
      selectAllCheckbox.indeterminate = selectedCount > 0 && selectedCount < openIssuesCount;
    }
  };

  /**
   * Handles the select/deselect all checkbox.
   */
  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>): void => {
    const { checked } = event.target;
    const updatedState = issues.map(issue => {
      if (issue.status === "open") {
        return { checked, backgroundColor: checked ? "#eeeeee" : "#ffffff" };
      }
      return { checked: false, backgroundColor: "#ffffff" };
    });

    setCheckedState(updatedState);
    updateTotalSelectedValue(updatedState);
    setSelectAllChecked(checked);
  };

  return (
    <table className="w-full border-collapse shadow-lg">
      <thead>
        <tr className="border-2 border-gray-200">
          <th className="py-6 pl-6 text-left w-[48px]">
            <input
              id="select-all"
              className="w-5 h-5 cursor-pointer"
              type="checkbox"
              checked={selectAllChecked}
              onChange={handleSelectAll}
            />
          </th>
          <th className="py-6 min-w-[8rem] text-left text-black">
            {totalSelectedValue ? `Selected ${totalSelectedValue}` : "None selected"}
          </th>
          <th colSpan={2} />
        </tr>
        <tr className="border-2 border-gray-200">
          <th className="py-6 pl-6" />
          <th className="py-6 text-left font-medium text-black">Name</th>
          <th className="py-6 text-left font-medium text-black">Message</th>
          <th className="py-6 text-left font-medium text-black">Status</th>
        </tr>
      </thead>
      <tbody>
        {issues.map(({ name, message, status }, index) => {
          const isOpen = status === "open";
          const rowClass = `
            border-b border-gray-200
            ${isOpen ? "cursor-pointer hover:bg-blue-50 text-black" : "text-gray-600 cursor-not-allowed"}
            ${checkedState[index].checked ? "bg-blue-50" : ""}`;

          return (
            <tr
              key={index}
              className={rowClass}
              onClick={isOpen ? () => handleCheckboxChange(index) : undefined}
            >
              <td className="py-6 pl-6">
                <input
                  className="w-5 h-5 cursor-pointer"
                  type="checkbox"
                  disabled={!isOpen}
                  checked={checkedState[index].checked}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              <td className="py-6">{name}</td>
              <td className="py-6">{message}</td>
              <td className="py-6">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-[15px] h-[15px] rounded-full ${
                      isOpen ? "bg-blue-600" : "bg-gray-400"
                    }`}
                  />
                  <span className={`font-medium ${isOpen ? "text-blue-700" : "text-gray-700"}`}>
                    {isOpen ? "Open" : "Resolved"}
                  </span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;