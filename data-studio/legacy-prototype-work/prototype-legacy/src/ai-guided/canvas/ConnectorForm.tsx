import { useState } from 'react'
import { Button, Input, Heading } from '@floqastinc/flow-ui_core'
import { CONNECTOR_FORM_DEFAULTS } from '../script/scenario'
import { useAIGuided } from '../state/AIGuidedContext'
import type { Connector } from '../types'

type Props = {
  onCancel: () => void
  onCreated: (connector: Connector) => void
}

export default function ConnectorForm({ onCancel, onCreated }: Props) {
  const { addConnector } = useAIGuided()
  const [name, setName] = useState(CONNECTOR_FORM_DEFAULTS.name)
  const [host, setHost] = useState(CONNECTOR_FORM_DEFAULTS.host)
  const [filePattern, setFilePattern] = useState(CONNECTOR_FORM_DEFAULTS.filePattern)
  const canCreate = name.trim() !== '' && host.trim() !== '' && filePattern.trim() !== ''

  const handleCreate = () => {
    const connector: Connector = {
      id: `conn-${Date.now()}`,
      name,
      type: 'sftp',
      status: 'connected',
      host,
      filePattern,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    addConnector(connector)
    onCreated(connector)
  }

  return (
    <div className="max-w-[560px]">
      <div className="mb-6">
        <Heading variant="md">New SFTP Connector</Heading>
        <p className="text-[13px] text-[#6b7280] mt-1 leading-[1.5]">
          Define where FloQast should pick up files from, and what file pattern to look for.
        </p>
      </div>

      <div className="rounded-[10px] border border-[#e1e6ef] bg-white p-5 space-y-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8b91a3] border-b border-[#e1e6ef] pb-3">
          Connection details
        </div>

        <Field label="Name">
          <Input value={name} onChange={setName} />
          <Help>A readable label so you can find this connector later.</Help>
        </Field>

        <Field label="Connection type">
          <div className="flex items-center gap-2 text-[13px] text-[#424867] bg-[#f8fafc] border border-[#e1e6ef] rounded-[6px] px-3 py-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#186749]" />
            <span className="font-semibold">SFTP</span>
            <span className="text-[#adb2bb] ml-auto">File-based</span>
          </div>
          <Help>Other types (API, ERP, direct upload) available after launch.</Help>
        </Field>

        <Field label="SFTP Host">
          <Input value={host} onChange={setHost} />
        </Field>

        <Field label="File Pattern">
          <Input value={filePattern} onChange={setFilePattern} />
          <Help>Glob pattern for files to pick up (e.g., <code className="font-mono">bank_txn_*.csv</code>).</Help>
        </Field>
      </div>

      <div className="flex items-center justify-end gap-2 mt-5">
        <Button variant="outlined" color="primary" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="filled" color="primary" size="md" disabled={!canCreate} onClick={handleCreate}>
          Create connector
        </Button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-semibold text-[#1d2433] mb-1.5">{label}</span>
      {children}
    </label>
  )
}

function Help({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-[#8b91a3] mt-1.5 leading-[1.4]">{children}</p>
}
