#!/bin/bash

# Set your backup directory path
BACKUP_ROOT="/Users/jadenthompson/Backups"

# Get the latest backup folder
LATEST_BACKUP=$(ls -td "$BACKUP_ROOT"/tourlife-dashboard-2_backup_* | head -n 1)

# Validate that a backup folder exists
if [ -z "$LATEST_BACKUP" ]; then
  echo "❌ No backup folder found in $BACKUP_ROOT."
  exit 1
fi

# Confirm restoration
echo "🛠️ Restoring project from: $LATEST_BACKUP"
read -p "⚠️ This will overwrite your current project files. Are you sure? (y/n): " confirm
if [ "$confirm" != "y" ]; then
  echo "❌ Restore cancelled."
  exit 1
fi

# Clear the current folder (except the restore script and backups folder)
echo "🧹 Cleaning current project directory (excluding backups and restore script)..."
find . -mindepth 1 ! -name 'restore-tourlife.sh' ! -name 'backups' -exec rm -rf {} +

# Copy backup files back
echo "📦 Copying files from backup..."
cp -R "$LATEST_BACKUP"/* .

echo "✅ Restore complete!"
