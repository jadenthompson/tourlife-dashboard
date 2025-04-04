#!/bin/bash

# Backup script for TourLife
PROJECT_NAME="tourlife-dashboard-2"
BACKUP_DIR=~/Backups
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
DEST="$BACKUP_DIR/${PROJECT_NAME}_backup_$TIMESTAMP"

echo "🔄 Backing up $PROJECT_NAME to $DEST..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Copy project folder
cp -R ~/Downloads/$PROJECT_NAME "$DEST"

echo "✅ Backup complete!"
echo "📁 Saved to: $DEST"
