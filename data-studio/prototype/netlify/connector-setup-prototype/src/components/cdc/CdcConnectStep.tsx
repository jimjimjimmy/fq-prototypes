import React, { useState } from 'react';

interface Props {
  onTestSuccess: () => void;
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--fq-color-text-primary)',
  marginBottom: 6,
};

const requiredStar: React.CSSProperties = {
  color: 'var(--fq-color-amber)',
  marginLeft: 4,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  fontSize: 13,
  border: '1px solid var(--fq-color-border)',
  borderRadius: 'var(--fq-radius-md)',
  outline: 'none',
  color: 'var(--fq-color-text-primary)',
  background: '#fff',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const hintStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--fq-color-text-muted)',
  marginTop: 5,
};

function Field({ label, required, hint, children }: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
        {required && <span style={requiredStar}>*</span>}
      </label>
      {children}
      {hint && <p style={hintStyle}>{hint}</p>}
    </div>
  );
}

function TextInput({ placeholder, value, onChange, type = 'text' }: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      style={{
        ...inputStyle,
        ...(focused ? { borderColor: 'var(--fq-color-primary)', boxShadow: '0 0 0 2px rgba(0,135,90,0.12)' } : {}),
      }}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

const CdcConnectStep: React.FC<Props> = ({ onTestSuccess }) => {
  const [connectionName, setConnectionName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [testing, setTesting] = useState(false);
  const [tested, setTested] = useState(false);

  const handleTest = () => {
    if (testing || tested) return;
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      setTested(true);
      onTestSuccess();
    }, 900);
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: '32px 24px 48px', background: 'var(--fq-color-bg-page)' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <div style={{ background: '#fff', borderRadius: 'var(--fq-radius-lg)', border: '1px solid var(--fq-color-border)', padding: 32, boxShadow: 'var(--fq-shadow-sm)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', color: 'var(--fq-color-text-primary)' }}>
            Connect to NetSuite
          </h2>
          <p style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)', margin: '0 0 24px', lineHeight: 1.5 }}>
            Enter your credentials. FloQast will test that the connection can be reached.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="Connection name" required>
              <TextInput
                placeholder="e.g. NetSuite Production"
                value={connectionName}
                onChange={setConnectionName}
              />
            </Field>

            <Field
              label="Account ID"
              required
              hint="Found in NetSuite under Setup → Company → Company Information"
            >
              <TextInput
                placeholder="e.g. 1234567"
                value={accountId}
                onChange={setAccountId}
              />
            </Field>

            <Field
              label="API token"
              required
              hint="Generate in NetSuite under Setup → Integration → Token Management"
            >
              <TextInput
                type="password"
                placeholder="Paste token"
                value={apiToken}
                onChange={setApiToken}
              />
            </Field>

            <div style={{ paddingTop: 4 }}>
              <button
                onClick={handleTest}
                disabled={testing || tested}
                style={{
                  padding: '9px 20px',
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 'var(--fq-radius-md)',
                  background: tested
                    ? '#dcfce7'
                    : testing
                      ? 'var(--fq-color-gray-200)'
                      : '#d1fae5',
                  color: tested
                    ? '#166534'
                    : testing
                      ? 'var(--fq-color-text-muted)'
                      : 'var(--fq-color-primary)',
                  cursor: testing || tested ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'background 0.2s',
                }}
              >
                {tested && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {testing ? 'Testing connection…' : tested ? 'Connection verified' : 'Test connection'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CdcConnectStep;
