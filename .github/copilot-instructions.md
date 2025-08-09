# GitHub Copilot Instructions

## Code Style and Readability

Ensure all code suggestions are clean, readable, and follow these formatting guidelines:

- Write proper clean and readable code.
- Proper line spacing between logical sections.
- Consistent indentation (2 or 4 spaces based on the project).
- Use optional chaining (?) where probably null or undefined or where it appropriate.
- Avoid deeply nested or overly compact code blocks.
- Match the style and structure of the existing codebase.
- Verify the code works and explain any significant changes.
- Only use comments when necessary to clarify complex logic otherwise avoid excessive comments.


##  MCP Server Path Format

When referencing paths in the MCP server tool input, always use capital `D:` at the beginning of the path.  
✅ Correct format: `D:\\projects\\...`  
❌ Incorrect format: `d:\\projects\\...`

##  Special Handling for Prompts Containing "001"

If the prompt contains `001`, prepend the following instruction at the **very beginning** of the main prompt:

> Check and inspect carefully, and give the highest priority to the MCP context .Run the related tools such as `#search_files`, `#read_file`.Search related or similar code in my #project #codebase. Also, analyze all related and similar parts within the whole #codebase ,in the #list_allowed_directories codebase , the question's `#codebase` and the codebase of your answer. Follow the existing code pattern and be inspired by it. Make sure to verify that your suggestions or changes actually work before giving your final answer. Edit my workspace or relevant `#codebase` files wherever needed to ensure correctness and let me know the changes you made.


