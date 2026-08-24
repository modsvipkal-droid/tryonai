import io

files = [r"pages\terms.js", r"pages\privacy.js", r"pages\refund.js"]

old_line = "  html, body { background: #f8fafc !important; color: #1e293b !important; font-family: 'Inter', sans-serif; overflow: auto !important; }"
new_line = "  html, body, #__next { background: #eef7f3 !important; color: #1e293b !important; font-family: 'Inter', sans-serif; height: auto !important; min-height: 100% !important; overflow: visible !important; overflow-y: auto !important; overscroll-behavior: auto !important; scroll-behavior: smooth !important; -webkit-overflow-scrolling: touch; }"

imp_old = 'import { useRouter } from "next/router";'
imp_new = 'import { useEffect } from "react";\nimport { useRouter } from "next/router";'

hook = '''export default function TermsAndConditions() {
  const router = useRouter();
'''
hook_new = '''export default function TermsAndConditions() {
  const router = useRouter();

  // Restore normal document scrolling on this full-page layout.
  useEffect(() => {
    const el = document.documentElement;
    el.classList.add("legal-page");
    return () => el.classList.remove("legal-page");
  }, []);
'''

for f in files:
    with open(f, encoding="utf-8") as fh:
        c = fh.read()

    ok_bg = old_line in c
    c = c.replace(old_line, new_line)

    ok_imp = imp_old in c and "import { useEffect }" not in c
    if ok_imp:
        c = c.replace(imp_old, imp_new, 1)

    ok_hook = hook in c
    if ok_hook:
        c = c.replace(hook, hook_new, 1)

    with open(f, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(c)

    print(f, "| bg:", ok_bg, "| import:", ok_imp, "| hook:", ok_hook)
