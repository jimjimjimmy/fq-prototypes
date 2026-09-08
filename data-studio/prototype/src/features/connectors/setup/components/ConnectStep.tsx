import React, { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props {}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--fq-color-text-primary)',
  marginBottom: 6,
};

const requiredStar: React.CSSProperties = {
  color: 'var(--fq-color-amber)',
  marginRight: 2,
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
};

const inputFocusStyle: React.CSSProperties = {
  borderColor: 'var(--fq-color-primary)',
  boxShadow: '0 0 0 2px rgba(0,135,90,0.12)',
};

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: 5, verticalAlign: 'middle', cursor: 'default' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ display: 'block' }}>
        <circle cx="6.5" cy="6.5" r="6" stroke="var(--fq-color-text-muted)" strokeWidth="1"/>
        <text x="6.5" y="9.5" textAnchor="middle" fontSize="8" fill="var(--fq-color-text-muted)" fontFamily="inherit" fontWeight="600">?</text>
      </svg>
      {show && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--fq-color-gray-900)',
          color: '#fff',
          fontSize: 12,
          padding: '6px 10px',
          borderRadius: 'var(--fq-radius-md)',
          pointerEvents: 'none',
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          maxWidth: 400,
          whiteSpace: 'normal' as const,
          lineHeight: 1.4,
        }}>
          {text}
        </div>
      )}
    </span>
  );
}

function Field({
  label,
  required,
  tooltip,
  children,
}: {
  label: string;
  required?: boolean;
  tooltip?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {required && <span style={requiredStar}>*</span>}
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}) }}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

type AuthType = 'API Key' | 'Bearer Token' | 'Basic Auth' | 'OAuth 2.0' | 'None';
type DeliveryMethod = 'Header' | 'Query Parameter' | 'Request Body';

const ConnectStep: React.FC<Props> = () => {
  const [displayName, setDisplayName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [healthcheckUrl, setHealthcheckUrl] = useState('');
  const [environment, setEnvironment] = useState<'Sandbox' | 'Production'>('Sandbox');
  const [apiVersion, setApiVersion] = useState('');
  const [authType, setAuthType] = useState<AuthType>('API Key');
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('Header');
  const [headerName, setHeaderName] = useState('');

  const ToggleButton = ({
    options,
    value,
    onChange,
  }: {
    options: string[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div
      style={{
        display: 'inline-flex',
        border: '1px solid var(--fq-color-border)',
        borderRadius: 'var(--fq-radius-md)',
        overflow: 'hidden',
      }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: value === opt ? 600 : 400,
            border: 'none',
            borderRight: '1px solid var(--fq-color-border)',
            background: value === opt ? 'var(--fq-color-primary)' : '#fff',
            color: value === opt ? '#fff' : 'var(--fq-color-text-primary)',
            cursor: 'pointer',
            whiteSpace: 'nowrap' as const,
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        padding: '32px 24px 48px',
        background: 'var(--fq-color-bg-page)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 560 }}>
        {/* Card */}
        <div
          style={{
            background: '#fff',
            borderRadius: 'var(--fq-radius-lg)',
            border: '1px solid var(--fq-color-border)',
            padding: 32,
            boxShadow: 'var(--fq-shadow-sm)',
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Connect</h2>
          <p style={{ fontSize: 13, color: 'var(--fq-color-text-secondary)', marginBottom: 24, lineHeight: 1.5 }}>
            Enter the API base URL and authentication credentials. FloQast will then test that the endpoint can be reached.
          </p>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="Connector Name" required tooltip="The name you'll see for this connection in Data Studio.">
              <TextInput
                placeholder="e.g., Workday Payroll"
                value={displayName}
                onChange={setDisplayName}
              />
            </Field>

            <Field label="API Base URL" required tooltip="The root address of the API. Look for 'Base URL' or 'Host' in your docs.">
              <TextInput
                placeholder="https://api.example.com"
                value={baseUrl}
                onChange={setBaseUrl}
              />
            </Field>

            <Field label="Health Check or Ping URL" required tooltip="A URL FloQast pings to confirm the API is reachable before syncing.">
              <TextInput
                placeholder="https://api.example.com/ping"
                value={healthcheckUrl}
                onChange={setHealthcheckUrl}
              />
            </Field>

            {/* Environment + API Version row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'start' }}>
              <Field label="Environment" tooltip="Use Sandbox to test your setup before switching to Production.">
                <ToggleButton
                  options={['Sandbox', 'Production']}
                  value={environment}
                  onChange={(v) => setEnvironment(v as 'Sandbox' | 'Production')}
                />
              </Field>
              <Field label="API Version" tooltip="Required by some APIs — check your docs. Leave blank if not listed.">
                <TextInput
                  placeholder="e.g., v2 or 2024-01"
                  value={apiVersion}
                  onChange={setApiVersion}
                />
              </Field>
            </div>

            <p style={{ fontSize: 12, color: 'var(--fq-color-text-secondary)', marginTop: -12 }}>
              Start with <strong>Sandbox</strong> before switching to Production.
            </p>

            {/* Divider */}
            <div style={{ borderTop: '1px solid var(--fq-color-border-light)', margin: '4px 0' }} />

            {/* Auth type */}
            <Field label="Authentication Type" tooltip="How the API verifies your identity. Look for 'Auth' or 'Authentication' in your docs.">
              <select
                style={{
                  ...inputStyle,
                  appearance: 'auto' as React.CSSProperties['appearance'],
                }}
                value={authType}
                onChange={(e) => setAuthType(e.target.value as AuthType)}
              >
                <option>API Key</option>
                <option>Bearer Token</option>
                <option>Basic Auth</option>
                <option>OAuth 2.0</option>
                <option>None</option>
              </select>
            </Field>

            {authType === 'API Key' && (
              <>
                <Field label="API Key" required tooltip="Your secret access key from the API provider. Treat it like a password.">
                  <TextInput placeholder="sk-••••••••••••••••••••••••••••••••" value={apiKeyValue} onChange={setApiKeyValue} />
                </Field>

                <Field label="Send API Key Via" required tooltip="Where your API key should be placed in the request. Your docs will specify.">
                  <ToggleButton
                    options={['Header', 'Query Parameter', 'Request Body']}
                    value={deliveryMethod}
                    onChange={(v) => setDeliveryMethod(v as DeliveryMethod)}
                  />
                </Field>

                {deliveryMethod === 'Header' && (
                  <Field label="Authorization Header Name" required tooltip="The exact header that carries your API key. Look under 'Headers' in your docs.">
                    <TextInput placeholder="e.g., X-API-Key" value={headerName} onChange={setHeaderName} />
                  </Field>
                )}
              </>
            )}

            {authType === 'Bearer Token' && (
              <Field label="Bearer Token" required tooltip="The token from your API provider. Usually found in their developer portal.">
                <TextInput placeholder="Bearer token value" value="" onChange={() => {}} />
              </Field>
            )}

            {authType === 'Basic Auth' && (
              <>
                <Field label="Username" required tooltip="Your API account username for Basic Authentication.">
                  <TextInput placeholder="Username" value="" onChange={() => {}} />
                </Field>
                <Field label="Password" required tooltip="Your API account password for Basic Authentication.">
                  <TextInput placeholder="Password" value="" onChange={() => {}} />
                </Field>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ConnectStep;
