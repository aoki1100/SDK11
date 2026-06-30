import React, { useRef, useEffect } from 'react';

interface WeekHourGridProps {
  value: boolean[][]; // 7 days x 24 hours
  onChange: (newValue: boolean[][]) => void;
}

export function WeekHourGrid({ value, onChange }: WeekHourGridProps) {
  const isDragging = useRef(false);
  const dragMode = useRef<boolean>(true); // true = select, false = deselect

  const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

  const handleMouseDown = (r: number, c: number) => {
    isDragging.current = true;
    const currentVal = value[r]?.[c] ?? false;
    const newMode = !currentVal;
    dragMode.current = newMode;

    const updated = value.map((rowArr, rowIndex) =>
      rowArr.map((cellVal, colIndex) =>
        rowIndex === r && colIndex === c ? newMode : cellVal
      )
    );
    onChange(updated);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (!isDragging.current) return;

    const updated = value.map((rowArr, rowIndex) =>
      rowArr.map((cellVal, colIndex) =>
        rowIndex === r && colIndex === c ? dragMode.current : cellVal
      )
    );
    onChange(updated);
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      isDragging.current = false;
    };
    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => {
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, []);

  // Quick Action: Invert Selection
  const handleInvert = () => {
    const updated = value.map(rowArr => rowArr.map(cellVal => !cellVal));
    onChange(updated);
  };

  // Quick Action: Clear
  const handleClear = () => {
    const updated = Array.from({ length: 7 }, () => Array(24).fill(false));
    onChange(updated);
  };

  // Row selection toggle (Clicking a day label)
  const handleRowClick = (rowIndex: number) => {
    // If all cells are true, set to all false; otherwise set all to true
    const allSelected = value[rowIndex].every(v => v);
    const updated = value.map((rowArr, rIdx) =>
      rIdx === rowIndex ? Array(24).fill(!allSelected) : rowArr
    );
    onChange(updated);
  };

  // Column selection toggle (Clicking an hour header)
  const handleColClick = (colIndex: number) => {
    // If all cells in this column are true, set to false; otherwise true
    const allSelected = value.every(row => row[colIndex]);
    const updated = value.map(rowArr =>
      rowArr.map((cellVal, cIdx) => (cIdx === colIndex ? !allSelected : cellVal))
    );
    onChange(updated);
  };

  return (
    <div className="mt-3 bg-white border border-slate-200 rounded p-4 max-w-[850px] font-sans select-none shadow-2xs">
      <div className="overflow-x-auto">
        <table className="border-collapse border border-slate-250 text-center text-[11px] leading-none w-full min-w-[720px]">
          <thead>
            {/* Header Row 1: Split into 00:00 - 12:00 and 12:00 - 24:00 */}
            <tr>
              <th
                rowSpan={2}
                className="border border-slate-250 bg-slate-50 text-slate-700 font-extrabold w-[80px] h-[48px] select-none text-center"
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="font-bold">星期/时间</span>
                </div>
              </th>
              <th
                colSpan={12}
                className="border border-slate-250 bg-slate-50 text-slate-800 font-extrabold h-[24px] tracking-wide"
              >
                00:00 - 12:00
              </th>
              <th
                colSpan={12}
                className="border border-slate-250 bg-slate-50 text-slate-800 font-extrabold h-[24px] tracking-wide"
              >
                12:00 - 24:00
              </th>
            </tr>
            {/* Header Row 2: Hours 0-23 */}
            <tr>
              {Array.from({ length: 24 }).map((_, i) => (
                <th
                  key={i}
                  onClick={() => handleColClick(i)}
                  className="border border-slate-250 bg-slate-50 hover:bg-slate-100 hover:text-blue-600 text-slate-800 font-extrabold w-[26px] h-[24px] cursor-pointer transition-colors"
                  title={`点击选择/取消选择第 ${i} 小时`}
                >
                  {i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((dayName, rIdx) => (
              <tr key={dayName}>
                {/* Row Header: Day Name */}
                <td
                  onClick={() => handleRowClick(rIdx)}
                  className="border border-slate-250 bg-slate-50 hover:bg-slate-100 hover:text-blue-600 text-slate-800 font-bold h-[28px] cursor-pointer transition-colors text-center"
                  title={`点击选择/取消选择 ${dayName} 整天`}
                >
                  {dayName}
                </td>
                {/* Cells for each Hour */}
                {Array.from({ length: 24 }).map((_, cIdx) => {
                  const isSelected = value[rIdx]?.[cIdx] ?? false;
                  return (
                    <td
                      key={cIdx}
                      onMouseDown={() => handleMouseDown(rIdx, cIdx)}
                      onMouseEnter={() => handleMouseEnter(rIdx, cIdx)}
                      className={`border border-slate-200 cursor-pointer h-[28px] transition-all ${
                        isSelected
                          ? 'bg-blue-500 hover:bg-blue-600 shadow-inner'
                          : 'bg-slate-100/40 hover:bg-slate-200/50'
                      }`}
                      title={`${dayName} ${cIdx}:00 - ${cIdx + 1}:00`}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer controls & legend */}
      <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500 select-none">
        {/* Legend on Left */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-slate-100/40 border border-slate-200 rounded-sm inline-block"></span>
            <span>未选</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-blue-500 border border-blue-600 rounded-sm inline-block"></span>
            <span>已选</span>
          </div>
          <div className="text-slate-400 pl-2">
            可拖动鼠标选择时间段
          </div>
        </div>

        {/* Buttons on Right */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleInvert}
            className="text-blue-600 hover:text-blue-700 hover:underline font-bold transition-all"
          >
            反选
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="text-blue-600 hover:text-blue-700 hover:underline font-bold transition-all"
          >
            清空
          </button>
        </div>
      </div>
    </div>
  );
}
