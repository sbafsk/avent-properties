# GitHub MCP Integration Guide

This guide will walk you through integrating the GitHub MCP (Model Context Protocol) server into your Avent Properties project. The GitHub MCP server allows AI tools to directly interact with GitHub repositories, issues, pull requests, and more through natural language.

## Prerequisites

Before you start, you'll need:

1. **A compatible IDE/editor** (Cursor)
2. **GitHub Personal Access Token** with appropriate permissions
3. **Existing MCP setup** (already configured in your project)

## Current MCP Configuration

Your project already uses the following MCP servers:
- **`avent-docs`** - Documentation access (`./docs`)
- **`avent-ai`** - AI context and instructions (`./ai`)
- **`avent-standards`** - Coding standards (`./standards`)
- **`avent-root`** - Project root access (`./`)

## Step 1: Create GitHub Personal Access Token

1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/personal-access-tokens/new)
2. Click "Generate new token (classic)"
3. Set an expiration date (recommended: 90 days)
4. Select these minimum scopes:
   - `repo` - Full control of private repositories
   - `read:org` - Read org and team membership
   - `user` - Read user profile data
5. Copy the generated token (you won't see it again!)

## Step 2: Integration with Existing MCP Setup

### Option A: Remote Server (Recommended)

The remote server is hosted by GitHub and integrates seamlessly with your existing MCP configuration.

**Update your `cursor/config.json`:**

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
        "Authorization": "Bearer YOUR_GITHUB_PAT"
      }
    }
  }
}
```

### Option B: Local Docker Server (Alternative)

If you prefer local control, you can use Docker:

```json
{
  "mcpServers": {
    "avent-docs": { /* existing */ },
    "avent-ai": { /* existing */ },
    "avent-standards": { /* existing */ },
    "avent-root": { /* existing */ },
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT"
      }
    }
  }
}
```

## Step 3: Project-Specific Configuration

### Environment Variables Setup

1. **Create `.env.local` in your project root:**
```env
# GitHub MCP Configuration
GITHUB_PAT=your_token_here
GITHUB_TOOLSETS=repos,issues,pull_requests,actions
```

2. **Add to `.gitignore`:**
```gitignore
# Environment files
.env.local
.env.*.local
```

3. **Update `cursor/config.json` to use environment variables:**
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
        "Authorization": "Bearer $GITHUB_PAT"
      }
    }
  }
}
```

### Toolset Configuration

Customize which GitHub features are available:

```env
# Available toolsets for your project
GITHUB_TOOLSETS=context,repos,issues,pull_requests,actions

# Optional: Enable read-only mode for testing
GITHUB_READ_ONLY=1
```

**Recommended toolsets for Avent Properties:**
- `context` - User and GitHub context (essential)
- `repos` - Repository operations (essential)
- `issues` - Issue management (recommended)
- `pull_requests` - Pull request operations (recommended)
- `actions` - GitHub Actions workflows (optional)

## Step 4: Security Best Practices

### Token Management

1. **Use environment variables** instead of hardcoding tokens
2. **Set minimal permissions** - only what you need
3. **Regular token rotation** - every 90 days
4. **Project-specific tokens** if possible

### Permission Scopes

**Essential scopes:**
- `repo` - Repository access
- `read:org` - Team information
- `user` - Profile data

**Optional scopes:**
- `workflow` - GitHub Actions
- `read:packages` - Package access
- `write:packages` - Package publishing

## Step 5: Restart and Verify

1. **Restart Cursor completely**
2. **Check MCP status:**
   - Go to Settings → Tools & Integrations → MCP Tools
   - Look for green dots indicating active servers
3. **Test the integration:**
   - Open chat/composer in Cursor
   - Try: "List my GitHub repositories"
   - Check for "Available Tools" showing GitHub tools

## Step 6: Troubleshooting

### Common Issues

**MCP server not loading:**
- Ensure Cursor version supports MCP
- Restart Cursor completely after configuration changes
- Check JSON syntax in `cursor/config.json`

**Authentication errors:**
- Verify token has correct permissions
- Check token hasn't expired
- Ensure environment variables are loaded

**Tools not appearing:**
- Look for green dots in MCP settings
- Check Cursor logs for MCP-related errors
- Verify all servers are active

### Debug Mode

Enable debug logging in Cursor:
1. Open Command Palette (`Ctrl+Shift+P`)
2. Search for "Developer: Toggle Developer Tools"
3. Check Console for MCP-related messages

## Example Usage

Once configured, you can interact with GitHub using natural language:

**Repository Management:**
- "Show me the latest issues in avent-properties"
- "Create a new branch called 'feature/property-search'"
- "List all pull requests that need review"

**Issue Management:**
- "Create an issue for fixing the login bug"
- "Show me high-priority issues"
- "Assign the property form bug to myself"

**Code Operations:**
- "Get the contents of components/property/property-card.tsx"
- "Show me recent commits in the main branch"
- "Create a pull request for the new feature"

## Integration with Your Workflow

### Development Workflow

1. **Issue Creation**: "Create an issue for the property search feature"
2. **Branch Management**: "Create a feature branch for the new component"
3. **Code Review**: "Show me PRs that need my review"
4. **Deployment**: "Check the status of the latest deployment"

### Documentation Workflow

1. **Update docs**: "Create a PR for updating the API documentation"
2. **Review changes**: "Show me all documentation-related PRs"
3. **Issue tracking**: "List issues tagged with 'documentation'"

## Next Steps

1. **Test basic functionality** with repository listing
2. **Explore available tools** in Cursor's tool panel
3. **Integrate with your development workflow** for automated tasks
4. **Set up project-specific configurations** for team collaboration

## Security Considerations

- **Never commit tokens** to version control
- **Use environment variables** for sensitive data
- **Regular token rotation** for security
- **Monitor token usage** in GitHub settings
- **Consider read-only mode** for initial testing

The GitHub MCP server enables powerful AI-driven repository management, making it easier to handle GitHub operations through natural language commands within your development environment while maintaining consistency with your existing MCP setup.