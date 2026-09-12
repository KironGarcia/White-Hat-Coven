---
name: gitpush
description: >-
  Faz commit e push do White Hat Coven sem Co-authored-by Cursor e sem
  documentação de desenvolvimento. Use when Kiron pedir push, git push,
  subir ao GitHub, publicar no remoto, ou quando Loki for commitar neste repo.
---

# gitpush — White Hat Coven

Ler e seguir **antes** de qualquer `git add` / `git commit` / `git push` neste repositório.

## Ouro (inegociável)

1. **Nunca** incluir esta linha (nem deixar o Cursor injetá-la):

   `Co-authored-by: Cursor <cursoragent@cursor.com>`

   Ela faz o GitHub listar Cursor Agent em Contributors. Não é colaborador, mas Kiron não quer isso no repo.

2. **Nunca** subir documentação de desenvolvimento. Só o que é do **jogo** (código, arte que o app usa, README público, config de build).

## O que não entra no git

Não dar `git add` (e desfazer o stage se já estiver):

- `zim/` (checkpoints, IDEAS, prompts de frames, qualquer ZIM)
- `.cursor/agents/` (instruções do Loki / agentes — pessoal, não é o jogo)
- rascunhos de desenvolvimento que não rodam no app

O `.gitignore` já tem `zim/` e `.cursor/agents/`. Se o stage mostrar esses caminhos, correr `git rm -r --cached` neles (os arquivos ficam no disco).

## O que pode entrar

Código, `assets/` e sprites que o jogo carrega, `README.md` / `README.en.md`, `app.json`, `eas.json`, `package.json`, plugins, `midia/` usada no app. Não subir `.cursor/agents/` nem `zim/`.

## Commit sem a linha Cursor

O Cursor pode injetar o trailer depois do HEREDOC. Bloquear o hook e conferir:

```bash
git -c core.hooksPath=/dev/null commit -m "$(cat <<'EOF'
Mensagem aqui.

EOF
)"
git log -1 --format='%B'
```

Se a mensagem tiver `Co-authored-by: Cursor`:

```bash
MSG="$(git log -1 --format='%B' | grep -v 'Co-authored-by: Cursor')"
git -c core.hooksPath=/dev/null commit --amend -m "$MSG"
git log -1 --format='%B'
```

Só então `git push`. Sem essa linha no `HEAD`, não enviar.

Não usar `--no-verify` por outros motivos. Aqui `core.hooksPath=/dev/null` é só para esta regra de ouro.

## Depois do push

Confirmar `git status` limpo (ou só com `zim/` ignorado). Não force push a menos que Kiron peça explícito.
