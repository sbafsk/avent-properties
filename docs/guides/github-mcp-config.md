# GitHub MCP Configuration Template

This file contains the configuration templates for integrating GitHub MCP with your Avent Properties project.

## Environment Variables Template

Create a `.env.local` file in your project root with the following content:

```env
# GitHub MCP Configuration
# Replace 'your_token_here' with your actual GitHub Personal Access Token
GITHUB_PAT=your_token_here

# GitHub MCP Toolsets
# Available: context, repos, issues, pull_requests, actions, code_security, notifications, discussions, gists
GITHUB_TOOLSETS=context,repos,issues,pull_requests,actions

# Optional: Enable read-only mode for initial testing
# GITHUB_READ_ONLY=1
```

## MCP Configuration Update

Update your `cursor/config.json` to include the GitHub MCP server:

```json
{
  "mcpServers": {
    "avent-docs": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "./docs"]
    },
    "avent-ai": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "./ai"]
    },
    "avent-standards": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "./standards"]
    },
    "avent-root": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "./"]
    },
    "github": {
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer $GITHUB_PAT"
      }
    }
  }
}
```

## Alternative: Direct Token Configuration

If you prefer not to use environment variables, you can directly configure the token:

```json
{
  "mcpServers": {
    "avent-docs": { /* existing */ },
    "avent-ai": { /* existing */ },
    "avent-standards": { /* existing */ },
    "avent-root": { /* existing */ },
    "github": {
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer YOUR_ACTUAL_TOKEN_HERE"
      }
    }
  }
}
```

## Security Notes

⚠️ **Important**: 
- Never commit your actual GitHub token to version control
- Use environment variables when possible
- Consider using read-only mode for initial testing
- Rotate your token regularly (every 90 days)

## Next Steps

1. Create the `.env.local` file with your token
2. Update `cursor/config.json` with the GitHub MCP server
3. Restart Cursor completely
4. Test the integration with "List my GitHub repositories"








