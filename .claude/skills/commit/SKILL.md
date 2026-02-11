---
name: commit
description: Conventional Commits 형식 자동 커밋
disable-model-invocation: true
allowed-tools: Bash
---

1. `git status`·`git diff` 병렬. 변경 없으면 종료.
2. 개별 `git add` → `git commit -m "<type>: <한글 subject>"`.
3. type=feat|fix|refactor|chore|docs|style. subject=한글 30자 이내, 명사형 종결.