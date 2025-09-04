#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/iterm_tab.sh iTerm2 "Platform App" nx run eDB:serve --devRemotes=mfe-edb-admin
#   ./scripts/iterm_tab.sh iTerm  "Platform API" nx serve platform-api

DISABLE_AUTO_TITLE="true"


APP="${1:-iTerm2}"; shift
TITLE="${1:-Tab}";  shift
CMD="$*"

# Where to run the command
WORKDIR="${WORKDIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

osascript <<OSA
tell application "$APP"
  activate
  if (count of windows) = 0 then
    set newWindow to (create window with default profile)
    tell current session of newWindow
      set name to "$TITLE"
      -- set tab & window titles via OSC, built inside AppleScript to avoid shell quoting issues
      write text (ASCII character 27) & "]1;" & "$TITLE" & (ASCII character 7)
      write text (ASCII character 27) & "]2;" & "$TITLE" & (ASCII character 7)
      write text "cd \"$WORKDIR\"; $CMD"
    end tell
  else
    tell current window
      create tab with default profile
      tell current session
        set name to "$TITLE"
        write text (ASCII character 27) & "]1;" & "$TITLE" & (ASCII character 7)
        write text (ASCII character 27) & "]2;" & "$TITLE" & (ASCII character 7)
        write text "cd \"$WORKDIR\"; $CMD"
      end tell
    end tell
  end if
end tell
OSA
