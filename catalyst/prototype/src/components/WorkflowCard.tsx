import { useState } from 'react';
import { motion } from 'motion/react';
import { ListChecks, GitBranch, Check, AlertCircle, Link2 } from 'lucide-react';

interface WorkflowCardProps {
  task: any;
}

export function WorkflowCard({ task }: WorkflowCardProps) {
  const [activeTab, setActiveTab] = useState<'work' | 'dependencies'>('work');

  // Calculate progress
  const completedSubtasks = task.subtasks.filter((s: any) => s.status === 'complete').length;
  const totalSubtasks = task.subtasks.length;
  const progressPercent = Math.round((completedSubtasks / totalSubtasks) * 100);

  // Group dependencies
  const upstreamDeps = task.dependencies.filter((d: any) => d.type === 'blocked-by');
  const blockingDeps = task.dependencies.filter((d: any) => d.type === 'blocking');
  const relatedDeps = task.dependencies.filter((d: any) => d.type === 'related-to');

  return (
    <div className="bg-white/90 rounded-[12px] border border-white/60 shadow-[0px_2px_8px_rgba(0,51,42,0.04)] overflow-hidden flex flex-col max-h-[500px] bg-[#ffffffe6]">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#e5e7eb] shrink-0">
        <button
          onClick={() => setActiveTab('work')}
          className={`flex-1 px-[16px] py-[12px] font-['Inter',sans-serif] font-semibold text-[12px] transition-all relative ${
            activeTab === 'work'
              ? 'text-[#047857]'
              : 'text-[#667085] hover:text-[#101828]'
          }`}
        >
          <div className="flex items-center justify-center gap-[5px]">
            <ListChecks className="w-[13px] h-[13px]" />
            Subtasks
            <span className="px-[4px] py-[0.5px] bg-[#f3f4f6] text-[#667085] rounded-[3px] font-['Inter',sans-serif] font-semibold text-[9.5px]">
              {task.subtasks.length}
            </span>
          </div>
          {activeTab === 'work' && (
            <motion.div
              layoutId="workflowTab"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#047857]"
              initial={false}
              transition={{ duration: 0.2 }}
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('dependencies')}
          className={`flex-1 px-[16px] py-[12px] font-['Inter',sans-serif] font-semibold text-[12px] transition-all relative ${
            activeTab === 'dependencies'
              ? 'text-[#047857]'
              : 'text-[#667085] hover:text-[#101828]'
          }`}
        >
          <div className="flex items-center justify-center gap-[5px]">
            <GitBranch className="w-[13px] h-[13px]" />
            Dependencies
            <span className="px-[4px] py-[0.5px] bg-[#f3f4f6] text-[#667085] rounded-[3px] font-['Inter',sans-serif] font-semibold text-[9.5px]">
              {task.dependencies.length}
            </span>
          </div>
          {activeTab === 'dependencies' && (
            <motion.div
              layoutId="workflowTab"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#047857]"
              initial={false}
              transition={{ duration: 0.2 }}
            />
          )}
        </button>
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-[20px]">
        {activeTab === 'work' ? (
          <div>
            {/* Work Section - Execution Steps */}
            <div className="flex items-center justify-between mb-[14px]">
              <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#667085]">
                Execution steps owned by accountants
              </p>
              <div className="flex items-center gap-[6px]">
                <div className="w-[70px] h-[5px] bg-[#f3f4f6] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#047857] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="font-['Inter',sans-serif] font-semibold text-[10.5px] text-[#667085]">
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </div>
            </div>

            <div className="space-y-[5px]">
              {task.subtasks.map((subtask: any) => (
                <div
                  key={subtask.id}
                  className="flex items-start gap-[9px] px-[10px] py-[9px] hover:bg-[#f9fafb] rounded-[7px] transition-colors group"
                >
                  <div className="pt-[2px]">
                    {subtask.status === 'complete' ? (
                      <div className="w-[15px] h-[15px] rounded-full bg-[#047857] flex items-center justify-center">
                        <Check className="w-[9px] h-[9px] text-white" />
                      </div>
                    ) : subtask.status === 'in-progress' ? (
                      <div className="w-[15px] h-[15px] rounded-full border-[2px] border-[#f59e0b] bg-white flex items-center justify-center">
                        <div className="w-[5px] h-[5px] rounded-full bg-[#f59e0b]" />
                      </div>
                    ) : (
                      <div className="w-[15px] h-[15px] rounded-full border-[2px] border-[#d1d5db] bg-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`font-['Inter',sans-serif] font-medium text-[12px] leading-[16px] mb-[4px] ${
                      subtask.status === 'complete' ? 'text-[#9ca3af] line-through' : 'text-[#101828]'
                    }`}>
                      {subtask.title}
                    </p>
                    <div className="flex items-center gap-[7px]">
                      <div className="flex items-center gap-[4px]">
                        <div className="w-[18px] h-[18px] rounded-[4px] bg-gradient-to-b from-[#005133] to-[#0a3b33] flex items-center justify-center">
                          <p className="font-['Inter',sans-serif] font-semibold text-[8.5px] text-[#c0e8d7]">
                            {subtask.assigneeInitials}
                          </p>
                        </div>
                        <span className="font-['Inter',sans-serif] font-medium text-[10px] text-[#667085]">
                          {subtask.assignee}
                        </span>
                      </div>
                      <span className="text-[#d1d5db]">·</span>
                      <span className="font-['Inter',sans-serif] font-medium text-[10px] text-[#9ca3af]">
                        Due {subtask.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Dependencies Section - Workflow Context */}
            <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#667085] mb-[14px]">
              Workflow relationships and context
            </p>

            <div className="space-y-[16px]">
              {/* Upstream Complete */}
              {upstreamDeps.length > 0 && (
                <div>
                  <div className="font-['Inter',sans-serif] font-semibold text-[10.5px] text-[#667085] uppercase tracking-[0.4px] mb-[8px] flex items-center gap-[5px]">
                    <div className="w-[3px] h-[3px] rounded-full bg-[#047857]" />
                    Upstream Complete
                  </div>
                  <div className="space-y-[4px]">
                    {upstreamDeps.map((dep: any) => (
                      <div
                        key={dep.id}
                        className="flex items-start gap-[8px] px-[10px] py-[8px] bg-[#f9fafb] rounded-[6px]"
                      >
                        <div className="w-[18px] h-[18px] rounded-[4px] bg-[#f0fdf4] flex items-center justify-center shrink-0 mt-[1px]">
                          <Check className="w-[10px] h-[10px] text-[#047857]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#101828] mb-[3px]">
                            {dep.taskName}
                          </p>
                          <div className="flex items-center gap-[4px]">
                            <div className="w-[18px] h-[18px] rounded-[4px] bg-gradient-to-b from-[#005133] to-[#0a3b33] flex items-center justify-center">
                              <p className="font-['Inter',sans-serif] font-semibold text-[8.5px] text-[#c0e8d7]">
                                {dep.assigneeInitials}
                              </p>
                            </div>
                            <span className="font-['Inter',sans-serif] font-medium text-[10px] text-[#667085]">
                              {dep.assignee}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blocking */}
              {blockingDeps.length > 0 && (
                <div>
                  <div className="font-['Inter',sans-serif] font-semibold text-[10.5px] text-[#667085] uppercase tracking-[0.4px] mb-[8px] flex items-center gap-[5px]">
                    <div className="w-[3px] h-[3px] rounded-full bg-[#dc2626]" />
                    Blocking
                  </div>
                  <div className="space-y-[4px]">
                    {blockingDeps.map((dep: any) => (
                      <div
                        key={dep.id}
                        className="flex items-start gap-[8px] px-[10px] py-[8px] bg-[#fef2f2] rounded-[6px]"
                      >
                        <div className="w-[18px] h-[18px] rounded-[4px] bg-white border border-[#fecaca] flex items-center justify-center shrink-0 mt-[1px]">
                          <AlertCircle className="w-[10px] h-[10px] text-[#dc2626]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#101828] mb-[3px]">
                            {dep.taskName}
                          </p>
                          <div className="flex items-center gap-[4px]">
                            <div className="w-[18px] h-[18px] rounded-[4px] bg-gradient-to-b from-[#005133] to-[#0a3b33] flex items-center justify-center">
                              <p className="font-['Inter',sans-serif] font-semibold text-[8.5px] text-[#c0e8d7]">
                                {dep.assigneeInitials}
                              </p>
                            </div>
                            <span className="font-['Inter',sans-serif] font-medium text-[10px] text-[#667085]">
                              {dep.assignee}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related */}
              {relatedDeps.length > 0 && (
                <div>
                  <div className="font-['Inter',sans-serif] font-semibold text-[10.5px] text-[#667085] uppercase tracking-[0.4px] mb-[8px] flex items-center gap-[5px]">
                    <div className="w-[3px] h-[3px] rounded-full bg-[#667085]" />
                    Related
                  </div>
                  <div className="space-y-[4px]">
                    {relatedDeps.map((dep: any) => (
                      <div
                        key={dep.id}
                        className="flex items-start gap-[8px] px-[10px] py-[8px] bg-[#f9fafb] rounded-[6px]"
                      >
                        <div className="w-[18px] h-[18px] rounded-[4px] bg-white border border-[#e5e7eb] flex items-center justify-center shrink-0 mt-[1px]">
                          <Link2 className="w-[10px] h-[10px] text-[#667085]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#101828] mb-[3px]">
                            {dep.taskName}
                          </p>
                          <div className="flex items-center gap-[4px]">
                            <div className="w-[18px] h-[18px] rounded-[4px] bg-gradient-to-b from-[#005133] to-[#0a3b33] flex items-center justify-center">
                              <p className="font-['Inter',sans-serif] font-semibold text-[8.5px] text-[#c0e8d7]">
                                {dep.assigneeInitials}
                              </p>
                            </div>
                            <span className="font-['Inter',sans-serif] font-medium text-[10px] text-[#667085]">
                              {dep.assignee}
                            </span>
                            <span className="text-[#d1d5db]">·</span>
                            <span className={`font-['Inter',sans-serif] font-medium text-[10px] ${
                              dep.status === 'complete' ? 'text-[#047857]' : 
                              dep.status === 'in-progress' ? 'text-[#f59e0b]' : 'text-[#9ca3af]'
                            }`}>
                              {dep.status === 'complete' ? 'Complete' : dep.status === 'in-progress' ? 'In Progress' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}