import Avatar from '@floqastinc/flow-ui_core/Avatar';
import AvatarGroup from '@floqastinc/flow-ui_core/AvatarGroup';
import AutoAwesome from '@floqastinc/flow-ui_icons/material/AutoAwesome';

export default function AssigneeDisplay({ assignees }: { assignees: string[] | undefined }) {
  if (!assignees || assignees.length === 0) {
    return <span className="text-xs" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>—</span>;
  }

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const firstAssignee = assignees[0];
  const secondAssignee = assignees[1];
  const remainingCount = assignees.length - 1;

  return (
    <div className="flex items-center gap-2">
      <AvatarGroup stacked orientation="vertical">
        {firstAssignee === 'Dynamic Assignment' ? (
          <Avatar icon={<AutoAwesome size={14} />} size="sm" />
        ) : (
          <Avatar fallback={getInitials(firstAssignee)} size="sm" />
        )}
        {assignees.length > 1 && secondAssignee && (
          secondAssignee === 'Dynamic Assignment' ? (
            <Avatar icon={<AutoAwesome size={14} />} size="sm" />
          ) : (
            <Avatar fallback={getInitials(secondAssignee)} size="sm" />
          )
        )}
      </AvatarGroup>
      <div className="flex flex-col items-start gap-1">
        <span className="text-sm" style={{ color: 'var(--flo-sem-color-text-default)' }}>{firstAssignee}</span>
        {remainingCount > 0 && (
          <span className="text-xs" style={{ color: 'var(--flo-base-color-blue-600)' }}>+{remainingCount} Assignee{remainingCount > 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  );
}
