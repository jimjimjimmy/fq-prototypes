import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, ChevronRight, ChevronDown, FileText, Download, Clock } from 'lucide-react';
import svgPaths from "../imports/svg-ni0ebo43wn";

export function AIWorkspaceLinear({ task, isSignedOff, onSignOff, onDismiss, onJournalEntrySubmitted }: any) {
  const [showEvidence, setShowEvidence] = useState(true); // Changed to true - show by default
  const [showDraftJE, setShowDraftJE] = useState(false);

  const handleSubmitJournalEntry = () => {
    // Notify parent that journal entry has been submitted
    if (onJournalEntrySubmitted) {
      onJournalEntrySubmitted();
    }
    onSignOff();
  };

  return (
    <div className="bg-white rounded-[12px] border border-[#d6eae2] relative overflow-hidden shadow-[0px_2px_8px_rgba(0,51,42,0.04)] bg-[#ffffffcc]">
      {/* Decorative radial gradients */}
      <div className="absolute h-[792px] left-[192px] top-[-542px] w-[880px] pointer-events-none">
        <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 880 792">
          <ellipse cx="440" cy="396" fill="url(#paint0_radial_ai_card)" fillOpacity="0.3" rx="440" ry="396" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(440 396) rotate(90) scale(396 440)" gradientUnits="userSpaceOnUse" id="paint0_radial_ai_card" r="1">
              <stop stopColor="#00332A" stopOpacity="0.8" />
              <stop offset="1" stopColor="#037460" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute left-[565px] size-[301px] top-[-146px] pointer-events-none">
        <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 301 301">
          <circle cx="150.5" cy="150.5" fill="url(#paint0_radial_ai_card_2)" fillOpacity="0.3" r="150.5" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(150.5 150.5) rotate(90) scale(150.5)" gradientUnits="userSpaceOnUse" id="paint0_radial_ai_card_2" r="1">
              <stop stopColor="#47BB8E" stopOpacity="0.7" />
              <stop offset="1" stopColor="#95BAA7" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10">
        {!isSignedOff ? (
          <div className="flex flex-col">
            {/* Fixed Header */}
            <div className="px-[32px] pt-[28px] pb-[20px] shrink-0">
              <div className="flex items-center gap-[10px]">
                <div className="relative rounded-[8px] shrink-0 size-[32px] flex items-center justify-center px-[6px] py-[5px]" style={{ backgroundImage: "linear-gradient(214.789deg, rgba(144, 227, 154, 0.4) 42.983%, rgb(234, 254, 237) 86.879%)"}}>
                  <svg className="block size-[20px]" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
                    <path d={svgPaths.pc737900} fill="#01392F" />
                  </svg>
                </div>
                <div>
                  <p className="font-['Inter',sans-serif] font-semibold leading-[16px] text-[10.5px] text-[#047857] tracking-[0.3px] uppercase">
                    AI Workspace
                  </p>
                  <p className="font-['Inter',sans-serif] font-medium leading-[16px] text-[11px] text-[#475467]">
                    Review AI-prepared work
                  </p>
                </div>
              </div>
            </div>

            {/* Content Area - No max height constraint */}
            <div className="px-[32px] pb-[24px] space-y-[22px]">
              {/* Why This Surfaced - ONE LINE */}
              <div>
                <p className="font-['Inter',sans-serif] font-semibold text-[11px] text-[#667085] mb-[6px] uppercase tracking-[0.4px]">
                  Why This Surfaced
                </p>
                <p className="font-['Inter',sans-serif] font-medium text-[13px] leading-[18px] text-[#475467]">
                  Surfaced because this variance blocks consolidation eliminations and downstream board reporting.
                </p>
              </div>

              {/* AI Verified - Compact Checklist */}
              <div>
                <p className="font-['Inter',sans-serif] font-semibold text-[11px] text-[#667085] mb-[8px] uppercase tracking-[0.4px]">
                  Agent Prepared
                </p>
                <div className="space-y-[5px]">
                  <div className="flex items-start gap-[8px]">
                    <Sparkles className="w-[13px] h-[13px] text-[#047857] shrink-0 mt-[2px]" />
                    <p className="font-['Inter',sans-serif] font-medium text-[12px] leading-[17px] text-[#475467]">
                      Discrepancy detected between UK invoice and US ledger
                    </p>
                  </div>
                  <div className="flex items-start gap-[8px]">
                    <Sparkles className="w-[13px] h-[13px] text-[#047857] shrink-0 mt-[2px]" />
                    <p className="font-['Inter',sans-serif] font-medium text-[12px] leading-[17px] text-[#475467]">
                      Draft journal entry prepared
                    </p>
                  </div>
                  <div className="flex items-start gap-[8px]">
                    <Sparkles className="w-[13px] h-[13px] text-[#047857] shrink-0 mt-[2px]" />
                    <p className="font-['Inter',sans-serif] font-medium text-[12px] leading-[17px] text-[#475467]">
                      Supporting evidence attached
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Prepared - Artifacts Only */}
              <div>
                <p className="font-['Inter',sans-serif] font-semibold text-[11px] text-[#667085] mb-[8px] uppercase tracking-[0.4px]">
                  Actionable Next Steps
                </p>
                <div className="space-y-[5px]">
                  <div className="flex items-start gap-[8px]">
                    <p className="font-['Inter',sans-serif] font-medium text-[12px] leading-[17px] text-[#475467]">
                      1. Validate Discrepancy: Confirm the variance evidence below
                    </p>
                  </div>
                  <div className="flex items-start gap-[8px]">
                    <p className="font-['Inter',sans-serif] font-medium text-[12px] leading-[17px] text-[#475467]">
                      2. Review Entry Details: Check account, amount, and details for accuracy
                    </p>
                  </div>
                  <div className="flex items-start gap-[8px]">
                    <p className="font-['Inter',sans-serif] font-medium text-[12px] leading-[17px] text-[#475467]">
                      3. Submit Journal Entry: Submit journal entry for approval and ERP posting
                    </p>
                  </div>
                </div>
              </div>

              {/* Supporting Documents Links */}
              <div className="mb-[20px] space-y-[8px]">{/* Collapsible Evidence Summary */}
                <div>
                  <button
                    onClick={() => setShowEvidence(!showEvidence)}
                    className="w-full flex items-center justify-between px-[16px] py-[12px] hover:bg-[#f9fafb] rounded-[8px] transition-colors group"
                  >
                    <div className="flex items-center gap-[8px]">
                      <ChevronRight className={`w-[14px] h-[14px] text-[#667085] transition-transform ${showEvidence ? 'rotate-90' : ''}`} />
                      <span className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#101828]">
                        Evidence Summary
                      </span>
                      <span className="px-[6px] py-[1px] bg-[rgba(4,120,87,0.1)] text-[#047857] rounded-[4px] font-['Inter',sans-serif] font-semibold text-[11px] capitalize">
                        Agent Prepared
                      </span>
                    </div>
                    <span className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af] group-hover:text-[#667085]">
                      Mar 1, 2026
                    </span>
                  </button>

                  <AnimatePresence>
                    {showEvidence && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-[16px] py-[16px] bg-[#f9fafb] rounded-[8px] mt-[8px]">
                          {task.supportingEvidence && task.supportingEvidence.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mb-[16px]">
                              {task.supportingEvidence.map((section: any, idx: number) => (
                                <div key={idx}>
                                  <p className="font-['Inter',sans-serif] font-semibold text-[10.5px] text-[#667085] uppercase tracking-[0.4px] mb-[10px]">
                                    {section.section}
                                  </p>
                                  <div className="space-y-[6px]">
                                    {section.items.map((item: any, itemIdx: number) => (
                                      <div key={itemIdx}>
                                        <p className="font-['Inter',sans-serif] font-medium text-[10px] text-[#9ca3af] mb-[2px]">
                                          {item.label}
                                        </p>
                                        <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#101828] whitespace-pre-wrap">
                                          {item.value}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Variance Highlight */}
                          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[6px] p-[12px]">
                            <div className="flex items-start gap-[8px]">
                              
                              <div>
                                <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#166534] mb-[3px]">
                                  Variance Analysis Complete
                                </p>
                                <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#166534] leading-[16px]">
                                  Expected amount matches actual ledger entry. FX calculation validated at 1.30 GBP/USD per Reuters feed.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Draft JE Accordion */}
                <div>
                  <button
                    onClick={() => setShowDraftJE(!showDraftJE)}
                    className="w-full flex items-center justify-between px-[16px] py-[12px] hover:bg-[#f9fafb] rounded-[8px] transition-colors group"
                  >
                    <div className="flex items-center gap-[8px]">
                      <ChevronRight className={`w-[14px] h-[14px] text-[#667085] transition-transform ${showDraftJE ? 'rotate-90' : ''}`} />
                      <span className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#101828]">
                        Draft Journal Entry
                      </span>
                      <span className="px-[6px] py-[1px] bg-[rgba(4,120,87,0.1)] text-[#047857] rounded-[4px] font-['Inter',sans-serif] font-semibold text-[11px]">
                        Agent Prepared
                      </span>
                    </div>
                    <span className="font-['Inter',sans-serif] font-medium text-[11px] text-[#9ca3af] group-hover:text-[#667085]">
                      Mar 1, 2026
                    </span>
                  </button>

                  <AnimatePresence>
                    {showDraftJE && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-[16px] py-[16px] bg-[#f9fafb] rounded-[8px] mt-[8px]">
                          {/* JE Header */}
                          <div className="grid grid-cols-3 gap-[20px] mb-[20px] pb-[16px] border-b border-[#e5e7eb]">
                            <div>
                              <p className="font-['Inter',sans-serif] font-medium text-[10px] text-[#9ca3af] mb-[4px]">
                                Entry Date
                              </p>
                              <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#101828]">
                                Jan 31, 2026
                              </p>
                            </div>
                            <div>
                              <p className="font-['Inter',sans-serif] font-medium text-[10px] text-[#9ca3af] mb-[4px]">
                                Entry Type
                              </p>
                              <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#101828]">
                                Intercompany Bridge
                              </p>
                            </div>
                            <div>
                              <p className="font-['Inter',sans-serif] font-medium text-[10px] text-[#9ca3af] mb-[4px]">
                                Status
                              </p>
                              <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#047857]">
                                Draft — Pending Review
                              </p>
                            </div>
                          </div>

                          {/* JE Lines */}
                          <div className="space-y-[2px] mb-[16px]">
                            {/* Header Row */}
                            <div className="grid grid-cols-[2fr_1fr_1fr] gap-[12px] px-[12px] py-[8px] bg-white rounded-t-[6px]">
                              <p className="font-['Inter',sans-serif] font-semibold text-[10px] text-[#9ca3af] uppercase tracking-[0.5px]">
                                Account
                              </p>
                              <p className="font-['Inter',sans-serif] font-semibold text-[10px] text-[#9ca3af] uppercase tracking-[0.5px] text-right">
                                Debit
                              </p>
                              <p className="font-['Inter',sans-serif] font-semibold text-[10px] text-[#9ca3af] uppercase tracking-[0.5px] text-right">
                                Credit
                              </p>
                            </div>

                            {/* Line 1 */}
                            <div className="grid grid-cols-[2fr_1fr_1fr] gap-[12px] px-[12px] py-[10px] bg-white">
                              <div>
                                <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#101828]">
                                  7000-IC-UK
                                </p>
                                <p className="font-['Inter',sans-serif] font-medium text-[10.5px] text-[#9ca3af]">
                                  Intercompany Receivable — UK
                                </p>
                              </div>
                              <p className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#101828] text-right">
                                $31,850.00
                              </p>
                              <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#d1d5db] text-right">
                                —
                              </p>
                            </div>

                            {/* Line 2 */}
                            <div className="grid grid-cols-[2fr_1fr_1fr] gap-[12px] px-[12px] py-[10px] bg-white">
                              <div>
                                <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#101828]">
                                  7100-IC-US
                                </p>
                                <p className="font-['Inter',sans-serif] font-medium text-[10.5px] text-[#9ca3af]">
                                  Intercompany Payable — US
                                </p>
                              </div>
                              <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#d1d5db] text-right">
                                —
                              </p>
                              <p className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#101828] text-right">
                                $31,850.00
                              </p>
                            </div>

                            {/* Totals Row */}
                            <div className="grid grid-cols-[2fr_1fr_1fr] gap-[12px] px-[12px] py-[8px] bg-white rounded-b-[6px] border-t-[2px] border-t-[#e5e7eb]">
                              <p className="font-['Inter',sans-serif] font-semibold text-[11.5px] text-[#101828]">
                                Total
                              </p>
                              <p className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#101828] text-right">
                                $31,850.00
                              </p>
                              <p className="font-['Inter',sans-serif] font-semibold text-[13px] text-[#101828] text-right">
                                $31,850.00
                              </p>
                            </div>
                          </div>

                          {/* Description */}
                          

                          {/* Export Button */}
                          <div className="flex items-center justify-end mt-[16px] pt-[16px] border-t border-[#e5e7eb]">
                            <button className="flex items-center gap-[6px] px-[12px] py-[7px] bg-white hover:bg-[#f3f4f6] border border-[#e5e7eb] rounded-[6px] transition-colors">
                              <Download className="w-[14px] h-[14px] text-[#667085]" />
                              <span className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#667085]">
                                Export JE
                              </span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Progress Toward Sign-Off Signal */}
              <div className="mb-[14px] px-[4px]">
                <div className="flex items-start gap-[10px]">
                  <div className="flex-1">
                    <p className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[21px] text-[#101828] mb-[2px]">
                      Ready to proceed?
                    </p>
                    <p className="font-['Inter',sans-serif] font-medium text-[12px] leading-[18px] text-[#667085]">
                      Review the evidence and draft JE above before signing off
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Impact Clarity */}
              <div className="mb-[16px] px-[14px] py-[12px] bg-[rgba(4,120,87,0.04)] border border-[rgba(4,120,87,0.12)] rounded-[8px]">
                <p className="font-['Inter',sans-serif] font-semibold text-[11.5px] leading-[17px] text-[#065f46]">
                  Submitting this entry resolves the $31,850.00 variance, advances three downstream tasks, saves approximately 2.5 hours of cycle time, and routes the item to Michael Chen for final approval.
                </p>
              </div>

              <div className="flex items-center gap-[12px]">
                <button
                  onClick={handleSubmitJournalEntry}
                  className="h-[42px] px-[24px] bg-[#00332a] hover:bg-[#01221b] rounded-[8px] transition-colors"
                >
                  <p className="font-['Inter',sans-serif] font-semibold text-[14px] text-white">
                    Submit Journal Entry
                  </p>
                </button>
                <button
                  onClick={onDismiss}
                  className="px-[20px] h-[42px] hover:bg-[#f3f4f6] rounded-[8px] transition-colors"
                >
                  <p className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#475467]">
                    Dismiss
                  </p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-[32px] py-[40px]"
          >
             {/* Success State */}
            <div className="flex flex-col items-center text-center mb-[28px]">
              <div className="w-[56px] h-[56px] rounded-full bg-[#f0fdf4] flex items-center justify-center mb-[14px]">
                <Check className="w-[28px] h-[28px] text-[#047857]" />
              </div>
              <p className="font-['Inter',sans-serif] font-semibold text-[16px] text-[#101828] mb-[6px]">
                Journal Entry Submitted
              </p>
              <p className="font-['Inter',sans-serif] font-medium text-[13px] text-[#667085]">
                Posted to January 2026 close
              </p>
            </div>

            {/* Workflow Impact Summary */}
            <div className="bg-[#f9fafb] rounded-[10px] border border-[#e5e7eb] p-[20px] mb-[20px]">
              <p className="font-['Inter',sans-serif] font-semibold text-[11px] text-[#667085] uppercase tracking-[0.4px] mb-[14px]">
                Workflow Impact
              </p>
              <div className="space-y-[10px]">
                <div className="flex items-start gap-[10px]">
                  <div className="w-[20px] h-[20px] rounded-full bg-[#047857] flex items-center justify-center shrink-0 mt-[1px]">
                    <Check className="w-[12px] h-[12px] text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#101828] mb-[2px]">
                      Entry Posted to GL
                    </p>
                    <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#667085] leading-[15px]">
                      Journal entry JE-2026-0147 posted to January 2026 period
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-[10px]">
                  <div className="w-[20px] h-[20px] rounded-full bg-[#047857] flex items-center justify-center shrink-0 mt-[1px]">
                    <Check className="w-[12px] h-[12px] text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#101828] mb-[2px]">
                      Downstream Tasks Unblocked
                    </p>
                    <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#667085] leading-[15px]">
                      Consolidation eliminations and board reporting can now proceed
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-[10px]">
                  <div className="w-[20px] h-[20px] rounded-[4px] bg-[rgba(245,158,11,0.08)] flex items-center justify-center shrink-0 mt-[1px]">
                    <Clock className="w-[12px] h-[12px] text-[#f59e0b]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#101828] mb-[2px]">
                      Routed for Reviewer Approval
                    </p>
                    <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#667085] leading-[15px]">
                      Assigned to Michael Chen for final review
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-[8px] justify-center">
              <div className="flex items-center gap-[4px]">
                <div className="w-[5px] h-[5px] rounded-full bg-[#047857]" />
                <div className="w-[5px] h-[5px] rounded-full bg-[#047857]" />
                <div className="w-[5px] h-[5px] rounded-full bg-[#047857]" />
              </div>
              <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#667085]">
                Task complete — once signed off, this will route to the next approver.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}