with open(r'c:\Users\miche\Desktop\portfolio-michelbranche v3\src\styles\globals.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

count = 0
for i, line in enumerate(lines):
    for char in line:
        if char == '{':
            count += 1
        elif char == '}':
            count -= 1
    # Only print for the last few hundred lines to save output space
    if i > 3070:
        print(f"Line {i+1}: count={count} | {line.strip()}")
