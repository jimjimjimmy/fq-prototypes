import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { getTeamMember, currentUserId } from '../../../data/team';
import { ConfirmDialog } from './ConfirmDialog';
import { DiscardChangesDialog } from '../rules/DiscardChangesDialog';

const EMPTY: never[] = [];


function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  });
  return `${date} | ${time}`;
}

interface Props {
  recordId: string;
}

/**
 * Comments card — collapsible, matching the ActivityCard pattern.
 *
 *   - Clickable header with "Comments (N)" count + chevron toggle
 *   - Expanded body: stacked comment list + compose input at the bottom
 *   - Starts collapsed by default
 */
export function CommentsCard({ recordId }: Props) {
  const [expanded, setExpanded] = useState(true);

  const commentsMap = useAppStore((s) => s.comments);
  const comments = useMemo(
    () => commentsMap[recordId] ?? (EMPTY as never[]),
    [commentsMap, recordId],
  );
  const postComment = useAppStore((s) => s.postComment);
  const editComment = useAppStore((s) => s.editComment);
  const deleteComment = useAppStore((s) => s.deleteComment);
  const currentUser = getTeamMember(currentUserId);
  const [value, setValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showEditDiscard, setShowEditDiscard] = useState(false);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    postComment(recordId, trimmed);
    setValue('');
  };

  return (
    <div className="overflow-hidden rounded-md border border-[#e1e6ef] bg-white">
      {/* Collapsed header — always visible, click to toggle */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="group flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <span className="font-header text-base font-bold leading-5 text-[#1d2433]">
          Comments
          {comments.length > 0 && (
            <span className="font-normal"> ({comments.length})</span>
          )}
        </span>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#6b7280] group-hover:bg-neutral-100 group-hover:text-neutral-900">
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      </button>

      {/* Header divider — only when expanded, otherwise it doubles up
           with the card's bottom border on a collapsed card. */}
      {expanded && <div className="border-t border-[#e1e6ef]" />}

      {/* Expanded body */}
      {expanded && (
        <div className="px-6 pt-4">
          {/* Empty state — single quiet line, matches the
               Activity Log empty state for consistency. */}
          {comments.length === 0 && (
            <p className="mb-4 py-5 text-center font-['Inter'] text-xs font-normal leading-4 text-[#6b7280]">
              No comments yet
            </p>
          )}

          {/* Comment list */}
          {comments.length > 0 && (
            <div className="mb-4 space-y-5">
              {comments.map((comment) => {
                const isOwn = comment.authorId === currentUserId;
                const isEditing = editingId === comment.id;
                return (
                  <div key={comment.id} className="group flex gap-3">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="h-7 w-7 shrink-0 rounded-full border border-neutral-200 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex flex-col">
                          <p className="font-['Inter'] text-xs font-semibold leading-[18px] text-[#1b1f27]">
                            {comment.author}
                          </p>
                          <span className="font-['Inter'] text-[10px] font-medium leading-[14px] text-[#6b7280]">
                            {formatDateTime(comment.at)}
                            {comment.editedAt && ' · Edited'}
                          </span>
                        </div>
                        {isOwn && !isEditing && (
                          <div className="ml-auto flex items-center gap-1">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                title="Edit comment"
                                onClick={() => { setEditingId(comment.id); setEditValue(comment.text); }}
                                className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Delete comment"
                                onClick={() => setConfirmDeleteId(comment.id)}
                                className="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      {isEditing ? (
                        <div className="flex flex-col rounded-md border border-[#3d7bf7] bg-white p-2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                e.preventDefault();
                                const trimmed = editValue.trim();
                                if (trimmed) editComment(recordId, comment.id, trimmed);
                                setEditingId(null);
                              }
                              if (e.key === 'Escape') {
                                if (editValue.trim() !== comment.text) {
                                  setShowEditDiscard(true);
                                } else {
                                  setEditingId(null);
                                }
                              }
                            }}
                            ref={(el) => {
                              if (el) {
                                el.focus();
                                el.setSelectionRange(el.value.length, el.value.length);
                              }
                            }}
                            rows={3}
                            className="w-full resize-none font-['Inter'] text-xs font-normal leading-[18px] text-[#1d2433] placeholder:text-[#adb2bb] focus:outline-none"
                          />
                          <div className="mt-2 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (editValue.trim() !== comment.text) {
                                  setShowEditDiscard(true);
                                } else {
                                  setEditingId(null);
                                }
                              }}
                              className="inline-flex h-8 items-center justify-center rounded-md px-3 font-header text-xs font-bold leading-4 text-[#6b7280] hover:bg-neutral-100"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={!editValue.trim() || editValue.trim() === comment.text}
                              onClick={() => {
                                const trimmed = editValue.trim();
                                if (trimmed && trimmed !== comment.text) {
                                  editComment(recordId, comment.id, trimmed);
                                }
                                setEditingId(null);
                              }}
                              className="inline-flex h-8 items-center justify-center rounded-md bg-[#1FAC76] px-3 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749] disabled:cursor-not-allowed disabled:bg-[#1FAC76]/30"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="font-['Inter'] text-xs font-normal leading-[18px] text-[#1d2433]">
                          {comment.text}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Compose — light gray background, full-width strip */}
          <div className="-mx-6 mt-2 border-t border-[#e1e6ef] bg-[#f8fafc] px-6 py-4">
            <div className="flex gap-2">
              {currentUser && (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-7 w-7 shrink-0 rounded-full border border-neutral-200 object-cover"
                />
              )}
              <div className="flex flex-1 items-center gap-2 rounded-md border border-[#e1e6ef] bg-white p-1 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors focus-within:border-[#3d7bf7]">
                <textarea
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    // Auto-grow as the user types: reset to single-row
                    // height first so shrinking works, then expand to fit
                    // the content's scrollHeight up to a sensible cap.
                    const el = e.target;
                    el.style.height = 'auto';
                    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  placeholder="Reply"
                  rows={1}
                  className="block min-h-8 w-full resize-none self-stretch overflow-hidden bg-transparent px-2 py-[7px] font-['Inter'] text-xs font-normal leading-[18px] text-[#1d2433] placeholder:text-[#adb2bb] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={submit}
                  disabled={!value.trim()}
                  className="inline-flex h-8 shrink-0 items-center justify-center self-end rounded-md bg-[#1FAC76] px-3 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749] disabled:cursor-not-allowed disabled:bg-[#1FAC76]/30"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          if (confirmDeleteId) deleteComment(recordId, confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
      {showEditDiscard && (
        <DiscardChangesDialog
          onKeepEditing={() => setShowEditDiscard(false)}
          onDiscard={() => {
            setShowEditDiscard(false);
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
}
