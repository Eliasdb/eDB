#!/usr/bin/env bash
set -euo pipefail

# --- Color + UTF-8 detection ---
COLOR=${COLOR:-1}
UTF8_OK=0; locale | grep -qi 'utf-8' && UTF8_OK=1
if [[ $COLOR -eq 1 ]] && command -v tput >/dev/null && [[ $(tput colors 2>/dev/null || echo 0) -ge 8 ]]; then
  _RST="$(tput sgr0)"; _BOLD="$(tput bold)"
  _CYAN="$(tput setaf 6)"; _GREEN="$(tput setaf 2)"; _YEL="$(tput setaf 3)"; _RED="$(tput setaf 1)"
else
  _RST=""; _BOLD=""; _CYAN=""; _GREEN=""; _YEL=""; _RED=""
fi

if [[ $UTF8_OK -eq 1 ]]; then
  _TL='┌'; _TR='┐'; _BL='└'; _BR='┘'; _H='─'; _V='│'
  _SPIN_FRAMES=(⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏)
else
  _TL='+'; _TR='+'; _BL='+'; _BR='+'; _H='-'; _V='|'
  _SPIN_FRAMES=(\| / - \\)
fi

# --- Width-safe helpers (compute on plain strings) ---
_repeat(){ local ch="$1" n="$2"; printf "%*s" "$n" "" | tr ' ' "$ch"; }
_spaces(){ printf "%*s" "$1" ""; }

box() { # box "Title" line1 line2 ...
  local title="$1"; shift
  local w=${#title} line
  for line in "$@"; do (( ${#line} > w )) && w=${#line}; done
  local inner=$((w + 2))
  printf "${_CYAN}%s%s%s${_RST}\n" "$_TL" "$(_repeat "$_H" "$inner")" "$_TR"
  printf "${_CYAN}%s ${_RST}%s%s ${_CYAN}%s${_RST}\n" "$_V" "${_BOLD}${title}${_RST}" "$(_spaces $((w - ${#title})))" "$_V"
  printf "${_CYAN}%s%s%s${_RST}\n" "$_TL" "$(_repeat "$_H" "$inner")" "$_TR"
  for line in "$@"; do
    printf "${_CYAN}%s ${_RST}%s%s ${_CYAN}%s${_RST}\n" "$_V" "$line" "$(_spaces $((w - ${#line})))" "$_V"
  done
  printf "${_CYAN}%s%s%s${_RST}\n" "$_BL" "$(_repeat "$_H" "$inner")" "$_BR"
}

actions_box() { # numbered list
  local title="$1"; shift
  local lines=("$@") i=0 numw=0 n=${#lines[@]}
  while (( n > 0 )); do numw=$((numw+1)); n=$((n/10)); done
  [[ $numw -eq 0 ]] && numw=1
  local out=()
  for l in "${lines[@]}"; do i=$((i+1)); out+=( "$(printf "%${numw}d) %s" "$i" "$l")" ); done
  box "$title" "${out[@]}"
}

ok()   { printf "${_GREEN}✔ %s${_RST}\n" "$*"; }
info() { printf "${_CYAN}• %s${_RST}\n" "$*"; }
warn() { printf "${_YEL}• %s${_RST}\n" "$*"; }
err()  { printf "${_RED}✖ %s${_RST}\n" "$*"; }

# --- Spinner + step runner (no bleed) ---
__STEP_MSG=""
__CAN_TPUT=0; command -v tput >/dev/null && __CAN_TPUT=1
__erase_line(){ printf "\r"; [[ $__CAN_TPUT -eq 1 ]] && tput el 2>/dev/null || true; }

SPINNER=${SPINNER:-1}
spinner_start(){ # spinner_start "Message"
  __STEP_MSG="$1"
  [[ $SPINNER -eq 1 ]] || { printf "${_CYAN}• %s…${_RST}" "$__STEP_MSG"; __erase_line; return; }
  (
    i=0
    while :; do
      printf "${_CYAN}• %s… %s${_RST}" "$__STEP_MSG" "${_SPIN_FRAMES[$((i%${#_SPIN_FRAMES[@]}))]}"
      __erase_line
      sleep 0.12
      i=$((i+1))
    done
  ) &
  __SPIN_PID=$!
}

spinner_stop(){ # spinner_stop
  if [[ -n "${__SPIN_PID:-}" ]]; then kill "${__SPIN_PID}" >/dev/null 2>&1 || true; wait "${__SPIN_PID}" 2>/dev/null || true; unset __SPIN_PID; fi
  __erase_line
}
step_skip(){ spinner_stop; printf "${_YEL}• %s (skipped)${_RST}\n" "${1:-$__STEP_MSG}"; __STEP_MSG=""; }
step_ok(){   spinner_stop; printf "${_GREEN}✔ %s${_RST}\n" "${1:-$__STEP_MSG}"; __STEP_MSG=""; }
step_fail(){ spinner_stop; printf "${_RED}✖ %s${_RST}\n"  "${1:-$__STEP_MSG}"; __STEP_MSG=""; }
# after step_fail
# Run a command with spinner: run_step "msg" <cmd> [args...]
run_step(){ local msg="$1"; shift; spinner_start "$msg"; if "$@"; then step_ok "$msg"; else step_fail "$msg"; return 1; fi }
# Run a shell snippet with spinner: run_step_sh "msg" "SQL or shell…"
run_step_sh(){ local msg="$1" code="$2"; spinner_start "$msg"; if bash -ceu "$code"; then step_ok "$msg"; else step_fail "$msg"; return 1; fi }