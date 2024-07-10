from AnalisadorLexico import AnalisadorLexico
from AnalisadorSintatico import AnalisadorSintatico
from AnalisadorSemantico import AnalisadorSemantico
from GeradorCodigo import GeradorCodigo

with open('exemplos/exemplo_6_2.axe', 'r',
          encoding='utf-8') as arquivo:
  conteudo = arquivo.read()

l = AnalisadorLexico(conteudo)
s = AnalisadorSintatico(l.getToken())

arvore = s.analisar()
seman = AnalisadorSemantico(arvore)
seman.analisar()
gera = GeradorCodigo(arvore)

print(gera.gerarJavaScript())
