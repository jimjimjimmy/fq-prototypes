import sys
sys.path.insert(0, '/Users/alexkea/Documents/product-and-design/.claude/skills/floqast-user-flow/scripts')
from svg_helpers import SVGCanvas

W = 1400
H = 2700
canvas = SVGCanvas(W, H)
canvas.title("File Connector Setup — User Flow", "SFTP and Close Upload transport types · Data Studio")

# ── Column centres ───────────────────────────────────────────────────────────
CL  = 350   # SFTP branch (left)
CM  = 700   # Main / shared flow (centre)
CR  = 1050  # Close Upload bypass / sample upload (right)

BW  = 340   # standard box width
BH  = 68    # standard box height
DW  = 140   # diamond half-width
DH  = 52    # diamond half-height

def bx(cx): return cx - BW // 2   # box left-x from centre
def by(cy): return cy - BH // 2   # box top-y from centre

# ── Row Y positions ──────────────────────────────────────────────────────────
Y = {
    "entry":        100,
    "transport":    230,
    "creds":        380,
    "endpoint":     510,
    "enc_dec":      640,
    "pgp":          780,
    "ssh":          780,
    "validate":     920,
    "cred_valid":   1040,
    "cred_err":     1160,
    "source_sel":   1320,
    "landed_dec":   1450,
    "browse":       1590,
    "file_sel_dec": 1730,
    "sample":       1590,
    "naming":       1900,
    "schema":       2040,
    "schema_dec":   2170,
    "schema_err":   2300,
    "acct":         2300,
    "entity":       2430,
    "terminal":     2570,
}

# ── 1. Entry ─────────────────────────────────────────────────────────────────
canvas.box(bx(CM), by(Y["entry"]), BW, BH, "entry")
canvas.label(CM, Y["entry"] - 12, ["Admin", "Add dataset / configure file connector"], "entry")

