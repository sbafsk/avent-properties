#!/bin/bash

# GitHub MCP Test Script for Avent Properties
# This script helps you test the GitHub MCP integration

echo "🧪 Testing GitHub MCP Integration..."
echo ""

# Check if .env.local exists and has GITHUB_PAT
if [ -f ".env.local" ]; then
    if grep -q "GITHUB_PAT=your_token_here" .env.local; then
        echo "⚠️  WARNING: GITHUB_PAT still has placeholder value"
        echo "   Please update .env.local with your actual GitHub token"
        echo ""
    elif grep -q "GITHUB_PAT=ghp_" .env.local; then
        echo "✅ GITHUB_PAT configured with actual token"
        echo ""
    else
        echo "❓ GITHUB_PAT status unclear - please check .env.local"
        echo ""
    fi
else
    echo "❌ .env.local not found"
    exit 1
fi

# Check cursor/config.json
if [ -f "cursor/config.json" ]; then
    if grep -q '"github"' cursor/config.json; then
        echo "✅ GitHub MCP server configured in cursor/config.json"
    else
        echo "❌ GitHub MCP server not found in cursor/config.json"
    fi
else
    echo "❌ cursor/config.json not found"
fi

echo ""
echo "🔧 Next Steps:"
echo "1. Update GITHUB_PAT in .env.local with your actual token"
echo "2. Restart Cursor completely"
echo "3. Check MCP status in Settings → Tools & Integrations → MCP Tools"
echo "4. Look for green dots indicating active servers"
echo "5. Test with: 'List my GitHub repositories'"
echo ""
echo "📚 For detailed instructions, see: docs/guides/github-mcp.md"
