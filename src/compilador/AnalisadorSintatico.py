from ClassesAuxiliares import NoInterno, NoFolha, SyntaxException


class AnalisadorSintatico:

    def __init__(self, listaTokens):
        """
        Inicializa os atributos da classe.

        OBS: Não é necessário modificar este método.
        """
        self.tokens = listaTokens
        self.tokenCorrente = None
        self.posicao = -1
        self.proximoToken()

    def proximoToken(self):
        """
        Avança o próximo token da lista de tokens.
        O token corrente ficará disponível no atributo tokenCorrente.

        OBS: Não é necessário modificar este método.
        """
        if self.posicao <= len(self.tokens) - 2:
            self.posicao += 1
            self.tokenCorrente = self.tokens[self.posicao]

    def lancarErro(self, tipoEsperado=None):
        """
        Método que lança uma exceção do tipo SyntaxException.
        Ele será chamado pelo método comparar() quando o token esperado for diferente do token corrente.

        OBS: Não modifique as mensagens de erro!
        OBS: Não é necessário modificar este método.
        """
        if tipoEsperado:
            raise SyntaxException(
                f"Token inesperado: \"{self.tokenCorrente.tipo}\" ({self.tokenCorrente.valor}), tipo esperado: \"{tipoEsperado}\", na linha {self.tokenCorrente.linha}"
            )
        else:
            raise SyntaxException(
                f"Token inesperado: \"{self.tokenCorrente.tipo}\" ({self.tokenCorrente.valor}) na linha {self.tokenCorrente.linha}"
            )

    def comparar(self, tipoEsperado):
        """
        Compara o tokenCorrente com o tipo esperado (tipoEsperado) do token. Caso sejam diferentes, lança uma exceção do tipo SyntaxException.

        OBS: Não é necessário modificar este método.
        """
        tokenRetorno = self.tokenCorrente
        if self.tokenCorrente.tipo == tipoEsperado.upper():
            self.proximoToken()
        else:
            self.lancarErro(tipoEsperado)
        return tokenRetorno

    def analisar(self):
        """
        Método que será chamado para inicializar a análise sintática.
        Chama o método alg().

        Ao implementar a árvore sintática, deve retornar o resultado do método alg().
        """
        resultado = self.program()
        self.comparar("EOF")

        return resultado

    def program(self):
        self.comparar("PROGRAMA")
        str = self.str()
        self.comparar("VAR")
        var_declaration_list = self.var_declaration_list()
        block = self.block()

        return NoInterno(op="programa",
                         str=str,
                         var_declaration_list=var_declaration_list,
                         block=block)

    def str(self):
        self.comparar("DQUOTE")
        str_token = self.comparar("STR")
        self.comparar("DQUOTE")

        return NoFolha(op="str", valor=str_token.valor, linha=str_token.linha)

    def var_declaration_list(self):
        if self.tokenCorrente.tipo == "LBLOCK":
            return None
        var_declaration = self.var_declaration()
        var_declaration_list = self.var_declaration_list()
        return NoInterno(op="var_declaration_list",
                         var_declaration=var_declaration,
                         var_declaration_list=var_declaration_list)

    def var_declaration(self):
        type_token = self.comparar("TYPE")
        identifier_list = self.identifier_list()
        self.comparar("SEMICOLON")

        return NoInterno("var_declaration",
                         type=NoFolha("type", type_token.valor,
                                      type_token.linha),
                         identifier_list=identifier_list)

    def identifier_list(self):
        id_list = None
        id_token = self.comparar("ID")
        if self.tokenCorrente.tipo == "COMMA":
            self.comparar("COMMA")
            id_list = self.identifier_list()
        return NoInterno("identifier_list",
                         id=NoFolha("id", id_token.valor, id_token.linha),
                         prox=id_list)

    def block(self):
        self.comparar("LBLOCK")
        statement_list = self.statement_list()
        self.comparar("RBLOCK")
        return NoInterno("block", statement_list=statement_list)

    def statement_list(self):
        if self.tokenCorrente.tipo == "RBLOCK":
            return None
        statement = self.statement()
        return NoInterno("statement_list",
                         statement=statement,
                         prox=self.statement_list())

    def statement(self):
        if self.tokenCorrente.tipo == "SE":
            return self.if_statement()
        elif self.tokenCorrente.tipo == "ID":
            return self.assign_statement()
        elif self.tokenCorrente.tipo == "ENQUANTO":
            return self.while_statement()
        elif self.tokenCorrente.tipo == "REPITA":
            return self.repeat_statement()
        elif self.tokenCorrente.tipo == "FUNCOUT":
            return self.command_statement()

    def assign_statement(self):
        id_token = self.comparar("ID")
        self.comparar("ASSIGN")
        retorno = None
        match self.tokenCorrente.tipo:
            case "FUNCIN":
                retorno = NoInterno("assign_statement",
                                    id=NoFolha("id", id_token.valor,
                                               id_token.linha),
                                    input_statement=self.input_statement())
            case "DQUOTE":
                retorno = NoInterno("assign_statement",
                                    id=NoFolha("id", id_token.valor,
                                               id_token.linha),
                                    str=self.str())
            case _:

                retorno = NoInterno("assign_statement",
                                    id=NoFolha("id", id_token.valor,
                                               id_token.linha),
                                    expression=self.expression())
        self.comparar("SEMICOLON")
        return retorno

    def input_statement(self):
        match self.tokenCorrente.valor:
            case 'ler_numero' | 'ler_binario':
                funcin_token = self.comparar("FUNCIN")
                self.comparar("LPAR")
                str = None
                id = None
                if self.tokenCorrente.tipo == "DQUOTE":
                    str = self.str()
                else:
                    id_token = self.comparar("ID")
                    id = NoFolha("id", id_token.valor, id_token.linha)
                    
                self.comparar("RPAR")
                retorno = NoInterno("input_statement",
                                    funcin=NoFolha("funcin",
                                                   funcin_token.valor,
                                                   funcin_token.linha),
                                    str=str,
                                    id = id)
            case 'ler' | 'consultar':
                funcin_token = self.comparar("FUNCIN")
                self.comparar("LPAR")
                self.comparar("RPAR")
                retorno = NoInterno("input_statement",
                                    funcin=NoFolha("funcin",
                                                   funcin_token.valor,
                                                   funcin_token.linha))
            case 'criar_figura':
                funcin_token = self.comparar("FUNCIN")
                str_1 = None
                str_2 = None
                id_1 = None
                id_2 = None
                self.comparar("LPAR")
                if self.tokenCorrente.tipo == "DQUOTE":
                    str_1 = self.str()
                else:
                    id_token = self.comparar("ID")
                    id_1 = NoFolha("id", id_token.valor, id_token.linha)
                self.comparar("COMMA")
                if self.tokenCorrente.tipo == "DQUOTE":
                    str_2 = self.str()
                else:
                    id_token = self.comparar("ID")
                    id_2 = NoFolha("id", id_token.valor, id_token.linha)
                self.comparar("COMMA")
                sum_expression_1 = self.sum_expression()
                self.comparar("COMMA")
                sum_expression_2 = self.sum_expression()
                self.comparar("COMMA")
                sum_expression_3 = self.sum_expression()
                self.comparar("RPAR")
                retorno = NoInterno("input_statement",
                                    funcin=NoFolha("funcin",
                                                   funcin_token.valor,
                                                   funcin_token.linha),
                                    str_1=str_1,
                                    str_2=str_2,
                                    id_1=id_1,
                                    id_2=id_2,
                                    sum_expression_1=sum_expression_1,
                                    sum_expression_2=sum_expression_2,
                                    sum_expression_3=sum_expression_3)
            case 'criar_imagem':
                funcin_token = self.comparar("FUNCIN")
                id=None
                str=None
                self.comparar("LPAR")
                if self.tokenCorrente.tipo == "DQUOTE":
                    str = self.str()
                else:
                    id_token = self.comparar("ID")
                    id = NoFolha("id", id_token.valor, id_token.linha)
                self.comparar("COMMA")
                sum_expression_1 = self.sum_expression()
                self.comparar("COMMA")
                sum_expression_2 = self.sum_expression()
                self.comparar("RPAR")
                retorno = NoInterno("input_statement",
                                    funcin=NoFolha("funcin",
                                                   funcin_token.valor,
                                                   funcin_token.linha),
                                    str=str,
                                    id=id,
                                    sum_expression_1=sum_expression_1,
                                    sum_expression_2=sum_expression_2)
            case 'colidiu' | 'aleatorio':
                funcin_token = self.comparar("FUNCIN")
                self.comparar("LPAR")
                sum_expression_1 = self.sum_expression()
                self.comparar("COMMA")
                sum_expression_2 = self.sum_expression()
                self.comparar("RPAR")
                retorno = NoInterno("input_statement",
                                    funcin=NoFolha("funcin",
                                                   funcin_token.valor,
                                                   funcin_token.linha),
                                    sum_expression_1=sum_expression_1,
                                    sum_expression_2=sum_expression_2)

        return retorno

    def if_statement(self):
        self.comparar("SE")
        self.comparar("LPAR")
        expression = self.expression()
        self.comparar("RPAR")
        block_if = self.block()
        block_else = None
        if self.tokenCorrente.tipo == "SENAO":
            self.comparar("SENAO")
            block_else = self.block()
        return NoInterno("if_statement",
                         expression=expression,
                         block_if=block_if,
                         block_else=block_else)

    def while_statement(self):
        self.comparar("ENQUANTO")
        self.comparar("LPAR")
        expression = self.expression()
        self.comparar("RPAR")
        block = self.block()
        return NoInterno("while_statement", expression=expression, block=block)

    def repeat_statement(self):
        self.comparar("REPITA")
        self.comparar("LPAR")
        sum_expression = self.sum_expression()
        self.comparar("RPAR")
        block = self.block()
        return NoInterno("repeat_statement",
                         sum_expression=sum_expression,
                         block=block)

    def command_statement(self):
        match self.tokenCorrente.valor:
            case 'mostrar':
                funcout_token = self.comparar("FUNCOUT")
                self.comparar("LPAR")
                if self.tokenCorrente.tipo == "DQUOTE":
                    retorno = NoInterno("command_statement",
                                        funcout=NoFolha(
                                            "funcout", funcout_token.valor,
                                            funcout_token.linha),
                                        str=self.str())
                else:
                    retorno = NoInterno("command_statement",
                                        funcout=NoFolha(
                                            "funcout", funcout_token.valor,
                                            funcout_token.linha),
                                        sum_expression=self.sum_expression())
                self.comparar("RPAR")

            case 'limpar' | 'reverter_destaque':
                funcout_token = self.comparar("FUNCOUT")
                self.comparar("LPAR")
                self.comparar("RPAR")
                retorno = NoInterno("command_statement",
                                    funcout=NoFolha("funcout",
                                                    funcout_token.valor,
                                                    funcout_token.linha))

            case 'inicializar_com_cor' | 'inicializar_com_imagem' | 'tocar':
                funcout_token = self.comparar("FUNCOUT")
                id=None
                str=None
                self.comparar("LPAR")
                if self.tokenCorrente.tipo == "DQUOTE":
                    str = self.str()
                else:
                    id_token = self.comparar("ID")
                    id = NoFolha("id", id_token.valor, id_token.linha)
                self.comparar("RPAR")
                retorno = NoInterno("command_statement",
                                    funcout=NoFolha("funcout",
                                                    funcout_token.valor,
                                                    funcout_token.linha),
                                    str=str, id=id)

            case 'redefinir_figura':
                funcout_token = self.comparar("FUNCOUT")
                str_1=None
                str_2=None
                id_1=None
                id_2=None
                self.comparar("LPAR")
                sum_expression_1 = self.sum_expression()
                self.comparar("COMMA")
                if self.tokenCorrente.tipo == "DQUOTE":
                    str_1 = self.str()
                else:
                    id_token = self.comparar("ID")
                    id_1 = NoFolha("id", id_token.valor, id_token.linha)
                self.comparar("COMMA")
                if self.tokenCorrente.tipo == "DQUOTE":
                    str_2 = self.str()
                else:
                    id_token = self.comparar("ID")
                    id_2 = NoFolha("id", id_token.valor, id_token.linha)
                self.comparar("COMMA")
                sum_expression_2 = self.sum_expression()
                self.comparar("COMMA")
                sum_expression_3 = self.sum_expression()
                self.comparar("COMMA")
                sum_expression_4 = self.sum_expression()
                self.comparar("RPAR")

                retorno = NoInterno("command_statement",
                                    funcout=NoFolha("funcout",
                                                    funcout_token.valor,
                                                    funcout_token.linha),
                                    str_1=str_1,
                                    str_2=str_2,
                                    id_1=id_1,
                                    id_2=id_2,
                                    sum_expression_1=sum_expression_1,
                                    sum_expression_2=sum_expression_2,
                                    sum_expression_3=sum_expression_3,
                                    sum_expression_4=sum_expression_4)

            case 'redefinir_imagem':
                funcout_token = self.comparar("FUNCOUT")
                str=None
                id=None
                self.comparar("LPAR")
                sum_expression_1 = self.sum_expression()
                self.comparar("COMMA")
                if self.tokenCorrente.tipo == "DQUOTE":
                    str = self.str()
                else:
                    id_token = self.comparar("ID")
                    id = NoFolha("id", id_token.valor, id_token.linha)
                self.comparar("COMMA")
                sum_expression_2 = self.sum_expression()
                self.comparar("COMMA")
                sum_expression_3 = self.sum_expression()
                self.comparar("RPAR")
                retorno = NoInterno("command_statement",
                                    funcout=NoFolha("funcout",
                                                    funcout_token.valor,
                                                    funcout_token.linha),
                                    str=str, id=id,
                                    sum_expression_1=sum_expression_1,
                                    sum_expression_2=sum_expression_2,
                                    sum_expression_3=sum_expression_3)

            case 'mover':
                funcout_token = self.comparar("FUNCOUT")
                self.comparar("LPAR")
                sum_expression_1 = self.sum_expression()
                self.comparar("COMMA")
                sum_expression_2 = self.sum_expression()
                self.comparar("COMMA")
                sum_expression_3 = self.sum_expression()
                self.comparar("RPAR")
                retorno = NoInterno("command_statement",
                                    funcout=NoFolha("funcout",
                                                    funcout_token.valor,
                                                    funcout_token.linha),
                                    sum_expression_1=sum_expression_1,
                                    sum_expression_2=sum_expression_2,
                                    sum_expression_3=sum_expression_3)

            case 'destacar' | 'esperar':
                funcout_token = self.comparar("FUNCOUT")
                self.comparar("LPAR")
                sum_expression = self.sum_expression()
                self.comparar("RPAR")
                retorno = NoInterno("command_statement",
                                    funcout=NoFolha("funcout",
                                                    funcout_token.valor,
                                                    funcout_token.linha),
                                    sum_expression=sum_expression)

        self.comparar("SEMICOLON")
        return retorno

    def expression(self):
        esq = self.sum_expression()
        dir = None
        oper = None
        if self.tokenCorrente.tipo == "OPREL":
            oper = self.comparar("OPREL")
            oper = oper.valor
            dir = self.sum_expression()
        return NoInterno(op="expression", oper=oper, esq=esq, dir=dir)

    def sum_expression(self):
        mult_term = self.mult_term()
        return self.sum_expression2(mult_term)

    def sum_expression2(self, esq=None):
        if self.tokenCorrente.tipo == "OPSUM":
            opsum_token = self.comparar("OPSUM")
            mult_term = self.mult_term()
            no_interno = NoInterno(op="sum_expression",
                                   oper=opsum_token.valor,
                                   esq=esq,
                                   dir=mult_term)
            return self.sum_expression2(no_interno)
        else:
            return esq

    def mult_term(self):
        power_term = self.power_term()
        return self.mult_term2(power_term)

    def mult_term2(self, esq=None):
        if self.tokenCorrente.tipo == "OPMUL":
            opmul_token = self.comparar("OPMUL")
            power_term = self.power_term()
            no_interno = NoInterno(op="mult_term",
                                   oper=opmul_token.valor,
                                   esq=esq,
                                   dir=power_term)
            return self.mult_term2(no_interno)
        else:
            return esq

    def power_term(self):
        fator = self.factor()
        if not self.tokenCorrente.tipo == "OPPOW":
            return fator
        oppow_token = self.tokenCorrente
        self.comparar("OPPOW")
        termo_de_potencia = self.power_term()
        no_interno = NoInterno("power_term",
                               oper=oppow_token.valor,
                               esq=fator,
                               dir=termo_de_potencia)
        return no_interno

    def factor(self):
        nao = None
        if self.tokenCorrente.tipo == "NAO":
            nao_token = self.comparar("NAO")
            nao = NoFolha("nao", nao_token.valor, nao_token.linha)
        valor_do_operador_de_soma = "+"
        if self.tokenCorrente.tipo == "OPSUM":
            valor_do_operador_de_soma = self.comparar("OPSUM").valor
        tipo = self.tokenCorrente.tipo
        if tipo == "ID":
            id_token = self.comparar("ID")
            no_interno = NoInterno("factor",
                                   nao=nao,
                                   sinal=valor_do_operador_de_soma,
                                   esq=None,
                                   dir=None,
                                   factor=NoFolha("id", id_token.valor,
                                                  id_token.linha))
        elif tipo == "INT":
            num_token = self.comparar("INT")
            no_interno = NoInterno("factor",
                                   nao=nao,
                                   sinal=valor_do_operador_de_soma,
                                   esq=None,
                                   dir=None,
                                   factor=NoFolha("int", num_token.valor,
                                                  num_token.linha))
        elif tipo == "BOOL":
            bool_token = self.comparar("BOOL")
            no_interno = NoInterno("factor",
                                   nao=nao,
                                   sinal=valor_do_operador_de_soma,
                                   esq=None,
                                   dir=None,
                                   factor=NoFolha("bool", bool_token.valor,
                                                  bool_token.linha))
        else:
            self.comparar("LPAR")
            expressao = self.expression()
            self.comparar("RPAR")
            no_interno = NoInterno("factor",
                                   nao=nao,
                                   sinal=valor_do_operador_de_soma,
                                   esq=None,
                                   dir=None,
                                   expression=expressao)

        return no_interno
