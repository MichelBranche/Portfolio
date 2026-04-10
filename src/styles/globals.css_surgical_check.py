with open(r'c:\Users\miche\Desktop\portfolio-michelbranche v3\src\styles\globals.css', 'r', encoding='utf-8') as f:
    content = f.read()

count = 0
for i, char in enumerate(content):
    if char == '{':
        count += 1
    elif char == '}':
        count -= 1
        if count < 0:
            # Find line number
            line_num = content[:i].count('\n') + 1
            print(f"CRITICAL: Unexpected }} found at line {line_num}")
            # Show context
            start = max(0, i - 30)
            end = min(len(content), i + 30)
            print(f"Context: {repr(content[start:end])}")
            break
else:
    if count > 0:
        print(f"CRITICAL: {count} unclosed braces at end of file")
    else:
        print("SUCCESS: Braces are balanced")
