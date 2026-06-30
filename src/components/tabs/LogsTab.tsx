import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Search, FileText, ClipboardList, Send, Sliders } from 'lucide-react';
import { ChannelSidebar } from '../layout/ChannelSidebar';

export const LogsTab: React.FC = () => {
  const { logs, activeChannel } = useApp();

  // Active Logger tab: operation, publish, push
  const [logTab, setLogTab] = useState<'operation' | 'publish' | 'push'>('operation');

  // Search input
  const [logSearch, setLogSearch] = useState('');
  
  // Type Dropdown filter
  const [selectedLogType, setSelectedLogType] = useState('');

  // Filter logs appropriately
  const filteredLogs = logs.filter(log => {
    // Channel filter
    if (log.channel && log.channel !== activeChannel) return false;
    // 1. Group by Logger Sub-Tab
    if (logTab === 'publish') {
      // Publish logs are only "发布" types
      if (log.type !== '发布') return false;
    } else if (logTab === 'push') {
      // Push logs are "推送" types
      if (log.type !== '推送') return false;
    } else {
      // Operation logs show general operational logs
      // Including edit, delete, create, upload, copy, system
      if (log.type === '推送') return false; // Put push in its own tab
    }

    // 2. Text Search Match
    if (logSearch && !log.content.toLowerCase().includes(logSearch.toLowerCase())) {
      return false;
    }

    // 3. Dropdown type match
    if (selectedLogType && log.type !== selectedLogType) {
      return false;
    }

    return true;
  });

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-48px)] bg-slate-50 text-slate-800 text-xs">

      {/* Left sidebar - Channel layout */}
      <ChannelSidebar />

      {/* Logs central sheet */}
      <div className="flex-1 flex flex-col overflow-hidden text-xs">
        
        {/* Top Logs subtabs */}
        <div className="bg-white border-b border-slate-200 px-6 h-12 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-8 h-full select-none">
            <button
              id="logtab-operation"
              onClick={() => setLogTab('operation')}
              className={`h-full px-2 font-medium border-b-2 flex items-center gap-1 cursor-pointer transition-all ${logTab === 'operation' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              操作日志
            </button>
            <button
              id="logtab-publish"
              onClick={() => setLogTab('publish')}
              className={`h-full px-2 font-medium border-b-2 flex items-center gap-1 cursor-pointer transition-all ${logTab === 'publish' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              发布日志
            </button>
            <button
              id="logtab-push"
              onClick={() => setLogTab('push')}
              className={`h-full px-2 font-medium border-b-2 flex items-center gap-1 cursor-pointer transition-all ${logTab === 'push' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              推送日志
            </button>
          </div>
        </div>

        {/* Filters exactly matching Screenshot 4 */}
        <div className="bg-white border-b border-slate-100 p-4 shrink-0 flex flex-wrap items-center gap-2 select-none">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              id="search-log-input"
              type="text"
              placeholder="搜索操作内容"
              value={logSearch}
              onChange={e => setLogSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs w-56 focus:outline-hidden focus:border-blue-500 focus:bg-white text-slate-750 text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <select
            id="log-type-filter"
            value={selectedLogType}
            onChange={e => setSelectedLogType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 focus:outline-hidden focus:border-blue-500 w-36"
          >
            <option value="">操作类型</option>
            <option value="发布">发布 (Publish)</option>
            <option value="上传">上传 (Upload)</option>
            <option value="复制">复制 (Copy)</option>
            <option value="编辑">编辑 (Modify)</option>
            <option value="删除">删除 (Delete)</option>
            <option value="推送">推送 (Push)</option>
            <option value="系统">系统 (System)</option>
          </select>

          <button
            id="log-query-btn"
            onClick={() => alert(`已完成 ${logTab === 'operation' ? '操作' : logTab === 'publish' ? '发布' : '推送'} 日志筛选`)}
            className="px-4 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded cursor-pointer flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" /> 查询
          </button>

          {(logSearch || selectedLogType) && (
            <button
              onClick={() => {
                setLogSearch('');
                setSelectedLogType('');
              }}
              className="px-3 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs rounded cursor-pointer"
            >
              重置
            </button>
          )}
        </div>

        {/* Log table spreadsheet list */}
        <div className="flex-1 overflow-auto p-4 bg-slate-50">
          <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold select-none text-[11px]">
                  <th className="p-3 w-20 text-center">类型</th>
                  <th className="p-3">操作内容</th>
                  <th className="p-3 w-28">操作者</th>
                  <th className="p-3 w-28">目标类型</th>
                  <th className="p-3 text-center w-28">结果</th>
                  <th className="p-3 text-center w-48">时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-12 text-slate-400">
                      无对应类型或关键字的日志内容
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-55/35 hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 text-center">
                        <span className={`inline-flex px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold uppercase
                          ${log.type === '发布' ? 'bg-blue-50 text-blue-600 border border-blue-200' : ''}
                          ${log.type === '上传' ? 'bg-[#f0fdf4] text-emerald-600 border border-emerald-200' : ''}
                          ${log.type === '复制' ? 'bg-orange-50 text-orange-600 border border-orange-200' : ''}
                          ${log.type === '删除' ? 'bg-rose-50 text-rose-600 border border-rose-200' : ''}
                          ${log.type === '编辑' ? 'bg-purple-50 text-purple-600 border border-purple-25' : ''}
                          ${log.type === '推送' ? 'bg-[#ecfdf5] text-teal-600 border border-teal-200' : ''}
                          ${log.type === '系统' ? 'bg-slate-100 text-slate-600 border border-slate-200' : ''}
                        `}>
                          {log.type}
                        </span>
                      </td>
                      <td className="p-3 text-slate-800 break-all select-all font-medium font-sans max-w-xl">
                        {log.content}
                      </td>
                      <td className="p-3 text-slate-600 font-mono font-medium">{log.operator || 'admin'}</td>
                      <td className="p-3 text-slate-500 font-mono text-[11px] font-medium">{log.targetType}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] rounded-[3px] font-semibold select-none
                          ${log.result === '成功' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : ''}
                          ${log.result === '发布中' ? 'bg-orange-55/7 bg-amber-50 text-orange-600 border border-orange-200' : ''}
                          ${log.result === '草稿' ? 'bg-slate-100 text-slate-500 border border-slate-250' : ''}
                          ${log.result === '失败' ? 'bg-rose-50 text-rose-600 border border-rose-200 font-bold' : ''}
                        `}>
                          {log.result}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 font-mono text-[11px] text-center">{log.createdAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