# ── 2. Transport Decision ─────────────────────────────────────────────────────
canvas.diamond(CM, Y["transport"], DW, DH, "decision")
canvas.label(CM, Y["transport"] - 10, ["Select Transport Type"], "decision", bold_first=False)
canvas.edge(CM, Y["entry"] + BH // 2, CM, Y["transport"] - DH)

# ── SFTP branch ──────────────────────────────────────────────────────────────

# Arrow: transport decision → SFTP creds (left branch)
canvas.curve(
    f"M {CM - DW} {Y['transport']} L {CL} {Y['transport']} L {CL} {by(Y['creds'])}",
    color="#64748B", marker="arr"
)
canvas.lbg(CL + 40, Y["transport"] - 14, "SFTP")

# 3. Credential Setup
canvas.box(bx(CL), by(Y["creds"]), BW, BH, "action")
canvas.label(CL, Y["creds"] - 12, ["SFTP Credential Setup", "Enter username & password"], "action")

# 4. Provide Endpoint
canvas.box(bx(CL), by(Y["endpoint"]), BW, BH, "system")
canvas.label(CL, Y["endpoint"] - 12, ["System: Provide SFTP Endpoint", "Host & path shown to admin"], "system")
canvas.edge(CL, by(Y["creds"]) + BH, CL, by(Y["endpoint"]))

# 5. Encryption decision
canvas.diamond(CL, Y["enc_dec"], DW, DH, "decision")
canvas.label(CL, Y["enc_dec"] - 10, ["Optional encryption?"], "decision", bold_first=False)
canvas.edge(CL, by(Y["endpoint"]) + BH, CL, Y["enc_dec"] - DH)

# 6. PGP (left of SFTP branch)
pgp_x = CL - 200
canvas.box(bx(pgp_x), by(Y["pgp"]), 270, BH, "action")
canvas.label(pgp_x, Y["pgp"] - 12, ["Configure PGP", "Paste or upload public key"], "action")
canvas.curve(
    f"M {CL - DW} {Y['enc_dec']} L {pgp_x} {Y['enc_dec']} L {pgp_x} {by(Y['pgp'])}",
    color="#64748B", marker="arr"
)
canvas.lbg(pgp_x + 20, Y["enc_dec"] - 14, "PGP")

# 7. SSH (right of SFTP branch)
ssh_x = CL + 200
canvas.box(bx(ssh_x), by(Y["ssh"]), 270, BH, "action")
canvas.label(ssh_x, Y["ssh"] - 12, ["Upload SSH Key", ""], "action")
canvas.curve(
    f"M {CL + DW} {Y['enc_dec']} L {ssh_x} {Y['enc_dec']} L {ssh_x} {by(Y['ssh'])}",
    color="#64748B", marker="arr"
)
canvas.lbg(ssh_x - 20, Y["enc_dec"] - 14, "SSH key")

# 8. Validate credentials
canvas.box(bx(CL), by(Y["validate"]), BW, BH, "system")
canvas.label(CL, Y["validate"] - 12, ["System: Validate Credentials", "Tests username, password & keys"], "system")

# Arrows from PGP + SSH + "neither" → validate
canvas.curve(
    f"M {pgp_x} {by(Y['pgp']) + BH} L {pgp_x} {Y['validate']} L {bx(CL)} {Y['validate']}",
    color="#64748B", marker="arr"
)
canvas.curve(
    f"M {ssh_x} {by(Y['ssh']) + BH} L {ssh_x} {Y['validate']} L {bx(CL) + BW} {Y['validate']}",
    color="#64748B", marker="arr"
)
# "neither" path: straight down from diamond bottom
canvas.curve(
    f"M {CL} {Y['enc_dec'] + DH} L {CL} {by(Y['validate'])}",
    color="#64748B", marker="arr"
)
canvas.lbg(CL - 50, Y["enc_dec"] + DH + 20, "Neither")

# 9. Credentials valid decision
canvas.diamond(CL, Y["cred_valid"], DW, DH, "decision")
canvas.label(CL, Y["cred_valid"] - 10, ["Credentials valid?"], "decision", bold_first=False)
canvas.edge(CL, by(Y["validate"]) + BH, CL, Y["cred_valid"] - DH)

# 10. Credential error
err_x = CL - 220
canvas.box(bx(err_x), by(Y["cred_err"]), 290, BH, "error")
canvas.label(err_x, Y["cred_err"] - 12, ["Credential Error", "Invalid username, password, or key"], "error")

canvas.curve(
    f"M {CL - DW} {Y['cred_valid']} L {err_x} {Y['cred_valid']} L {err_x} {by(Y['cred_err'])}",
    color="#EF4444", marker="arr_red"
)
canvas.lbg(err_x + 40, Y["cred_valid"] - 14, "No", "#EF4444")

# Retry arrow from error back to creds
canvas.curve(
    f"M {err_x - BW // 2} {Y['cred_err']} L {bx(CL) - 60} {Y['cred_err']} "
    f"L {bx(CL) - 60} {Y['creds']} L {bx(CL)} {Y['creds']}",
    color="#EF4444", marker="arr_red", dash=True
)
canvas.lbg(bx(CL) - 60, Y["creds"] - 20, "Retry")

# "Yes" arrow from cred_valid to source selection
canvas.curve(
    f"M {CL + DW} {Y['cred_valid']} L {CM} {Y['cred_valid']} L {CM} {by(Y['source_sel'])}",
    color="#16A34A", marker="arr_green"
)
canvas.lbg(CM - 40, Y["cred_valid"] - 14, "Yes", "#16A34A")

# ── Close Upload bypass ───────────────────────────────────────────────────────
canvas.curve(
    f"M {CM + DW} {Y['transport']} L {CR} {Y['transport']} L {CR} {Y['source_sel']} L {bx(CM) + BW} {Y['source_sel']}",
    color="#64748B", marker="arr"
)
canvas.lbg(CR + 10, Y["transport"] - 14, "Close Upload")

# ── 11. Source File Selection (shared) ────────────────────────────────────────
canvas.box(bx(CM), by(Y["source_sel"]), BW, BH, "screen")
canvas.label(CM, Y["source_sel"] - 12, ["Source File Selection", "Choose a file to define the schema"], "screen")

# 12. Files landed decision
canvas.diamond(CM, Y["landed_dec"], DW, DH, "decision")
canvas.label(CM, Y["landed_dec"] - 10, ["Files already landed?"], "decision", bold_first=False)
canvas.edge(CM, by(Y["source_sel"]) + BH, CM, Y["landed_dec"] - DH)

# 13. Browse files (left)
browse_x = CM - 220
canvas.box(bx(browse_x), by(Y["browse"]), 300, BH, "screen")
canvas.label(browse_x, Y["browse"] - 12, ["Browse Files", "Transport · Username · Date landed"], "screen")
canvas.curve(
    f"M {CM - DW} {Y['landed_dec']} L {browse_x} {Y['landed_dec']} L {browse_x} {by(Y['browse'])}",
    color="#64748B", marker="arr"
)
canvas.lbg(browse_x + 30, Y["landed_dec"] - 14, "Yes")

# 14. File selected decision
canvas.diamond(browse_x, Y["file_sel_dec"], DW - 20, DH - 10, "decision")
canvas.label(browse_x, Y["file_sel_dec"] - 10, ["File selected?"], "decision", bold_first=False)
canvas.edge(browse_x, by(Y["browse"]) + BH, browse_x, Y["file_sel_dec"] - (DH - 10))

# 15. Upload sample file (right of centre)
sample_x = CM + 220
canvas.box(bx(sample_x), by(Y["sample"]), 310, BH, "action")
canvas.label(sample_x, Y["sample"] - 12, ["Upload Sample File", "Schema definition + field mapping tester"], "action")

# No files yet → sample
canvas.curve(
    f"M {CM + DW} {Y['landed_dec']} L {sample_x} {Y['landed_dec']} L {sample_x} {by(Y['sample'])}",
    color="#64748B", marker="arr"
)
canvas.lbg(sample_x - 30, Y["landed_dec"] - 14, "No files yet")

# No match found → sample
canvas.curve(
    f"M {browse_x + DW - 20} {Y['file_sel_dec']} L {sample_x} {Y['file_sel_dec']} L {sample_x} {by(Y['sample']) + BH}",
    color="#64748B", marker="arr"
)
canvas.lbg(sample_x - 40, Y["file_sel_dec"] - 14, "No match")

# ── 16. File Naming Pattern (shared) ─────────────────────────────────────────
canvas.box(bx(CM), by(Y["naming"]), BW, BH, "screen")
canvas.label(CM, Y["naming"] - 12, ["File Naming Pattern", "Define pattern to identify incoming files"], "screen")

# Browse → selected → naming
canvas.curve(
    f"M {browse_x} {Y['file_sel_dec'] + (DH - 10)} L {browse_x} {Y['naming']} L {bx(CM)} {Y['naming']}",
    color="#16A34A", marker="arr_green"
)
canvas.lbg(browse_x + 30, Y["file_sel_dec"] + DH, "Selected", "#16A34A")

# Sample → naming
canvas.curve(
    f"M {sample_x} {by(Y['sample']) + BH} L {sample_x} {Y['naming']} L {bx(CM) + BW} {Y['naming']}",
    color="#64748B", marker="arr"
)

# ── 17. Schema Definition ─────────────────────────────────────────────────────
canvas.box(bx(CM), by(Y["schema"]), BW, BH, "system")
canvas.label(CM, Y["schema"] - 12, ["Schema Definition", "System infers columns & types from file"], "system")
canvas.edge(CM, by(Y["naming"]) + BH, CM, by(Y["schema"]))

# 18. Schema valid decision
canvas.diamond(CM, Y["schema_dec"], DW, DH, "decision")
canvas.label(CM, Y["schema_dec"] - 10, ["Schema valid?"], "decision", bold_first=False)
canvas.edge(CM, by(Y["schema"]) + BH, CM, Y["schema_dec"] - DH)

# 19. Schema error (right)
schema_err_x = CM + 260
canvas.box(bx(schema_err_x), by(Y["schema_err"]), 290, BH, "error")
canvas.label(schema_err_x, Y["schema_err"] - 12, ["Schema Error", "Adjust file or column mapping"], "error")
canvas.curve(
    f"M {CM + DW} {Y['schema_dec']} L {schema_err_x} {Y['schema_dec']} L {schema_err_x} {by(Y['schema_err'])}",
    color="#EF4444", marker="arr_red"
)
canvas.lbg(schema_err_x - 30, Y["schema_dec"] - 14, "Error", "#EF4444")
# Retry
canvas.curve(
    f"M {schema_err_x} {by(Y['schema_err']) + BH} L {schema_err_x} {Y['schema'] + 20} "
    f"L {bx(CM) + BW} {Y['schema'] + 20}",
    color="#EF4444", marker="arr_red", dash=True
)

# ── 20. Accounting Period Config ──────────────────────────────────────────────
acct_x = CM - 220
canvas.box(bx(acct_x), by(Y["acct"]), 310, BH, "screen")
canvas.label(acct_x, Y["acct"] - 12, ["Accounting Period Config", "Derive period from filename or column"], "screen")
canvas.curve(
    f"M {CM - DW} {Y['schema_dec']} L {acct_x} {Y['schema_dec']} L {acct_x} {by(Y['acct'])}",
    color="#16A34A", marker="arr_green"
)
canvas.lbg(acct_x + 50, Y["schema_dec"] - 14, "Valid", "#16A34A")

# ── 21. Entity Config ─────────────────────────────────────────────────────────
canvas.box(bx(CM), by(Y["entity"]), BW, BH, "screen")
canvas.label(CM, Y["entity"] - 12, ["Entity Config", "Identify entity from data"], "screen")
canvas.curve(
    f"M {acct_x} {by(Y['acct']) + BH} L {acct_x} {Y['entity']} L {bx(CM)} {Y['entity']}",
    color="#64748B", marker="arr"
)

# ── 22. Terminal ──────────────────────────────────────────────────────────────
canvas.box(bx(CM), by(Y["terminal"]), BW, BH, "success")
canvas.label(CM, Y["terminal"] - 12, ["Dataset Configured", "Sample file retained for Field Mapping tester"], "success")
canvas.edge(CM, by(Y["entity"]) + BH, CM, by(Y["terminal"]))

# ── Legend ────────────────────────────────────────────────────────────────────
canvas.legend([
    ("entry",    "Entry Point"),
    ("screen",   "Screen / View"),
    ("action",   "User Action"),
    ("decision", "Decision"),
    ("system",   "System / Auto"),
    ("success",  "Success / Terminal"),
    ("error",    "Error / Block"),
], x=60, y=H - 90, col_width=195)

canvas.save("/Users/alexkea/Documents/product-and-design/playspace/file-connector-flow/file-connector-user-flow.svg")
