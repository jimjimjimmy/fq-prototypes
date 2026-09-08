import { useState } from 'react'
import { IconButton, Input } from '@floqastinc/flow-ui_core'
import ExpandMore from '@floqastinc/flow-ui_icons/material/ExpandMore'
import { FormDropdownField } from '../../FormDropdownField'
import { RevealTransition } from '../RevealTransition'
import { SectionHeader } from './SectionHeader'
import { GENERAL_CURRENCY_OPTIONS, type GeneralSettingsState } from '../addGroupTypes'

const DEFAULT_THRESHOLD = '100.00'

interface GeneralSettingsSectionProps {
  settings: GeneralSettingsState
  onChange: (settings: GeneralSettingsState) => void
}

export function GeneralSettingsSection({ settings, onChange }: GeneralSettingsSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<GeneralSettingsState>(settings)

  const startEditing = () => {
    setDraft(settings)
    setIsEditing(true)
  }
  const cancel = () => setIsEditing(false)
  const done = () => {
    onChange(draft)
    setIsEditing(false)
  }
  const hasChanges = JSON.stringify(draft) !== JSON.stringify(settings)

  const options: { label: string; value: string }[] = [
    { label: 'Currency:', value: settings.currency ? settings.currency.toUpperCase() : '-' },
    // Rec Type isn't part of General Settings editing per Figma - display only, not editable here.
    { label: 'Rec Type:', value: 'AutoRec Disabled' },
    { label: 'Fixed Balance:', value: settings.fixedBalance ? `$${settings.fixedBalance}` : 'NA' },
    { label: 'Threshold:', value: settings.threshold ? `$${settings.threshold}` : 'NA' },
  ]

  return (
    <div className="flex flex-col gap-[4px] w-full">
      <SectionHeader
        label="General Settings"
        isEditing={isEditing}
        doneDisabled={!hasChanges}
        onEdit={startEditing}
        onCancel={cancel}
        onDone={done}
      />

      <RevealTransition show={!isEditing}>
        <div className="border border-solid border-[#e1e6ef] rounded-[4px] flex flex-col gap-[4px] p-[16px] w-full">
          {options.map((option) => (
            <div key={option.label} className="flex gap-[4px] items-start w-full text-[12px] leading-[18px]">
              <p className="font-semibold text-[rgba(29,36,51,0.9)] max-w-[88px] shrink-0">{option.label}</p>
              <p className="text-[#1d2433]">{option.value}</p>
            </div>
          ))}
        </div>
      </RevealTransition>

      <RevealTransition show={isEditing}>
        <div className="border border-solid border-[#e1e6ef] rounded-[6px] flex flex-col gap-[16px] items-start p-[16px] w-full">
          <div className="w-full">
            <FormDropdownField
              label="Currency"
              placeholder="Select currency"
              options={GENERAL_CURRENCY_OPTIONS}
              value={draft.currency}
              onChange={(v) => setDraft((prev) => ({ ...prev, currency: v }))}
            />
          </div>

          <div className="flex flex-col gap-[4px] w-full">
            <div className="flex gap-[8px] items-end w-full">
              <div className="flex items-center justify-center h-[40px] w-[32px] rounded-[6px] border border-solid border-[#e1e6ef] bg-[#f8fafc] text-[12px] text-[#6b7280] shrink-0">
                $
              </div>
              <div className="flex-1 min-w-0">
                <Input
                  label="Threshold"
                  placeholder="0.00"
                  value={draft.threshold}
                  onChange={(v) => setDraft((prev) => ({ ...prev, threshold: v }))}
                />
              </div>
              <IconButton size="md" onClick={() => {}}>
                <ExpandMore className="size-[20px]" />
              </IconButton>
            </div>
            <div className="flex gap-[8px] items-center justify-end w-full">
              <button type="button" className="text-[11px] font-semibold text-[#6b7280] underline" onClick={() => {}}>
                More Options
              </button>
              <div className="h-[12px] w-px bg-[#e1e6ef]" />
              <button
                type="button"
                className="text-[11px] font-semibold text-[#6b7280] underline"
                onClick={() => setDraft((prev) => ({ ...prev, threshold: DEFAULT_THRESHOLD }))}
              >
                Use default
              </button>
            </div>
          </div>

          <div className="flex gap-[8px] items-end w-full">
            <div className="flex items-center justify-center h-[40px] w-[32px] rounded-[6px] border border-solid border-[#e1e6ef] bg-[#f8fafc] text-[12px] text-[#6b7280] shrink-0">
              $
            </div>
            <div className="flex-1 min-w-0">
              <Input
                label="Fixed Balance"
                placeholder="0.00"
                value={draft.fixedBalance}
                onChange={(v) => setDraft((prev) => ({ ...prev, fixedBalance: v }))}
              />
            </div>
          </div>
        </div>
      </RevealTransition>
    </div>
  )
}
