/**
 * Figma Match Overlay
 *
 * Dev-only overlay that lets you click any React component in the browser,
 * identify its source file via React fiber, pair it with a Figma layer URL,
 * and copy a formatted block for Claude to process.
 *
 * Injected by figma-match-plugin.ts — never runs in production.
 */

;(() => {
  // ── State ──────────────────────────────────────────────────────────────
  const State = { IDLE: 'idle', SELECTING: 'selecting', DIALOG_WAITING: 'dialog_waiting', INSPECTING: 'inspecting' }
  let state = State.IDLE
  let selectedInfo = null // { componentName, fileName, lineNumber, rect }

  // ── Container (self-excluded from selection) ───────────────────────────
  const root = document.createElement('div')
  root.setAttribute('data-figma-match', 'true')
  root.style.cssText = 'all: initial; position: fixed; z-index: 99999; pointer-events: none;'
  document.body.appendChild(root)

  // ── Badge (two-segment pill) ──────────────────────────────────────────
  const badgeWrap = document.createElement('div')
  badgeWrap.setAttribute('data-figma-match', 'true')
  badgeWrap.style.cssText = `
    all: initial; position: fixed; bottom: 16px; left: 16px; z-index: 99999;
    display: flex; pointer-events: auto; user-select: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3); border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  `

  const badgeLeft = document.createElement('button')
  badgeLeft.textContent = '⊹ Figma Match'
  badgeLeft.style.cssText = `
    all: unset; background: #1a1a2e; color: #fff; font-size: 13px;
    padding: 8px 12px 8px 14px; border-radius: 20px 0 0 20px; cursor: pointer;
    transition: background 0.15s; white-space: nowrap;
  `
  badgeLeft.addEventListener('mouseenter', () => {
    if (state === State.IDLE) badgeLeft.style.background = '#2a2a4e'
  })
  badgeLeft.addEventListener('mouseleave', () => {
    if (state === State.IDLE) badgeLeft.style.background = '#1a1a2e'
  })
  badgeLeft.addEventListener('click', (e) => {
    e.stopPropagation()
    e.stopImmediatePropagation()
    if (state === State.IDLE) enterSelecting()
    else returnToIdle()
  })

  const badgeDivider = document.createElement('div')
  badgeDivider.style.cssText = 'width: 1px; background: rgba(255,255,255,0.15); align-self: stretch;'

  const badgeRight = document.createElement('button')
  badgeRight.textContent = '▣'
  badgeRight.title = 'Dialog match mode'
  badgeRight.style.cssText = `
    all: unset; background: #1a1a2e; color: #fff; font-size: 13px;
    padding: 8px 14px 8px 12px; border-radius: 0 20px 20px 0; cursor: pointer;
    transition: background 0.15s;
  `
  badgeRight.addEventListener('mouseenter', () => {
    if (state === State.IDLE) badgeRight.style.background = '#2a2a4e'
  })
  badgeRight.addEventListener('mouseleave', () => {
    if (state === State.IDLE) badgeRight.style.background = '#1a1a2e'
  })
  badgeRight.addEventListener('click', (e) => {
    e.stopPropagation()
    e.stopImmediatePropagation()
    if (state === State.IDLE) enterDialogWaiting()
    else returnToIdle()
  })

  badgeWrap.appendChild(badgeLeft)
  badgeWrap.appendChild(badgeDivider)
  badgeWrap.appendChild(badgeRight)
  root.appendChild(badgeWrap)

  // Alias for shared badge update logic
  const badge = badgeLeft

  // ── Hover Highlight ────────────────────────────────────────────────────
  const highlight = document.createElement('div')
  highlight.style.cssText = `
    position: fixed; pointer-events: none; z-index: 99998;
    border: 2px solid #3b82f6; background: rgba(59, 130, 246, 0.08);
    border-radius: 3px; display: none; transition: all 0.05s ease-out;
  `
  root.appendChild(highlight)

  const highlightLabel = document.createElement('div')
  highlightLabel.style.cssText = `
    position: fixed; pointer-events: none; z-index: 99998;
    background: #3b82f6; color: #fff; font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 11px; padding: 2px 6px; border-radius: 3px; white-space: nowrap; display: none;
  `
  root.appendChild(highlightLabel)

  // ── Info Panel ─────────────────────────────────────────────────────────
  const panel = document.createElement('div')
  panel.style.cssText = `
    position: fixed; z-index: 99999; pointer-events: auto;
    background: #1a1a2e; color: #fff; font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 13px; padding: 16px; border-radius: 10px; width: 340px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4); display: none;
  `
  panel.setAttribute('data-figma-match', 'true')

  const panelClose = document.createElement('button')
  panelClose.textContent = '✕'
  panelClose.style.cssText = `
    all: unset; position: absolute; top: 8px; right: 10px; cursor: pointer;
    color: #888; font-size: 14px; padding: 4px;
  `
  panelClose.addEventListener('click', returnToIdle)
  panel.appendChild(panelClose)

  const panelName = document.createElement('div')
  panelName.style.cssText = 'font-weight: 600; font-size: 15px; margin-bottom: 4px;'
  panel.appendChild(panelName)

  const panelFile = document.createElement('div')
  panelFile.style.cssText = `
    font-family: "SF Mono", Menlo, monospace; font-size: 11px; color: #9ca3af;
    margin-bottom: 12px; word-break: break-all;
  `
  panel.appendChild(panelFile)

  const figmaInput = document.createElement('input')
  figmaInput.type = 'text'
  figmaInput.placeholder = 'Paste Figma layer URL...'
  figmaInput.style.cssText = `
    all: unset; width: 100%; box-sizing: border-box; background: #2a2a4e;
    color: #fff; font-size: 12px; padding: 8px 10px; border-radius: 6px;
    margin-bottom: 10px; display: block;
  `
  panel.appendChild(figmaInput)

  const copyBtn = document.createElement('button')
  copyBtn.textContent = 'Copy for Claude'
  copyBtn.style.cssText = `
    all: unset; width: 100%; box-sizing: border-box; background: #3b82f6;
    color: #fff; font-size: 13px; font-weight: 500; padding: 8px; border-radius: 6px;
    cursor: pointer; text-align: center; display: block; transition: background 0.15s;
  `
  copyBtn.addEventListener('mouseenter', () => { copyBtn.style.background = '#2563eb' })
  copyBtn.addEventListener('mouseleave', () => { copyBtn.style.background = '#3b82f6' })
  copyBtn.addEventListener('click', copyToClipboard)
  panel.appendChild(copyBtn)

  const sendBtn = document.createElement('button')
  sendBtn.textContent = 'Send to Claude'
  sendBtn.style.cssText = `
    all: unset; width: 100%; box-sizing: border-box; background: #7c3aed;
    color: #fff; font-size: 13px; font-weight: 500; padding: 8px; border-radius: 6px;
    cursor: pointer; text-align: center; display: block; transition: background 0.15s;
    margin-top: 6px;
  `
  sendBtn.addEventListener('mouseenter', () => { sendBtn.style.background = '#6d28d9' })
  sendBtn.addEventListener('mouseleave', () => { sendBtn.style.background = '#7c3aed' })
  sendBtn.addEventListener('click', sendToClaudeFile)
  panel.appendChild(sendBtn)

  // Selectable output field — always visible when match data is ready
  const outputArea = document.createElement('textarea')
  outputArea.readOnly = true
  outputArea.style.cssText = `
    all: unset; width: 100%; box-sizing: border-box; background: #1e1e2e;
    color: #cdd6f4; font-size: 11px; font-family: monospace; padding: 8px;
    border-radius: 6px; display: none; margin-top: 8px; resize: none;
    height: 80px; cursor: text; white-space: pre; overflow: auto;
    border: 1px solid #45475a;
  `
  outputArea.addEventListener('focus', () => { outputArea.select() })
  panel.appendChild(outputArea)

  root.appendChild(panel)

  // ── React Fiber Walk ───────────────────────────────────────────────────
  function getFiberFromElement(element) {
    for (const key of Object.keys(element)) {
      if (key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$')) {
        return element[key]
      }
    }
    return null
  }

  // Walk UP the fiber tree to find component name and source file.
  // Separates name and source resolution — keeps walking past named
  // components that lack _debugSource so we don't bail early.
  function extractInfoFromFiber(fiber) {
    let bestName = null
    let current = fiber
    while (current) {
      if (current.tag === 0 || current.tag === 1) {
        const name = current.type?.displayName || current.type?.name || 'Anonymous'
        const isNamed = name !== 'Anonymous' && !name.startsWith('_')
        if (!bestName && isNamed) bestName = name
        if (current._debugSource) {
          return {
            componentName: bestName || name,
            fileName: current._debugSource.fileName,
            lineNumber: current._debugSource.lineNumber,
          }
        }
      }
      // Also check _debugSource on host fibers (tag 5) — OXC sets it on all elements
      if (current.tag === 5 && current._debugSource && bestName) {
        return {
          componentName: bestName,
          fileName: current._debugSource.fileName,
          lineNumber: current._debugSource.lineNumber,
        }
      }
      current = current.return
    }
    return bestName ? { componentName: bestName, fileName: null, lineNumber: null } : null
  }

  function getReactFiberInfo(element) {
    const fiber = getFiberFromElement(element)
    if (!fiber) return null
    return extractInfoFromFiber(fiber)
  }

  // Walk DOWN from an element's fiber to find the best React component info.
  // Useful when the detected container is a wrapper div — we look inside it.
  function getDeepReactFiberInfo(element) {
    // Try the element itself (walks UP)
    const direct = getReactFiberInfo(element)
    if (direct && direct.fileName) return direct

    // Walk child fibers to find a named component with source info
    const fiber = getFiberFromElement(element)
    if (!fiber) return direct

    let bestChild = null
    const queue = [fiber.child]
    while (queue.length) {
      const f = queue.shift()
      if (!f) continue
      // Check any fiber with _debugSource
      if (f._debugSource) {
        const name = (f.tag === 0 || f.tag === 1)
          ? (f.type?.displayName || f.type?.name || null)
          : null
        const isNamed = name && name !== 'Anonymous' && !name.startsWith('_')
        if (isNamed) {
          return {
            componentName: name,
            fileName: f._debugSource.fileName,
            lineNumber: f._debugSource.lineNumber,
          }
        }
        // Remember first child with source as fallback
        if (!bestChild) {
          bestChild = {
            componentName: direct?.componentName || 'Component',
            fileName: f._debugSource.fileName,
            lineNumber: f._debugSource.lineNumber,
          }
        }
      }
      if (f.child) queue.push(f.child)
      if (f.sibling) queue.push(f.sibling)
    }

    return bestChild || direct
  }

  // ── State Transitions ──────────────────────────────────────────────────
  function enterSelecting() {
    state = State.SELECTING
    badge.textContent = '⊹ Selecting…'
    badge.style.background = '#3b82f6'
    badgeRight.style.background = '#3b82f6'
    document.body.style.cursor = 'crosshair'
    document.addEventListener('mousemove', onMouseMove, true)
    document.addEventListener('click', onSelect, true)
    document.addEventListener('keydown', onEscape, true)
  }

  function enterInspecting(info) {
    state = State.INSPECTING
    selectedInfo = info
    badge.textContent = '⊹ Figma Match'
    badge.style.background = '#1a1a2e'
    badgeRight.style.background = '#1a1a2e'
    document.body.style.cursor = ''
    if (dialogDetectionUI) {
      dialogDetectionUI.outlineEl.remove()
      dialogDetectionUI.useWholeBtn.remove()
      dialogDetectionUI = null
    }
    document.removeEventListener('mousemove', onMouseMove, true)
    document.removeEventListener('click', onSelect, true)
    highlight.style.display = 'none'
    highlightLabel.style.display = 'none'

    // Populate panel
    panelName.textContent = info.componentName
    const fileLoc = info.fileName
      ? `${info.fileName}${info.lineNumber ? ':' + info.lineNumber : ''}`
      : 'File path unavailable'
    panelFile.textContent = fileLoc
    figmaInput.value = ''

    // Position panel near element
    const r = info.rect
    let top = r.bottom + 8
    let left = r.left
    if (top + 220 > window.innerHeight) top = Math.max(8, r.top - 220)
    if (left + 356 > window.innerWidth) left = Math.max(8, window.innerWidth - 356)
    panel.style.top = top + 'px'
    panel.style.left = left + 'px'
    panel.style.display = 'block'
    figmaInput.focus()
  }

  function returnToIdle() {
    state = State.IDLE
    selectedInfo = null
    badge.textContent = '⊹ Figma Match'
    badge.style.background = '#1a1a2e'
    badgeRight.style.background = '#1a1a2e'
    document.body.style.cursor = ''
    if (dialogObserver) { dialogObserver.disconnect(); dialogObserver = null }
    if (dialogDetectionUI) {
      dialogDetectionUI.outlineEl.remove()
      dialogDetectionUI.useWholeBtn.remove()
      dialogDetectionUI = null
    }
    document.removeEventListener('mousemove', onMouseMove, true)
    document.removeEventListener('click', onSelect, true)
    document.removeEventListener('keydown', onEscape, true)
    highlight.style.display = 'none'
    highlightLabel.style.display = 'none'
    panel.style.display = 'none'
  }

  // ── Event Handlers ─────────────────────────────────────────────────────
  let dialogObserver = null
  let dialogDetectionUI = null // { outlineEl, useWholeBtn }

  function isOverlayElement(el) {
    return el && (el.closest?.('[data-figma-match]') || el.hasAttribute?.('data-figma-match'))
  }

  // ── AG Grid Filter ──────────────────────────────────────────────────
  function isAgGridElement(el) {
    return el.matches?.('[class*="ag-"]') || !!el.closest?.('[class*="ag-"]')
  }

  function getEffectiveZIndex(el) {
    const z = parseInt(window.getComputedStyle(el).zIndex, 10)
    return isNaN(z) ? 0 : z
  }

  // ── Dialog Match Mode ────────────────────────────────────────────────
  function enterDialogWaiting() {
    state = State.DIALOG_WAITING
    badge.textContent = '⊹ Click a trigger…'
    badge.style.background = '#d97706'
    badgeRight.style.background = '#d97706'
    document.addEventListener('keydown', onEscape, true)

    // Snapshot current DOM state so we can diff after click
    const preClickSnapshot = new Set()
    document.querySelectorAll('[class*="fixed"], [class*="absolute"], [style*="position: fixed"], [style*="position: absolute"]').forEach(el => {
      if (!isOverlayElement(el)) preClickSnapshot.add(el)
    })

    dialogObserver = new MutationObserver((mutations) => {
      // Collect all meaningful added nodes (subtree-deep)
      const added = []
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue
          if (isOverlayElement(node)) continue
          added.push(node)
        }
      }
      if (added.length === 0) return

      // Look for the newly-appeared overlay/panel/dialog
      // Strategy: find the highest-z-index fixed/absolute element that wasn't there before
      dialogObserver.disconnect()
      dialogObserver = null

      setTimeout(() => {
        // Find new positioned elements that appeared after the click
        const candidates = []
        document.querySelectorAll('[class*="fixed"], [class*="absolute"], [style*="position: fixed"], [style*="position: absolute"]').forEach(el => {
          if (isOverlayElement(el)) return
          if (preClickSnapshot.has(el)) return
          if (isAgGridElement(el)) return
          const rect = el.getBoundingClientRect()
          if (rect.width > 20 && rect.height > 20) candidates.push({ el, rect })
        })

        // Also check the directly-added nodes themselves
        for (const node of added) {
          if (preClickSnapshot.has(node)) continue
          if (isAgGridElement(node)) continue
          const rect = node.getBoundingClientRect()
          if (rect.width > 20 && rect.height > 20) {
            if (!candidates.some(c => c.el === node)) candidates.push({ el: node, rect })
          }
        }

        if (candidates.length === 0) {
          // Nothing meaningful appeared — go back to idle
          enterSelecting()
          return
        }

        // Pick best candidate: highest z-index first, then largest area as tiebreaker
        candidates.sort((a, b) => {
          const zDiff = getEffectiveZIndex(b.el) - getEffectiveZIndex(a.el)
          return zDiff !== 0 ? zDiff : (b.rect.width * b.rect.height) - (a.rect.width * a.rect.height)
        })
        const container = candidates[0]

        // Pre-capture fiber info NOW while the panel is still mounted.
        // Outside-click handlers (mousedown) in app code can unmount the panel
        // before our click handler runs, so we can't defer this to click time.
        // Walk DOM children FIRST to find the inner component (e.g. DirectedTransformationDropdown),
        // not the parent wrapper (e.g. FieldMappingView) that getDeepReactFiberInfo would find
        // by walking UP.
        let preCapturedInfo = null
        for (const child of container.el.querySelectorAll('*')) {
          if (isOverlayElement(child)) continue
          const childInfo = getReactFiberInfo(child)
          if (childInfo && childInfo.fileName) { preCapturedInfo = childInfo; break }
        }
        if (!preCapturedInfo) {
          preCapturedInfo = getDeepReactFiberInfo(container.el)
        }

        // Show persistent green outline around detected container
        const outlineEl = document.createElement('div')
        outlineEl.setAttribute('data-figma-match', 'true')
        outlineEl.style.cssText = `
          position: fixed; pointer-events: none; z-index: 99997;
          border: 2px solid #16a34a; background: rgba(22, 163, 74, 0.06);
          border-radius: 6px;
        `
        outlineEl.style.top = container.rect.top + 'px'
        outlineEl.style.left = container.rect.left + 'px'
        outlineEl.style.width = container.rect.width + 'px'
        outlineEl.style.height = container.rect.height + 'px'
        root.appendChild(outlineEl)

        // "Use whole container" button anchored to top-right of detected container
        const useWholeBtn = document.createElement('button')
        useWholeBtn.setAttribute('data-figma-match', 'true')
        useWholeBtn.textContent = '⊹ Select whole panel'
        useWholeBtn.style.cssText = `
          all: unset; position: fixed; z-index: 99999; pointer-events: auto;
          background: #16a34a; color: #fff; font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 12px; font-weight: 500; padding: 6px 12px; border-radius: 6px;
          cursor: pointer; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: background 0.15s;
        `
        useWholeBtn.style.top = Math.max(4, container.rect.top - 36) + 'px'
        useWholeBtn.style.left = container.rect.left + 'px'
        useWholeBtn.addEventListener('mouseenter', () => { useWholeBtn.style.background = '#15803d' })
        useWholeBtn.addEventListener('mouseleave', () => { useWholeBtn.style.background = '#16a34a' })
        // Block mousedown propagation so app-level outside-click handlers
        // don't unmount the panel before our click handler reads fiber info
        useWholeBtn.addEventListener('mousedown', (e) => {
          e.stopPropagation()
          e.stopImmediatePropagation()
        })
        useWholeBtn.addEventListener('click', (e) => {
          e.stopPropagation()
          e.stopImmediatePropagation()
          // Clean up dialog UI
          outlineEl.remove()
          useWholeBtn.remove()
          // Use pre-captured info (captured while panel was still mounted)
          const result = preCapturedInfo || { componentName: container.el.tagName.toLowerCase(), fileName: null, lineNumber: null }
          result.rect = container.el.getBoundingClientRect()
          enterInspecting(result)
        })
        root.appendChild(useWholeBtn)

        // Store refs so returnToIdle can clean them up
        dialogDetectionUI = { outlineEl, useWholeBtn }

        enterSelecting()
      }, 500)
    })

    dialogObserver.observe(document.body, { childList: true, subtree: true })
  }

  function onMouseMove(e) {
    const el = e.target
    if (isOverlayElement(el)) {
      highlight.style.display = 'none'
      highlightLabel.style.display = 'none'
      return
    }

    const rect = el.getBoundingClientRect()
    highlight.style.display = 'block'
    highlight.style.top = rect.top + 'px'
    highlight.style.left = rect.left + 'px'
    highlight.style.width = rect.width + 'px'
    highlight.style.height = rect.height + 'px'

    const info = getReactFiberInfo(el)
    if (info) {
      highlightLabel.textContent = info.componentName
      highlightLabel.style.display = 'block'
      highlightLabel.style.top = Math.max(0, rect.top - 20) + 'px'
      highlightLabel.style.left = rect.left + 'px'
    } else {
      highlightLabel.style.display = 'none'
    }
  }

  function onSelect(e) {
    const el = e.target
    if (isOverlayElement(el)) return

    e.preventDefault()
    e.stopPropagation()

    const info = getReactFiberInfo(el)
    if (!info) return

    info.rect = el.getBoundingClientRect()
    enterInspecting(info)
  }

  function onEscape(e) {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopImmediatePropagation()
      returnToIdle()
    }
  }

  // ── Clipboard ──────────────────────────────────────────────────────────
  function onCopySuccess() {
    copyBtn.textContent = '✓ Copied!'
    copyBtn.style.background = '#16a34a'
    setTimeout(() => {
      copyBtn.textContent = 'Copy for Claude'
      copyBtn.style.background = '#3b82f6'
    }, 1500)
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:120px;z-index:2147483647;font-size:12px;font-family:monospace;padding:8px;background:#1e1e2e;color:#cdd6f4;border:2px solid #3b82f6'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    try {
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (ok) { onCopySuccess(); return }
    } catch { /* fall through */ }
    // Last resort: leave the textarea visible so user can Cmd+C manually
    copyBtn.textContent = '↑ Select & copy above'
    copyBtn.style.background = '#f59e0b'
    textarea.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        setTimeout(() => { document.body.removeChild(textarea); onCopySuccess() }, 200)
      }
    })
    setTimeout(() => { if (textarea.parentNode) document.body.removeChild(textarea) }, 15000)
  }

  function buildMatchText() {
    if (!selectedInfo) return ''
    const fileLoc = selectedInfo.fileName
      ? `${selectedInfo.fileName}${selectedInfo.lineNumber ? ':' + selectedInfo.lineNumber : ''}`
      : 'unknown'
    const lines = ['/figma-fq', '', `Component: ${selectedInfo.componentName}`, `File: ${fileLoc}`]
    if (figmaInput.value.trim()) {
      lines.push(`Figma: ${figmaInput.value.trim()}`)
    }
    const text = lines.join('\n')
    // Always show in the output area so user can select & copy manually
    outputArea.value = text
    outputArea.style.display = 'block'
    return text
  }

  function copyToClipboard() {
    const text = buildMatchText()
    if (!text) return

    // Try modern Clipboard API first, fall back to execCommand for restricted contexts
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(onCopySuccess).catch(() => fallbackCopy(text))
    } else {
      fallbackCopy(text)
    }
  }

  // ── File-based "Send to Claude" ───────────────────────────────────────
  function sendToClaudeFile() {
    const text = buildMatchText()
    if (!text) return

    sendBtn.textContent = 'Sending...'
    sendBtn.style.background = '#6d28d9'

    fetch('/@figma-match-send', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: text,
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          sendBtn.textContent = '✓ Sent to Claude'
          sendBtn.style.background = '#16a34a'
          setTimeout(() => {
            sendBtn.textContent = 'Send to Claude'
            sendBtn.style.background = '#7c3aed'
          }, 2000)
        } else {
          sendBtn.textContent = '✗ Failed'
          sendBtn.style.background = '#dc2626'
          setTimeout(() => {
            sendBtn.textContent = 'Send to Claude'
            sendBtn.style.background = '#7c3aed'
          }, 2000)
        }
      })
      .catch(() => {
        sendBtn.textContent = '✗ No server'
        sendBtn.style.background = '#dc2626'
        setTimeout(() => {
          sendBtn.textContent = 'Send to Claude'
          sendBtn.style.background = '#7c3aed'
        }, 2000)
      })
  }
})()
