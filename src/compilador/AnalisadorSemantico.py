# -*- coding: utf-8 -*-

from ClassesAuxiliares import NoTabela, SemanticException


class AnalisadorSemantico:
    """
    Classe responsável pela análise semântica de uma árvore sintática.
    """

    def __init__(self, arvoreSintatica):
        """
        Inicializa a classe AnalisadorSemantico com a árvore sintática fornecida.

        Parâmetros:
        arvoreSintatica (No): A árvore sintática a ser analisada.
        """
        self.arvore = arvoreSintatica
        self.tabela = {
        }  # dicionário que representa a tabela de simbolos: armazena "linhas" do tipo NoTabela

    def analisar(self):
        """
        Método principal para iniciar a análise semântica.
        """
        self.visitarPrograma()

    def visitarPrograma(self):
        """
        Visita o nó do programa na árvore sintática, inicializando a análise das declarações e do bloco de código.
        """
        self.tabela[self.arvore.get('str').valor] = NoTabela(valor=None,
                                                             tipo="programa")
        self.visitarDeclarations(self.arvore.get('var_declaration_list'))
        self.visitarBlock(self.arvore.get('block'))

    def visitarDeclarations(self, noDeclarations):
        """
        Visita a lista de declarações de variáveis na árvore sintática.

        Parâmetros:
        noDeclarations (No): Nó da árvore sintática que contém a lista de declarações de variáveis.
        """
        if noDeclarations:
            var_declaration = noDeclarations.get('var_declaration')
            self.visitarVarDeclaration(var_declaration)
            if noDeclarations.get('var_declaration_list'):
                self.visitarDeclarations(
                    noDeclarations.get('var_declaration_list'))

    def visitarVarDeclaration(self, noVarDeclaration):
        """
        Visita uma declaração de variável na árvore sintática e atualiza a tabela de símbolos.

        Parâmetros:
        noVarDeclaration (No): Nó da árvore sintática que contém a declaração de variável.
        """
        if noVarDeclaration:
            tipo = noVarDeclaration.get('type').valor
            identifier_list = noVarDeclaration.get('identifier_list')
            while identifier_list:
                if identifier_list.get('id').valor in self.tabela.keys():
                    raise SemanticException(
                        f"O identificador \"{identifier_list.get('id').valor}\" na linha {identifier_list.get('id').linha} foi declarado anteriormente"
                    )
                else:
                    self.tabela[identifier_list.get('id').valor] = NoTabela(
                        None, tipo)
                identifier_list = identifier_list.get('prox')

    def visitarBlock(self, noBlock):
        """
        Visita um bloco de código na árvore sintática e realiza a análise semântica das declarações contidas.

        Parâmetros:
        noBlock (No): Nó da árvore sintática que contém o bloco de código.
        """
        if noBlock:
            statement_list = noBlock.get('statement_list')
            while statement_list:
                statement = statement_list.get('statement')
                if statement.op == "assign_statement":
                    if statement.get('id').valor in self.tabela:
                        tipo = self.tabela[statement.get('id').valor].tipo
                        if tipo == 'texto':
                            self.tabela[statement.get(
                                'id').valor].valor = statement.get('id').valor
                    else:
                        raise SemanticException(
                            f"O identificador \"{statement.get('id').valor}\" na linha {statement.get('id').linha} não foi declarado"
                        )
                    if statement.get('expression'):
                        valor_expression = self.visitarExpression(
                            statement.get('expression'))
                        if valor_expression.tipo == tipo:
                            self.tabela[statement.get(
                                'id').valor].valor = statement.get('id').valor
                        else:
                            raise SemanticException(
                                f"O identificador \"{statement.get('id').valor}\" na linha {statement.get('id').linha} não pode receber uma expressão do tipo \"{valor_expression.tipo}\""
                            )
                    str = statement.get('str')
                    if str is not None:
                        if tipo != "texto":
                            raise SemanticException(
                                f"O identificador \"{statement.get('id').valor}\" na linha {statement.get('id').linha} não pode receber um valor do tipo {tipo}"
                            )
                    input_statement = statement.get('input_statement')
                    if input_statement is not None:
                        visitar_input_statement_result = self.visitarInputStatement(
                            input_statement)
                        if visitar_input_statement_result != tipo:
                            raise SemanticException(
                                f"O identificador \"{statement.get('id').valor}\" na linha {statement.get('id').linha} não pode receber um valor do tipo \"{visitar_input_statement_result}\""
                            )
                        else:
                            self.tabela[statement.get(
                                'id').valor].valor = statement.get('id').valor

                elif statement.op == "if_statement":
                    self.visitarExpression(statement.get('expression'))
                    self.visitarBlock(statement.get('block_if'))
                    if statement.get('block_else'):
                        self.visitarBlock(statement.get('block_else'))
                elif statement.op == "while_statement":
                    self.visitarExpression(statement.get("expression"))
                    self.visitarBlock(statement.get("block"))
                elif statement.op == "repeat_statement":
                    sum_expression_result = self.visitarSumExpression(
                        statement.get("sum_expression"))
                    if sum_expression_result.tipo != "numero":
                        raise SemanticException(
                            "A função \"repita()\" só pode receber um argumento do tipo \"numero\""
                        )
                    self.visitarBlock(statement.get("block"))
                elif statement.op == "command_statement":
                    self.visitarCommandStatement(statement)
                statement_list = statement_list.get("prox")

    def visitarInputStatement(self, noInputStatement):
        """
        Visita uma declaração de entrada na árvore sintática e realiza a análise semântica.

        Parâmetros:
        noInputStatement (No): Nó da árvore sintática que contém a declaração de entrada.

        Retorna:
        str: O tipo de dado resultante da análise da declaração de entrada.
        """
        function_name = noInputStatement.get("funcin").valor
        function_linha = noInputStatement.get("funcin").linha

        match function_name:
            case "ler_numero":
                id = noInputStatement.get("id")
                if id:
                    if id.valor not in self.tabela.keys():
                        raise SemanticException(f"O argumento {id.valor} na função \"{function_name}\", da linha {function_linha}, não foi declarado.")
                    
                    if self.tabela[id.valor].tipo != "texto":
                        raise SemanticException(f"O argumento {id.valor} na função \"{function_name}\", da linha {function_linha}, deveria ser do tipo \"texto\" e foi passado do tipo \"{self.tabela[id.valor].tipo}\".")
                return "numero"
            case "ler_binario":
                id = noInputStatement.get("id")
                if id:
                    if id.valor not in self.tabela.keys():
                        raise SemanticException(f"O argumento {id.valor} na função \"ler_binario()\", da linha {function_linha}, não foi declarado.")
                    
                    if self.tabela[id.valor].tipo != "texto":
                        raise SemanticException(f"O argumento {id.valor} na função \"ler_binario()\", da linha {function_linha}, deveria ser do tipo \"texto\" e foi passado do tipo \"{self.tabela[id.valor].tipo}\".")
                
                return "binario"
            case "ler":
                pass
                return "numero"
            case "consultar":
                pass
                return "numero"
            case "criar_figura":
                str_1 = noInputStatement.get("str_1")
                str_2 = noInputStatement.get("str_2")
                id_1 = noInputStatement.get("id_1")
                id_2 = noInputStatement.get("id_2")
                sum_expression_1 = noInputStatement.get("sum_expression_1")
                sum_expression_2 = noInputStatement.get("sum_expression_2")
                sum_expression_3 = noInputStatement.get("sum_expression_3")

                if str_1 is not None:
                    pass
                if str_2 is not None:
                    pass

                if id_1 is not None:
                    if id_1.valor not in self.tabela.keys():
                        raise SemanticException(f"O argumento {id_1.valor} na função \"{function_name}\", da linha {function_linha}, não foi declarado.")
                   
                    if self.tabela[id_1.valor].tipo != "texto":
                        raise SemanticException(f"O argumento {id_1.valor} na função \"{function_name}\", da linha {function_linha}, deveria ser do tipo \"texto\" e foi passado do tipo \"{self.tabela[id_1.valor].tipo}\".")
                if id_2 is not None:
                    if id_2.valor not in self.tabela.keys():
                        raise SemanticException(f"O argumento {id_2.valor} na função \"{function_name}\", da linha {function_linha}, não foi declarado.")

                    if self.tabela[id_2.valor].tipo != "texto":
                        raise SemanticException(f"O argumento {id_2.valor} na função \"{function_name}\", da linha {function_linha}, deveria ser do tipo \"texto\" e foi passado do tipo \"{self.tabela[id_2.valor].tipo}\".")
                
                if sum_expression_1 is not None:
                    sum_expression_1_result = self.visitarSumExpression(
                        sum_expression_1)
                    if sum_expression_1_result.tipo != "numero":
                        raise SemanticException(
                            f"O terceiro argumento da função \"{function_name}\" na linha \"{function_linha}\" deveria ser do tipo numero, mas foi passado com o tipo \"{sum_expression_1_result.tipo}\""
                        )
                if sum_expression_2 is not None:
                    sum_expression_2_result = self.visitarSumExpression(
                        sum_expression_2)
                    if sum_expression_2_result.tipo != "numero":
                        raise SemanticException(
                            f"O quarto argumento da função \"{function_name}\" na linha \"{function_linha}\" deveria ser do tipo numero, mas foi passado o tipo \"{sum_expression_2_result.tipo}\""
                        )
                if sum_expression_3 is not None:
                    sum_expression_3_result = self.visitarSumExpression(
                        sum_expression_3)
                    if sum_expression_3_result.tipo != "numero":
                        raise SemanticException(
                            f"O quinto  argumento da função \"{function_name}\" na linha \"{function_linha}\" deveria ser do tipo numero, mas foi passado o tipo \"{sum_expression_3_result.tipo}\""
                        )
                return "numero"
            case "criar_imagem":
                str = noInputStatement.get("str")
                id = noInputStatement.get("id")
                sum_expression_1 = noInputStatement.get("sum_expression_1")
                sum_expression_2 = noInputStatement.get("sum_expression_2")
                if str is not None:
                    self.validar_path(str)
                if id is not None:
                    if id.valor not in self.tabela.keys():
                        raise SemanticException(f"O argumento {id.valor} na função \"{function_name}\", da linha {function_linha}, não foi declarado.")
                    
                    if self.tabela[id.valor].tipo != "texto":
                        raise SemanticException(f"O argumento {id.valor} na função \"{function_name}\", da linha {function_linha}, deveria ser do tipo \"texto\" e foi passado do tipo \"{self.tabela[id.valor].tipo}\".")
                 
                if sum_expression_1 is not None:
                    sum_expression_1_result = self.visitarSumExpression(
                        sum_expression_1)
                    if sum_expression_1_result.tipo != "numero":
                        raise SemanticException(
                            f"O segundo argumento da função \"{function_name}\" na linha \"{function_linha}\" deveria ser do tipo numero, mas foi passado com o tipo \"{sum_expression_1_result.tipo}\""
                        )
                if sum_expression_2 is not None:
                    sum_expression_2_result = self.visitarSumExpression(
                        sum_expression_2)
                    if sum_expression_2_result.tipo != "numero":
                        raise SemanticException(
                            f"O terceiro argumento da função \"{function_name}\" na linha \"{function_linha}\" deveria ser do tipo numero, mas foi passado o tipo \"{sum_expression_2_result.tipo}\""
                        )
                return "numero"
            case "colidiu":
                sum_expression_1 = noInputStatement.get("sum_expression_1")
                sum_expression_2 = noInputStatement.get("sum_expression_2")
                if sum_expression_1 is not None:
                    sum_expression_1_result = self.visitarSumExpression(
                        sum_expression_1)
                    if sum_expression_1_result.tipo != "numero":
                        raise SemanticException(
                            f"O primeiro argumento da função \"{function_name}\" na linha \"{function_linha}\" deveria ser do tipo numero, mas foi passado com o tipo \"{sum_expression_1_result.tipo}\""
                        )
                if sum_expression_2 is not None:
                    sum_expression_2_result = self.visitarSumExpression(
                        sum_expression_2)
                    if sum_expression_2_result.tipo != "numero":
                        raise SemanticException(
                            f"O segundo argumento da função \"{function_name}\" na linha \"{function_linha}\" deveria ser do tipo numero, mas foi passado o tipo \"{sum_expression_2_result.tipo}\""
                        )
                return "binario"
            case "aleatorio":
                sum_expression_1 = noInputStatement.get("sum_expression_1")
                sum_expression_2 = noInputStatement.get("sum_expression_2")
                if sum_expression_1 is not None:
                    sum_expression_1_result = self.visitarSumExpression(
                        sum_expression_1)
                    if sum_expression_1_result.tipo != "numero":
                        raise SemanticException(
                            f"O primeiro argumento da função \"{function_name}\" na linha \"{function_linha}\" deveria ser do tipo numero, mas foi passado com o tipo \"{sum_expression_1_result.tipo}\""
                        )
                if sum_expression_2 is not None:
                    sum_expression_2_result = self.visitarSumExpression(
                        sum_expression_2)
                    if sum_expression_2_result.tipo != "numero":
                        raise SemanticException(
                            f"O segundo argumento da função \"{function_name}\" na linha \"{function_linha}\" deveria ser do tipo numero, mas foi passado o tipo \"{sum_expression_2_result.tipo}\""
                        )
                return "numero"

    def visitarCommandStatement(self, noCommandStatement):
        """
        Visita uma declaração de comando na árvore sintática e realiza a análise semântica.

        Parâmetros:
        noCommandStatement (No): Nó da árvore sintática que contém a declaração de comando.
        """
        funcout = noCommandStatement.get("funcout")
        function_name = funcout.valor
        function_linha = funcout.linha
        match funcout.valor:
            case "mostrar":
                str = noCommandStatement.get("str")
                sum_expression = noCommandStatement.get("sum_expression")
                if str is not None:
                    pass
                elif sum_expression is not None:
                    self.visitarSumExpression(sum_expression)
            case "limpar":
                pass
            case "inicializar_com_cor":
                id = noCommandStatement.get("id")
                if id is not None:
                    if id.valor not in self.tabela.keys():
                        raise SemanticException(f"O argumento {id.valor} na função \"{function_name}\", da linha {function_linha}, não foi declarado.")
                    
                    if self.tabela[id.valor].tipo != "texto":
                        raise SemanticException(f"O argumento {id.valor} na função \"{function_name}\", da linha {function_linha}, deveria ser do tipo \"texto\" e foi passado do tipo \"{self.tabela[id.valor].tipo}\".")
                 
            case "inicializar_com_imagem":
                id = noCommandStatement.get("id")
                str = noCommandStatement.get("str")
                if str is not None:
                    self.validar_path(str)
                elif id is not None:
                    if id.valor not in self.tabela.keys():
                        raise SemanticException(f"O argumento {id.valor} na função \"{function_name}\", da linha {function_linha}, não foi declarado.")
                    
                    if self.tabela[id.valor].tipo != "texto":
                        raise SemanticException(f"O argumento {id.valor} na função \"{function_name}\", da linha {function_linha}, deveria ser do tipo \"texto\" e foi passado do tipo \"{self.tabela[id.valor].tipo}\".")
                 
            case 'redefinir_figura':
                sum_expression_1 = noCommandStatement.get("sum_expression_1")
                str_1 = noCommandStatement.get("str_1")
                str_2 = noCommandStatement.get("str_2")
                id_1 = noCommandStatement.get("id_1")
                id_2 = noCommandStatement.get("id_2")
                sum_expression_2 = noCommandStatement.get("sum_expression_2")
                sum_expression_3 = noCommandStatement.get("sum_expression_3")
                sum_expression_4 = noCommandStatement.get("sum_expression_4")
                if sum_expression_1 is not None:
                    sum_expression_1_result = self.visitarSumExpression(
                        sum_expression_1)
                    if sum_expression_1_result.tipo != "numero":
                        raise SemanticException(
                            f"O primeiro argumento da função \"{funcout.valor}\" na linha \"{funcout.linha}\" deveria ser do tipo numero, mas foi passado com o tipo \"{sum_expression_1_result.tipo}\""
                        )
                if str_1 is not None:
                    pass
                if str_2 is not None:
                    pass
                if id_1 is not None:
                    if id_1.valor not in self.tabela.keys():
                        raise SemanticException(f"O argumento {id_1.valor} na função \"{function_name}\", da linha {function_linha}, não foi declarado.")
                    
                    if self.tabela[id_1.valor].tipo != "texto":
                        raise SemanticException(f"O argumento {id_1.valor} na função \"{function_name}\", da linha {function_linha}, deveria ser do tipo \"texto\" e foi passado do tipo \"{self.tabela[id_1.valor].tipo}\".")
                if id_2 is not None:
                    if id_2.valor not in self.tabela.keys():
                        raise SemanticException(f"O argumento {id_2.valor} na função \"{function_name}\", da linha {function_linha}, não foi declarado.")
                    
                    if self.tabela[id_2.valor].tipo != "texto":
                        raise SemanticException(f"O argumento {id_2.valor} na função \"{function_name}\", da linha {function_linha}, deveria ser do tipo \"texto\" e foi passado do tipo \"{self.tabela[id_2.valor].tipo}\".")
                 
                if sum_expression_2 is not None:
                    sum_expression_2_result = self.visitarSumExpression(
                        sum_expression_2)
                    if sum_expression_2_result.tipo != "numero":
                        raise SemanticException(
                            f"O quarto argumento da função \"{funcout.valor}\" na linha \"{funcout.linha}\" deveria ser do tipo numero, mas foi passado o tipo \"{sum_expression_2_result.tipo}\""
                        )
                if sum_expression_3 is not None:
                    sum_expression_3_result = self.visitarSumExpression(
                        sum_expression_3)
                    if sum_expression_3_result.tipo != "numero":
                        raise SemanticException(
                            f"O quinto  argumento da função \"{funcout.valor}\" na linha \"{funcout.linha}\" deveria ser do tipo numero, mas foi passado o tipo \"{sum_expression_3_result.tipo}\""
                        )
                if sum_expression_4 is not None:
                    sum_expression_4_result = self.visitarSumExpression(
                        sum_expression_4)
                    if sum_expression_4_result.tipo != "numero":
                        raise SemanticException(
                            f"O sexto  argumento da função \"{funcout.valor}\" na linha \"{funcout.linha}\" deveria ser do tipo numero, mas foi passado o tipo \"{sum_expression_4_result.tipo}\""
                        )

            case "redefinir_imagem":
                sum_expression_1 = noCommandStatement.get("sum_expression_1")
                str = noCommandStatement.get("str")
                id = noCommandStatement.get("id")
                sum_expression_2 = noCommandStatement.get("sum_expression_2")
                sum_expression_3 = noCommandStatement.get("sum_expression_3")
                if sum_expression_1 is not None:
                    sum_expression_1_result = self.visitarSumExpression(
                        sum_expression_1)
                    if sum_expression_1_result.tipo != "numero":
                        raise SemanticException(
                            f"O primeiro argumento da função \"{funcout.valor}\" na linha \"{funcout.linha}\" deveria ser do tipo numero, mas foi passado com o tipo \"{sum_expression_1_result.tipo}\""
                        )
                if str is not None:
                    self.validar_path(str)
                elif id is not None:
                    if id.valor not in self.tabela.keys():
                        raise SemanticException(f"O argumento {id.valor} na função \"{function_name}\", da linha {function_linha}, não foi declarado.")
                    
                    if self.tabela[id.valor].tipo != "texto":
                        raise SemanticException(f"O argumento {id.valor} na função \"{function_name}\", da linha {function_linha}, deveria ser do tipo \"texto\" e foi passado do tipo \"{self.tabela[id.valor].tipo}\".")
                 
                if sum_expression_2 is not None:
                    sum_expression_2_result = self.visitarSumExpression(
                        sum_expression_2)
                    if sum_expression_2_result.tipo != "numero":
                        raise SemanticException(
                            f"O terceiro argumento da função \"{funcout.valor}\" na linha \"{funcout.linha}\" deveria ser do tipo numero, mas foi passado o tipo \"{sum_expression_2_result.tipo}\""
                        )
                if sum_expression_3 is not None:
                    sum_expression_3_result = self.visitarSumExpression(
                        sum_expression_3)
                    if sum_expression_3_result.tipo != "numero":
                        raise SemanticException(
                            f"O quarto  argumento da função \"{funcout.valor}\" na linha \"{funcout.linha}\" deveria ser do tipo numero, mas foi passado o tipo \"{sum_expression_3_result.tipo}\""
                        )
            case "mover":
                sum_expression_1 = noCommandStatement.get("sum_expression_1")
                sum_expression_2 = noCommandStatement.get("sum_expression_2")
                sum_expression_3 = noCommandStatement.get("sum_expression_3")

                if sum_expression_1 is not None:
                    sum_expression_1_result = self.visitarSumExpression(
                        sum_expression_1)
                    if sum_expression_1_result.tipo != "numero":
                        raise SemanticException(
                            f"O primeiro argumento da função \"{funcout.valor}\" na linha \"{funcout.linha}\" deveria ser do tipo numero, mas foi passado com o tipo \"{sum_expression_1_result.tipo}\""
                        )

                if sum_expression_2 is not None:
                    sum_expression_2_result = self.visitarSumExpression(
                        sum_expression_2)
                    if sum_expression_2_result.tipo != "numero":
                        raise SemanticException(
                            f"O segundo argumento da função \"{funcout.valor}\" na linha \"{funcout.linha}\" deveria ser do tipo numero, mas foi passado com o tipo \"{sum_expression_2_result.tipo}\""
                        )

                if sum_expression_3 is not None:
                    sum_expression_3_result = self.visitarSumExpression(
                        sum_expression_3)
                    if sum_expression_3_result.tipo != "numero":
                        raise SemanticException(
                            f"O terceiro argumento da função \"{funcout.valor}\" na linha \"{funcout.linha}\" deveria ser do tipo numero, mas foi passado com o tipo \"{sum_expression_3_result.tipo}\""
                        )

            case "destacar":
                sum_expression = noCommandStatement.get("sum_expression")
                if sum_expression is not None:
                    sum_expression_result = self.visitarSumExpression(
                        sum_expression)
                    if sum_expression_result.tipo != "numero":
                        raise SemanticException(
                            f"O primeiro argumento da função \"{funcout.valor}\" na linha \"{funcout.linha}\" deveria ser do tipo numero, mas foi passado com o tipo \"{sum_expression_result.tipo}\""
                        )

            case "reverter_destaque":
                pass

            case "tocar":
                str = noCommandStatement.get("str")
                id = noCommandStatement.get("id")
                if str is not None:
                    self.validar_path(str)
                elif id is not None:
                    if id.valor not in self.tabela.keys():
                        raise SemanticException(f"O argumento {id.valor} na função \"{function_name}\", da linha {function_linha}, não foi declarado.")
                    
                    if self.tabela[id.valor].tipo != "texto":
                        raise SemanticException(f"O argumento {id.valor} na função \"{function_name}\", da linha {function_linha}, deveria ser do tipo \"texto\" e foi passado do tipo \"{self.tabela[id.valor].tipo}\".")

            case "esperar":
                sum_expression = noCommandStatement.get("sum_expression")
                if sum_expression is not None:
                    sum_expression_result = self.visitarSumExpression(
                        sum_expression)
                    if sum_expression_result.tipo != "numero":
                        raise SemanticException(
                            f"O primeiro argumento da função \"{funcout.valor}\" na linha \"{funcout.linha}\" deveria ser do tipo numero, mas foi passado com o tipo \"{sum_expression_result.tipo}\""
                        )

    def visitarExpression(self, noExpression):
        """
        Visita uma expressão na árvore sintática e realiza a análise semântica.

        Parâmetros:
        noExpression (No): Nó da árvore sintática que contém a expressão.

        Retorna:
        NoTabela: O resultado da análise semântica da expressão.
        """
        if noExpression.get('oper') == None:
            return self.visitarSumExpression(noExpression.get('esq'))
        else:
            self.visitarSumExpression(noExpression.get('esq'))
            self.visitarSumExpression(noExpression.get('dir'))
            return NoTabela(None, 'binario')

    def visitarSumExpression(self, no):
        """
        Visita uma expressão de soma na árvore sintática e realiza a análise semântica.

        Parâmetros:
        no (No): Nó da árvore sintática que contém a expressão de soma.

        Retorna:
        NoTabela: Um objeto NoTabela que representa o resultado da expressão de soma.

        Lança:
        SemanticException: Se ocorrer algum erro semântico durante a análise, como tipos incompatíveis,
        divisão por zero ou expoente negativo.
        """
        if no != None:  # enquanto não chegar em um nó folha, continua o percurso (continue com a recursão)
            val1 = self.visitarSumExpression(
                no.get("esq"))  # visita a subárvore esquerda
            val2 = self.visitarSumExpression(
                no.get("dir"))  # visita a subárvore direita
            # Processa a raiz (if/elifs abaixo):
            if no.op == "sum_expression" or no.op == "mult_term" or no.op == "power_term":
                if val1.tipo != val2.tipo:
                    raise SemanticException(
                        f"Tipos incompatíveis: \"{val1.valor}\" e \"{val2.valor}\""
                    )
                if no.get(
                        'oper'
                ) == ":" and val2.tipo == "numero" and val2.valor == "0":
                    linha = no.get('esq').get('factor').linha
                    raise SemanticException(
                        f"Divisão por zero na linha {linha}")

                if no.get(
                        'oper'
                ) == "^" and val2.tipo == "numero" and "-" in val2.valor:
                    linha = no.get('esq').get('factor').linha
                    raise SemanticException(
                        f"Expoente negativo na linha {linha}")

                if val1 == None:
                    return val2
                else:
                    return val1

            elif no.op == "factor" and not no.get("expression"):

                if no.get('factor').op == "id":
                    if not no.get('factor').valor in self.tabela:
                        raise SemanticException(
                            f"O identificador \"{no.get('factor').valor}\" na linha {no.get('factor').linha} não foi declarado"
                        )
                    
                    else:
                        return self.tabela[no.get('factor').valor]

                if no.get('factor').op == "bool":
                    return NoTabela(no.get('factor').valor, 'binario')

                if no.get('factor').op == "int":
                    sinal = no.get('sinal')
                    if sinal == "-":
                        return NoTabela("-" + no.get('factor').valor, 'numero')
                    else:
                        return NoTabela(no.get('factor').valor, 'numero')

            elif no.op == "factor" and no.get("expression"):
                return self.visitarExpression(no.get("expression"))

    def validar_path(self, noStr):
        """
        Valida o caminho fornecido para um arquivo ou recurso.

        Parâmetros:
        noStr (No): Nó da árvore sintática que contém a string com o caminho a ser validado.

        Lança:
        SemanticException: Se o caminho não for válido, ou seja, se contiver caracteres inválidos ou não seguir o formato esperado.
        """
        path = noStr.valor
        if "/" in path or "." not in path[1:-1]:
            raise SemanticException(
                f"O caminho \"{path}\" na linha {noStr.linha} não é válido.")
