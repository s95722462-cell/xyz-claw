# 래더 원문(ladder/*_il.txt)을 페이지 템플릿에 넣어 index.html(인형 뽑기)·gantry.html(XYZ 시뮬레이터)을 만든다.
# 실행: python build.py
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ORDER = ['XYZ_SYS', 'XYZ_ERR', 'XYZ_HOME', 'XYZ_MANU', 'XYZ_AUTO', 'XYZ_MT', 'XYZ_GOT']
progs = [{'name': n, 'lines': open(os.path.join(HERE, 'ladder', n + '_il.txt'), encoding='utf-8').read().splitlines()} for n in ORDER]
HEAD = '<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">\n<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>\n</head>\n<body>\n'
gantry = open(os.path.join(HERE, 'src', 'gantry_template.html'), encoding='utf-8').read()
a = gantry.index('const PROGRAMS = /*PROGRAMS*/[];'); b = gantry.index('// ───────── 실행 루프')
core = gantry[a:b].replace('/*PROGRAMS*/[]', json.dumps(progs, ensure_ascii=False))
claw = open(os.path.join(HERE, 'src', 'claw_template.html'), encoding='utf-8').read().replace('/*CORE*/', core)
gantry = gantry.replace('/*PROGRAMS*/[]', json.dumps(progs, ensure_ascii=False))
for name, body in (('index.html', claw), ('gantry.html', gantry)):
    open(os.path.join(HERE, name), 'w', encoding='utf-8').write(HEAD + body + '\n</body>\n</html>\n')
    print(name, len(body))
