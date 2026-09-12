#!/usr/bin/env sh
# ============================================================
#  怀安在线 · 一键更新到 GitHub
#
#  用途：把本目录下所有改动提交并推送到 GitHub，
#        GitHub Pages 会自动重新发布（约 1 分钟）。
#
#  运行：Windows 双击 push.cmd
#        或在 Git Bash 里执行  bash push.sh
# ============================================================

cd "$(dirname "$0")" || exit 1

say() { printf '\n=== %s ===\n' "$1"; }

# ---------- 1. 环境检查 ----------
say "1/5 检查环境"

if ! command -v git >/dev/null 2>&1; then
  echo "[错误] 未找到 git，请先安装 Git for Windows：https://git-scm.com/download/win"
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "[错误] 当前目录不是 Git 仓库。请先执行："
  echo "       git init && git remote add origin <你的仓库地址>"
  exit 1
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
REMOTE=$(git remote | head -n 1)

if [ -z "$REMOTE" ]; then
  echo "[错误] 没有配置远端仓库（remote）。请先执行："
  echo "       git remote add origin git@github.com:用户名/仓库名.git"
  exit 1
fi

echo "本地目录：$(pwd)"
echo "分支    ：$BRANCH"
echo "远端    ：$REMOTE"

# ---------- 2. 暂存并提交 ----------
say "2/5 暂存并提交改动"

git add -A

if git diff --cached --quiet; then
  echo "没有检测到任何改动，跳过提交。"
else
  git --no-pager diff --cached --stat | tail -n 20
  MSG="更新：$(date '+%Y-%m-%d %H:%M:%S')"
  if ! git commit -m "$MSG"; then
    echo "[错误] 提交失败（可能是 Git 用户名/邮箱未设置）。"
    echo "       git config user.name  \"你的名字\""
    echo "       git config user.email \"你的邮箱\""
    exit 1
  fi
  echo "已提交：$MSG"
fi

# ---------- 3. 同步远端 ----------
say "3/5 同步远端（避免推送被拒）"

if git pull --rebase --autostash "$REMOTE" "$BRANCH" >/dev/null 2>&1; then
  echo "远端已同步。"
else
  echo "（同步跳过或失败，继续尝试推送；若冲突请手动处理）"
fi

# ---------- 4. 推送 ----------
say "4/5 推送到 GitHub"

if ! git push "$REMOTE" "$BRANCH"; then
  echo ""
  echo "[错误] 推送失败，常见原因："
  echo "  · publickey    → SSH 公钥没登记到 GitHub 账号"
  echo "  · rejected     → 远端有新提交，先执行 git pull --rebase"
  echo "  · timed out    → 网络问题，稍后重试"
  exit 1
fi

# ---------- 5. 完成 ----------
say "5/5 完成"

git --no-pager log --oneline -3

URL=$(git remote get-url "$REMOTE" 2>/dev/null)
SLUG=$(printf '%s' "$URL" | sed -E 's#^git@[^:]+:##; s#^https?://[^/]+/##; s#\.git$##')
OWNER=$(printf '%s' "$SLUG" | cut -d/ -f1 | tr 'A-Z' 'a-z')
REPO=$(printf '%s' "$SLUG" | cut -d/ -f2)

if [ -n "$OWNER" ] && [ -n "$REPO" ]; then
  echo ""
  echo "线上地址：https://${OWNER}.github.io/${REPO}/"
  echo "GitHub Pages 重建约需 1 分钟；若内容没变请按 Ctrl+F5 强制刷新。"
fi
