# Resolve Modal Bypass (User-Test Mode)

## What was changed
For a user test on 2026-04-28, the "What would you like to do next?" resolution
picker modal was bypassed. Clicking **Sign off** now resolves the record
immediately as `no-action` without showing the modal.

## Where the modal code lives
- **Modal component**: `src/app/components/resolution/ResolvePickerModal.tsx`
- **Modal rendered in**: `src/app/App.tsx` — look for `<ResolvePickerModal ...>`
  and the `resolvingRecordId` / `onStartResolve` wiring

## How to re-enable the modal flow

In `src/app/components/detail/DetailPanel.tsx`, find `SignOffToggle`'s `onSignOff`
prop inside the card header (search for `onSignOff`). It currently reads:

```tsx
onSignOff={() =>
  resolveRecord(record.id, {
    kind: 'no-action',
    at: new Date().toISOString(),
    byId: currentUserId,
  })
}
```

Restore it to:

```tsx
onSignOff={() => onStartResolve(record.id)}
```

That routes the click back through `App.tsx`'s `onStartResolve` handler, which
sets `resolvingRecordId` and opens `<ResolvePickerModal>`.

You can also remove the `resolveRecord` store subscription that was added to
`DetailPanel` at the same time (the line `const resolveRecord = useAppStore(…)`),
since it is only needed for the bypass path.
