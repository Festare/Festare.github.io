import sys, os


def normalize_ip(value, is_v6):
    value = value.strip()
    if "/" in value:
        return value
    if is_v6:
        if value == "::":
            return "::/0"
        return f"{value}/128"
    # IPv4: угадать префикс по нулевым октетам
    parts = value.split(".")
    if len(parts) != 4 or not all(p.isdigit() for p in parts):
        return f"{value}/32"
    o2, o3, o4 = parts[1], parts[2], parts[3]
    if o4 == "0":
        if o3 == "0":
            if o2 == "0":
                return f"{value}/8"
            return f"{value}/16"
        return f"{value}/24"
    return f"{value}/32"


def conv(line):
    line = line.strip()
    if not line or line.startswith("#"):
        return None
    p = line.split(",")
    if len(p) < 2:
        return None
    t, v = p[0].strip().upper(), p[1].strip()
    if not v:
        return None
    # убрать хвостовой пробел (уже от strip) и ведущую точку
    v = v.strip()
    if v.startswith("."):
        v = v[1:]
    if not v:
        return None
    if t in ("DOMAIN-SUFFIX", "DOMAIN"):
        c = 2
    elif t == "DOMAIN-KEYWORD":
        c = 3
    elif t == "IP-CIDR":
        is_v6 = ":" in v
        c = 1 if is_v6 else 0
        v = normalize_ip(v, is_v6)
    elif t == "IP-CIDR6":
        c = 1
        v = normalize_ip(v, True)
    else:
        return None
    return f"{c}, {v}"


base = os.path.dirname(os.path.abspath(__file__))
inp = sys.argv[1] if len(sys.argv) > 1 else os.path.join(base, "input.txt")
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(base, "output.arrs")
rname = sys.argv[3] if len(sys.argv) > 3 else "Converted"

if not os.path.exists(inp):
    print(f'Файл "{inp}" не найден.')
    sys.exit(1)

with open(inp, encoding="utf-8") as f:
    lines = f.readlines()
res = [r for r in (conv(line) for line in lines) if r]
with open(out, "w", encoding="utf-8") as f:
    f.write(f"name = {rname}\n")
    if res:
        f.write("\n".join(res) + "\n")

print(f'Готово. Результат сохранён в "{out}"')
