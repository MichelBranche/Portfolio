with open(r'c:\Users\miche\Desktop\portfolio-michelbranche v3\src\styles\globals.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

stack = []
for i, line in enumerate(lines):
    for char in line:
        if char == '{':
            stack.append(i + 1)
        elif char == '}':
            if not stack:
                print(f"Unexpected }} at line {i + 1}")
            else:
                stack.pop()

if stack:
    print(f"Unclosed {{ at lines: {stack}")
else:
    print("Braces are balanced")
