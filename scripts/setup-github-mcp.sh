#!/bin/bash

# GitHub MCP Setup Script for Avent Properties
# This script helps you set up GitHub MCP integration

set -e

echo "🚀 Setting up GitHub MCP for Avent Properties..."
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local already exists"
    echo "📝 Please add your GitHub PAT to .env.local:"
    echo "   GITHUB_PAT=your_token_here"
    echo ""
else
    echo "📝 Creating .env.local template..."
    cat > .env.local << 'EOF'
# GitHub MCP Configuration
# Replace 'your_token_here' with your actual GitHub Personal Access Token
GITHUB_PAT=your_token_here

# GitHub MCP Toolsets
# Available: context, repos, issues, pull_requests, actions, code_security, notifications, discussions, gists
GITHUB_TOOLSETS=context,repos,issues,pull_requests,actions

# Optional: Enable read-only mode for initial testing
# GITHUB_READ_ONLY=1
EOF
    echo "✅ .env.local created"
    echo "📝 Please edit .env.local and add your actual GitHub PAT"
    echo ""
fi

# Check if cursor/config.json exists
if [ -f "cursor/config.json" ]; then
    echo "✅ cursor/config.json exists"
    
    # Check if GitHub MCP is already configured
    if grep -q '"github"' cursor/config.json; then
        echo "✅ GitHub MCP already configured in cursor/config.json"
    else
        echo "⚠️  GitHub MCP not found in cursor/config.json"
        echo "📝 Please manually add the GitHub server configuration"
        echo "   See docs/guides/github-mcp-config.md for details"
    fi
else
    echo "❌ cursor/config.json not found"
    echo "📝 Please create the cursor directory and config.json file"
fi

echo ""
echo "🔧 Next steps:"
echo "1. Get your GitHub Personal Access Token from:"
echo "   https://github.com/settings/personal-access-tokens/new"
echo "2. Add the token to .env.local"
echo "3. Ensure cursor/config.json includes the GitHub MCP server"
echo "4. Restart Cursor completely"
echo "5. Test with: 'List my GitHub repositories'"
echo ""
echo "📚 For detailed instructions, see: docs/guides/github-mcp.md"
echo "⚙️  For configuration templates, see: docs/guides/github-mcp-config.md"








