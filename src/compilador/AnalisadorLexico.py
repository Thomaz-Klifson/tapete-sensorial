# -*- coding: utf-8 -*-

from ClassesAuxiliares import LexicalException, Token


class AnalisadorLexico:
    """
    Uma classe de analisador léxico para processar tokens em um arquivo de código-fonte
    de acordo com um conjunto predefinido de regras e símbolos.
    """

    # Dicionário mapeando literais de string para seus respectivos tipos de token.
    simbolos = {
        'programa': 'PROGRAMA',
        'var': 'VAR',
        'binario': 'TYPE',
        'numero': 'TYPE',
        'texto': 'TYPE',
        'se': 'SE',
        'senao': 'SENAO',
        'enquanto': 'ENQUANTO',
        'repita': 'REPITA',
        'v': 'BOOL',
        'f': 'BOOL',
        ':': 'ASSIGN',
        ',': 'COMMA',
        ';': 'SEMICOLON',
        '(': 'LPAR',
        ')': 'RPAR',
        '{': 'LBLOCK',
        '}': 'RBLOCK',
        'ler_numero': 'FUNCIN',
        'ler_binario': 'FUNCIN',
        'ler': 'FUNCIN',
        'consultar': 'FUNCIN',
        'criar_figura': 'FUNCIN',
        'criar_imagem': 'FUNCIN',
        'colidiu': 'FUNCIN',
        'aleatorio': 'FUNCIN',
        'mostrar': 'FUNCOUT',
        'limpar': 'FUNCOUT',
        'inicializar_com_cor': 'FUNCOUT',
        'inicializar_com_imagem': 'FUNCOUT',
        'redefinir_figura': 'FUNCOUT',
        'redefinir_imagem': 'FUNCOUT',
        'mover': 'FUNCOUT',
        'destacar': 'FUNCOUT',
        'reverter_destaque': 'FUNCOUT',
        'tocar': 'FUNCOUT',
        'esperar': 'FUNCOUT',
        'nao': 'NAO',
        '=': 'OPREL',
        '!=': 'OPREL',
        '<': 'OPREL',
        '<=': 'OPREL',
        '>': 'OPREL',
        '>=': 'OPREL',
        '+': 'OPSUM',
        '-': 'OPSUM',
        'ou': 'OPSUM',
        '*': 'OPMUL',
        '/': 'OPMUL',
        '%': 'OPMUL',
        'e': 'OPMUL',
        '^': 'OPPOW',
    }

    def __init__(self, codigoFonte):
        """
        Inicializa o analisador léxico com o código fonte, remove comentários e imprime os tokens gerados.

        :param codigoFonte: Uma string contendo todo o código fonte a ser analisado.
        """
        self.codigo = codigoFonte
        self.codigo = self.removeComentarios()

    def removeComentarios(self):
        """
        Remove comentários de linha única e comentários de múltiplas linhas do código fonte.

        :return: Uma string do código fonte com todos os comentários removidos.
        """
        string = False
        comentario = False  # booleano para comentario de uma linha
        multi = False  # booleando para comentario de multiplas linhas
        string_resultante = ""
        for i in range(len(self.codigo)):
            if i + 1 == len(self.codigo) and self.codigo[i] == "/":
                if self.codigo[i - 1] == "#":
                    break
                else:
                    string_resultante = string_resultante + self.codigo[i]
                    break
            if self.codigo[i] == "\"":
                string = not string
            if self.codigo[i] == "#" and string == False:
                comentario = True
            if self.codigo[i] == "/" and self.codigo[i + 1] == "#":
                multi = True
            if self.codigo[i] == '\n':
                comentario = False
            if (comentario == False
                    and multi == False) or self.codigo[i] == '\n':
                string_resultante = string_resultante + self.codigo[i]
            if self.codigo[i - 1] == "#" and self.codigo[i] == "/":
                multi = False
                comentario = False
        return string_resultante

    def getToken(self):
        """
        Tokeniza o código fonte processado em uma lista de objetos Token baseada nos símbolos definidos.

        :return: Uma lista de objetos Token representando os tokens no código fonte.
        """
        tokens = []
        linha = 1
        i = 0
        while i < len(self.codigo):
            lexema = ""
            if self.codigo[i] == '\n':
                linha += 1
                i += 1
                continue
            if self.codigo[i].isspace():
                i += 1
                continue

            if self.codigo[i] in AnalisadorLexico.simbolos and self.codigo[
                    i] != "e" and self.codigo[i] != "v" and self.codigo[
                        i] != "f":
                lexema_de_dois_caracteres = self.codigo[i:i + 2]
                if lexema_de_dois_caracteres in ["<=", ">="]:
                    tokens.append(
                        Token(
                            AnalisadorLexico.
                            simbolos[lexema_de_dois_caracteres],
                            lexema_de_dois_caracteres, linha))
                    i += 2
                else:
                    tokens.append(
                        Token(AnalisadorLexico.simbolos[self.codigo[i]],
                              self.codigo[i], linha))
                    i += 1
            elif self.codigo[i:i + 2] == "!=":
                tokens.append(
                    Token(AnalisadorLexico.simbolos[self.codigo[i:i + 2]],
                          self.codigo[i:i + 2], linha))
                i += 2

            elif self.codigo[i].isalpha():
                lexema += self.codigo[i]
                if i + 1 == len(self.codigo) - 1:
                    if self.codigo[i + 1].isalpha() or self.codigo[
                            i + 1].isnumeric() or self.codigo[i + 1] == "_":
                        lexema += self.codigo[i + 1]
                        if lexema.lower() in AnalisadorLexico.simbolos:
                            tokens.append(
                                Token(AnalisadorLexico.simbolos[lexema],
                                      lexema.lower(), linha))
                            break
                        else:
                            tokens.append(Token("ID", lexema.lower(), linha))
                            break
                elif i == len(self.codigo) - 1:
                    if lexema.lower() in AnalisadorLexico.simbolos:
                        tokens.append(
                            Token(AnalisadorLexico.simbolos[lexema],
                                  lexema.lower(), linha))
                        break
                    else:
                        tokens.append(Token("ID", lexema.lower(), linha))
                        break
                i += 1

                while self.codigo[i].isalpha() or self.codigo[i].isnumeric(
                ) or self.codigo[i] == "_":
                    lexema += self.codigo[i]
                    i += 1
                    if i == len(self.codigo):
                        break
                if lexema.lower() in AnalisadorLexico.simbolos:
                    tokens.append(
                        Token(AnalisadorLexico.simbolos[lexema.lower()],
                              lexema.lower(), linha))
                else:
                    tokens.append(Token("ID", lexema.lower(), linha))
                lexema = ""

            elif self.codigo[i].isnumeric():
                lexema += self.codigo[i]
                if i + 1 == len(
                        self.codigo) - 1 and self.codigo[i + 1].isnumeric():
                    lexema += self.codigo[i]
                    tokens.append(Token("ID", lexema.lower(), linha))
                    break
                elif i == len(self.codigo) - 1:
                    tokens.append(Token("ID", lexema.lower(), linha))
                    break
                i += 1

                while self.codigo[i].isnumeric():
                    lexema += self.codigo[i]
                    i += 1
                    if i == len(self.codigo):
                        break
                tokens.append(Token("INT", lexema, linha))
                lexema = ""

            elif self.codigo[i] == "\"":
                tokens.append(Token("DQUOTE", "\"", linha))
                i += 1
                new_string = ""
                while True:
                    if self.codigo[i] == "\"" and self.codigo[i - 1] != '\\':
                        break
                    if self.codigo[i] == "\\" and self.codigo[i + 1] == "\"":
                        i += 1
                        continue
                    new_string += self.codigo[i]
                    i += 1
                tokens.append(Token("STR", new_string, linha))
                i += 1
                tokens.append(Token("DQUOTE", "\"", linha))

            else:
                raise LexicalException(
                    f"Caractere inválido na linha {linha}: {self.codigo[i]}")

        tokens.append(Token("EOF", "EOF", linha))
        return tokens


if __name__ == "__main__":
    with open('src/compilador/exemplos/exemplo1.fofi', 'r',
              encoding='utf-8') as arquivo:
        conteudo = arquivo.read()

    AnalisadorLexico(conteudo)
