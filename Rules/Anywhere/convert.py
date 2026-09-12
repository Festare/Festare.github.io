import sys, os

def conv(line):
    line = line.strip()
    if not line or line.startswith("#"): return None
    p = line.split(",")
    if len(p) < 2: return None
    t, v = p[0].strip().upper(), p[1].strip()
    if not v: return None
    if t in ("DOMAIN-SUFFIX", "DOMAIN"): c = 2
    elif t == "DOMAIN-KEYWORD": c = 3
    elif t == "IP-CIDR": c = 1 if ":" in v else 0
    else: return None
    return f"{c}, {v}"

base = os.path.dirname(os.path.abspath(__file__))
inp = sys.argv[1] if len(sys.argv) > 1 else os.path.join(base, "input.txt")
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(base, "output.txt")

if not os.path.exists(inp):
    print(f'Файл "{inp}" не найден.'); input("Нажмите Enter..."); sys.exit(1)

with open(inp, encoding="utf-8") as f: lines = f.readlines()
res = [r for r in (conv(l) for l in lines) if r]
with open(out, "w", encoding="utf-8") as f: f.write("\n".join(res) + ("\n" if res else ""))

print(f'Готово. Результат сохранён в "{out}"'); input("Нажмите Enter...")