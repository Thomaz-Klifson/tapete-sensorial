# -*- coding: utf-8 -*-

# Os imports abaixo não são necessários, mas caso você necessite, são os únicos permitidos:
from ClassesAuxiliares import NoInterno, NoFolha, NoTabela


class GeradorCodigo:

    def __init__(self, arvoreSintatica):
        # Mantenha pelo menos os 2 atributos a seguir:
        self.saida = ""
        self.arvore = arvoreSintatica
        # Você pode modificar e/ou criar seus atributos a partir daqui:
        self.numTabs = -1  # é necessário guardar o nível de indentação
        # O nível -1 não existe, mas toda vez que entrarmos num block, este atributo será incrementado.
        self.simboloTab = "    "  # sugestão: utilize 4 espaços como indentação. Você pode usar este atributo como uma constante
        self.varNum = 0  # Contador de variáveis temporárias
        # Crie mais atributos se achar necessário:

    def gerarJavaScript(self):
        """
        Gera o código JavaScript a partir da árvore sintática.
        
        Retorna:
        str: O código JavaScript gerado.
        """
        self.saida += f"\n/* Código em JS gerado a partir do programa \"{self.arvore.get('str').valor}\"*/\n"
        self.numTabs += 1
        self.concatenar_linha("async function main() {")
        self.concatenar_linha("\tconst canvas = document.getElementById('main')\n\tconst ctx = canvas.getContext('2d')\n")
        self.concatenar_linha(f"\t// Inicialização de variáveis")
        self.visitarDeclarations(self.arvore.get("var_declaration_list"))
        self.concatenar_linha(f"\t// Início do código")
        self.visitarBlock(self.arvore.get("block"))
        self.numTabs -= 1
        self.concatenar_linha("}")
        self.concatenar_linha("main()")
        return self.saida

    def visitarDeclarations(self, noDeclarations):
        """
        Visita a lista de declarações de variáveis na árvore sintática e gera o código correspondente.
        
        Parâmetros:
        noDeclarations (No): Nó da árvore sintática que contém a lista de declarações de variáveis.
        """
        self.numTabs += 1
        var_declaration_list = noDeclarations
        while var_declaration_list:
            self.visitarVarDeclaration(
                var_declaration_list.get('var_declaration'))
            var_declaration_list = var_declaration_list.get(
                'var_declaration_list')
        self.numTabs -= 1

    def visitarVarDeclaration(self, noVarDeclaration):
        """
        Visita uma declaração de variável na árvore sintática e gera o código correspondente.
        
        Parâmetros:
        noVarDeclaration (No): Nó da árvore sintática que contém a declaração de variável.
        """
        identifier_list = noVarDeclaration.get('identifier_list')
        tipo = noVarDeclaration.get('type').valor
        while identifier_list:
            if tipo == "texto":
                variavel = identifier_list.get('id').valor
                self.concatenar_linha(f"let {variavel} = \"\"")
            elif tipo == "numero":
                variavel = identifier_list.get('id').valor
                self.concatenar_linha(f"let {variavel} = 0")
            elif tipo == "binario":
                variavel = identifier_list.get('id').valor
                self.concatenar_linha(f"let {variavel} = false")
            identifier_list = identifier_list.get('prox')

    def visitarBlock(self, noBlock):
        """
        Visita um bloco de código na árvore sintática e gera o código correspondente.
        
        Parâmetros:
        noBlock (No): Nó da árvore sintática que contém o bloco de código.
        """
        statement_list = noBlock.get('statement_list')
        self.numTabs += 1

        while statement_list:

            statement = statement_list.get('statement')
            linha = ''
            operacao = statement.op
            if operacao == "assign_statement":
                linha += f"{statement.get('id').valor} = "
                str = statement.get('str')
                expression = statement.get('expression')
                input_statement = statement.get('input_statement')

                if str:
                    linha += f"\"{str.valor}\""

                elif expression:
                    expression_result = self.visitarExpression(expression)
                    # self.varNum = 0
                    linha += f"{expression_result}"

                elif input_statement:
                    input_statement_output = self.visitarInputStatement(
                        input_statement)
                    linha += f"{input_statement_output}"

            elif statement.op == 'if_statement':
                self.visitarIfStatement(statement)

            elif statement.op == 'while_statement':
                self.visitarWhileStatement(statement)

            elif statement.op == 'repeat_statement':
                self.visitarRepeatStatement(statement)

            elif statement.op == 'command_statement':
                linha += self.visitarCommandStatement(
                    statement)  #preciso de ajuda @giuliano

            self.concatenar_linha(linha)

            statement_list = statement_list.get('prox')
        self.numTabs -= 1

    def visitarIfStatement(self, noIfStatement):
        """
        Visita uma declaração "se" na árvore sintática e gera o código correspondente.
        
        Parâmetros:
        noIfStatement (No): Nó da árvore sintática que contém a declaração "se".
        """
        expression = noIfStatement.get('expression')

        expression_result = self.visitarExpression(expression)
        # self.varNum = 0

        linha = f"if ({expression_result}) {{"
        self.concatenar_linha(linha)

        block_if = noIfStatement.get("block_if")
        self.visitarBlock(block_if)

        self.concatenar_linha("}")
        block_else = noIfStatement.get("block_else")
        if block_else:
            self.concatenar_linha('else{')
            self.visitarBlock(block_else)
            self.concatenar_linha("}")

    def visitarWhileStatement(self, noWhileStatement):
        """
        Visita uma declaração "enquanto" na árvore sintática e gera o código correspondente.
        
        Parâmetros:
        noWhileStatement (No): Nó da árvore sintática que contém a declaração "enquanto".
        """
        expression = noWhileStatement.get('expression')

        expression_result = self.visitarExpression(expression)
        # self.varNum = 0

        linha = f"while ({expression_result}) {{"
        self.concatenar_linha(linha)

        block = noWhileStatement.get("block")
        self.visitarBlock(block)

        self.concatenar_linha("}")

    def visitarRepeatStatement(self, noRepeatStatement):
        """Visita uma declaração "repita" na árvore sintática e gera o código correspondente.
        
        Parâmetros:
        noRepeatStatement (No): Nó da árvore sintática que contém a declaração "repita".
        """
        sum_expression = noRepeatStatement.get('sum_expression')

        quantidade_de_vezes = self.visitarSumExpression(sum_expression)
        # self.varNum = 0

        self.varNum += 1

        linha = f"for (let _TEMP{self.varNum} = 0; _TEMP{self.varNum} < {quantidade_de_vezes}; _TEMP{self.varNum}++) {{"
        self.concatenar_linha(linha)

        block = noRepeatStatement.get("block")
        self.visitarBlock(block)

        self.concatenar_linha("}")

    def visitarInputStatement(self, noInputStatement):
        """
        Visita uma declaração de entrada na árvore sintática e gera o código correspondente.
        
        Parâmetros:
        noInputStatement (No): Nó da árvore sintática que contém a declaração de entrada.
        
        Retorna:
        str: O código JavaScript gerado para a declaração de entrada.
        """
        function_name = noInputStatement.get("funcin").valor
        retorno = ""

        match function_name:
            case "ler_numero":
                str = noInputStatement.get("str")
                id = noInputStatement.get("id")
                if str:
                    retorno += f"ler_numero(\"{str.valor}\")"
                else:
                    retorno += f"ler_numero(\"{id.valor}\")"
            case "ler_binario":
                str = noInputStatement.get("str")
                id = noInputStatement.get("id")
                if str:
                    retorno += f"ler_binario(\"{str.valor}\")"
                else:
                    retorno += f"ler_binario(\"{id.valor}\")"
            case "ler":
                retorno += "await ler()"
            case "consultar":
                retorno += f"consultar()"
            case "criar_figura":
                str_1 = noInputStatement.get("str_1")
                str_2 = noInputStatement.get("str_2")
                id_1 = noInputStatement.get("id_1")
                id_2 = noInputStatement.get("id_2")
                sum_expression_1 = noInputStatement.get("sum_expression_1")
                sum_expression_2 = noInputStatement.get("sum_expression_2")
                sum_expression_3 = noInputStatement.get("sum_expression_3")

                sum_expression_1_result = self.visitarSumExpression(sum_expression_1)
                sum_expression_2_result = self.visitarSumExpression(sum_expression_2)
                sum_expression_3_result = self.visitarSumExpression(sum_expression_3)

                retorno += f"criar_figura("

                if str_1 is not None:
                    retorno += f"\"{str_1.valor}\""
                elif id_1 is not None:
                    retorno += f"{id_1.valor}"

                retorno += ","

                if str_2 is not None:
                    retorno += f"\"{str_2.valor}\""
                elif id_2 is not None:
                    retorno += f"{id_2.valor}"

                retorno += f", {sum_expression_1_result}, {sum_expression_2_result}, {sum_expression_3_result})"

            case "criar_imagem":
                str = noInputStatement.get("str")
                id = noInputStatement.get("id")
                sum_expression_1 = noInputStatement.get("sum_expression_1")
                sum_expression_2 = noInputStatement.get("sum_expression_2")

                sum_expression_1_result = self.visitarSumExpression(sum_expression_1)
                sum_expression_2_result = self.visitarSumExpression(sum_expression_2)

                if str is not None:
                    retorno += f"criar_imagem(\"{str.valor}\", {sum_expression_1_result}, {sum_expression_2_result})"
                else:
                    retorno += f"criar_imagem({id.valor}, {sum_expression_1_result}, {sum_expression_2_result})"

            case "colidiu":
                sum_expression_1 = noInputStatement.get("sum_expression_1")
                sum_expression_2 = noInputStatement.get("sum_expression_2")
                sum_expression_1_result = self.visitarSumExpression(sum_expression_1)
                sum_expression_2_result = self.visitarSumExpression(sum_expression_2)

                retorno += f"colidiu({sum_expression_1_result}, {sum_expression_2_result})"

            case "aleatorio":
                sum_expression_1 = noInputStatement.get("sum_expression_1")
                sum_expression_2 = noInputStatement.get("sum_expression_2")

                sum_expression_1_result = self.visitarSumExpression(
                    sum_expression_1)
                sum_expression_2_result = self.visitarSumExpression(
                    sum_expression_2)
                
                retorno += f"aleatorio({sum_expression_1_result}, {sum_expression_2_result})"

        return retorno

    def visitarCommandStatement(self, noCommandStatement):
        funcout = noCommandStatement.get("funcout")
        retorno = ""

        match funcout.valor:
            case "mostrar":
                str = noCommandStatement.get("str")
                sum_expression = noCommandStatement.get("sum_expression")
                retorno += "mostrar("

                if str is not None:
                    retorno += f"\"{str.valor}\""
                elif sum_expression is not None:
                    sum_expression_result = self.visitarSumExpression(sum_expression)
                    if sum_expression.get("sinal") == "-":
                        retorno += "-"
                    retorno += f"{sum_expression_result}"

                retorno += ")"

            case "limpar":
                retorno += "limpar()"

            case "inicializar_com_cor":
                str = noCommandStatement.get("str")
                id = noCommandStatement.get("id")

                if str is not None:
                    retorno += f"inicializar_com_cor(\"{str.valor}\")"
                elif id is not None:
                    retorno += f"inicializar_com_cor({id.valor})"

            case "inicializar_com_imagem":
                str = noCommandStatement.get("str")
                id = noCommandStatement.get("id")

                if str is not None:
                    retorno += f"inicializar_com_imagem(\"{str.valor}\")"
                elif id is not None:
                    retorno += f"inicializar_com_imagem({id.valor})"

            case 'redefinir_figura':
                sum_expression_1 = noCommandStatement.get("sum_expression_1")
                str_1 = noCommandStatement.get("str_1")
                id_1 = noCommandStatement.get("id_1")
                str_2 = noCommandStatement.get("str_2")
                id_2 = noCommandStatement.get("id_2")
                sum_expression_2 = noCommandStatement.get("sum_expression_2")
                sum_expression_3 = noCommandStatement.get("sum_expression_3")
                sum_expression_4 = noCommandStatement.get("sum_expression_4")

                sum_expression_1_result = self.visitarSumExpression(sum_expression_1)
                sum_expression_2_result = self.visitarSumExpression(sum_expression_2)
                sum_expression_3_result = self.visitarSumExpression(sum_expression_3)
                sum_expression_4_result = self.visitarSumExpression(sum_expression_4)

                retorno += f"redefinir_figura({sum_expression_1_result}, "

                if str_1 is not None:
                    retorno += f"\"{str_1.valor}\""
                elif id_1 is not None:
                    retorno += f"{id_1.valor}"

                retorno += ","

                if str_2 is not None:
                    retorno += f"\"{str_2.valor}\""
                elif id_2 is not None:
                    retorno += f"{id_2.valor}"

                retorno += f", {sum_expression_2_result}, {sum_expression_3_result}, {sum_expression_4_result})"


            case "redefinir_imagem":
                sum_expression_1 = noCommandStatement.get("sum_expression_1")
                str = noCommandStatement.get("str")
                id = noCommandStatement.get("id")
                sum_expression_2 = noCommandStatement.get("sum_expression_2")
                sum_expression_3 = noCommandStatement.get("sum_expression_3")

                sum_expression_1_result = self.visitarSumExpression(sum_expression_1)
                sum_expression_2_result = self.visitarSumExpression(sum_expression_2)
                sum_expression_3_result = self.visitarSumExpression(sum_expression_3)

                if str is not None:
                    retorno += f"redefinir_imagem({sum_expression_1_result}, \"{str.valor}\", {sum_expression_2_result}, {sum_expression_3_result})"
                else:
                    retorno += f"redefinir_imagem({sum_expression_1_result}, {id.valor}, {sum_expression_2_result}, {sum_expression_3_result})"

            case "mover":
                sum_expression_1 = noCommandStatement.get("sum_expression_1")
                sum_expression_2 = noCommandStatement.get("sum_expression_2")
                sum_expression_3 = noCommandStatement.get("sum_expression_3")

                sum_expression_2_sinal = noCommandStatement.get("sum_expression_2").get("sinal")
                sum_expression_3_sinal = noCommandStatement.get("sum_expression_3").get("sinal")

                if sum_expression_2_sinal == "+":
                    sum_expression_2_sinal = ""
                
                if sum_expression_3_sinal == "+":
                    sum_expression_3_sinal = ""

                sum_expression_1_result = self.visitarSumExpression(sum_expression_1)
                sum_expression_2_result = self.visitarSumExpression(sum_expression_2)
                sum_expression_3_result = self.visitarSumExpression(sum_expression_3)

                retorno += f"mover({sum_expression_1_result}, {sum_expression_2_sinal}{sum_expression_2_result}, {sum_expression_3_sinal}{sum_expression_3_result})"

            case "destacar":
                sum_expression = noCommandStatement.get("sum_expression")
                sum_expression_result = self.visitarSumExpression(sum_expression)

                retorno += f"destacar({sum_expression_result})"

            case "reverter_destaque":
                retorno += "reverter_destaque()"

            case "tocar":
                retorno += "tocar("
                str = noCommandStatement.get("str")
                if str:
                    retorno += f"\"{str.valor}\")"
                id = noCommandStatement.get("id")
                if id is not None:
                    retorno += f"{id.valor})"

            case "esperar":
                sum_expression = noCommandStatement.get("sum_expression")
                sum_expression_result = self.visitarSumExpression(sum_expression)
                retorno += f"await esperar({sum_expression_result})"

        return retorno

    def visitarExpression(self, noExpression):
        """
        Visita uma expressão na árvore sintática e gera o código correspondente.
        
        Parâmetros:
        noExpression (No): Nó da árvore sintática que contém a expressão.
        
        Retorna:
        str: O código JavaScript gerado para a expressão.
        """
        esq = noExpression.get("esq")
        E = self.visitarSumExpression(esq)
        oper_logico = noExpression.get("oper")

        if oper_logico is None:
            return E

        dir = noExpression.get("dir")
        D = self.visitarSumExpression(dir)

        self.varNum += 1
        linha = ''

        if oper_logico == "ou":
            linha += f"let _TEMP{self.varNum} = {E} || {D}"
            self.concatenar_linha(linha)
            return f"_TEMP{self.varNum}"
        elif oper_logico == "e":
            linha += f"let _TEMP{self.varNum} = {E} && {D}"
            self.concatenar_linha(linha)
            return f"_TEMP{self.varNum}"
        elif oper_logico == "=":
            linha += f"let _TEMP{self.varNum} = {E} == {D}"
            self.concatenar_linha(linha)
            return f"_TEMP{self.varNum}"
        else:
            linha += f"let _TEMP{self.varNum} = {E} {oper_logico} {D}"
            self.concatenar_linha(linha)
            return f"_TEMP{self.varNum}"

    def visitarSumExpression(self, no):
        """
        Visita uma expressão de soma na árvore sintática e gera o código correspondente.
        
        Parâmetros:
        no (No): Nó da árvore sintática que contém a expressão de soma.
        
        Retorna:
        str: O código JavaScript gerado para a expressão de soma.
        """
        if no is not None:
            val1 = self.visitarSumExpression(
                no.get("esq"))  # visita a subárvore esquerda
            val2 = self.visitarSumExpression(
                no.get("dir"))  # visita a subárvore direita
            # Processa a raiz:
            linha = ""
            if no.op == "sum_expression":

                oper = no.get("oper")
                if oper == "ou":
                    oper = "||"
                self.varNum += 1
                linha += f"let _TEMP{self.varNum} = {val1} {oper} {val2}"
                self.concatenar_linha(linha)
                return f"_TEMP{self.varNum}"

            elif no.op == "mult_term":

                self.varNum += 1
                oper = no.get("oper")

                if oper == "e":
                    oper = "&&"

                linha += f"let _TEMP{self.varNum} = {val1} {oper} {val2}"
                self.concatenar_linha(linha)
                return f"_TEMP{self.varNum}"

            elif no.op == "power_term":

                oper = no.get("oper")
                self.varNum += 1
                linha += f"let _TEMP{self.varNum} = {val1} ** {val2}"
                self.concatenar_linha(linha)
                return f"_TEMP{self.varNum}"

            elif no.op == "factor" and not no.get("expression"):

                nao = no.get("nao")
                sinal = no.get("sinal")
                factor = no.get("factor")
                operacao = factor.op
                valor = factor.valor
                retorno = ""
                if nao is not None:
                    retorno += "!"

                if operacao in ["int, id"] and sinal == "-":
                    self.varNum += 1
                    linha = ""
                    linha += f"let _TEMP{self.varNum} = -{valor}"
                    self.concatenar_linha(linha)
                    return f"_TEMP{self.varNum}"
                elif operacao == "id":
                    retorno += valor
                    return retorno
                elif operacao == "bool" and valor == "v":
                    retorno += "true"
                    return retorno
                elif operacao == "bool" and valor == "f":
                    retorno += "false"
                    return retorno
                else:
                    return valor

            elif no.op == "factor" and no.get("expression"):
                sinal = no.get("sinal")
                nao = no.get("nao")
                if sinal == "-":
                    temp = self.visitarExpression(no.get("expression"))

                    linha = ""
                    self.varNum += 1
                    var_temporaria = f"_TEMP{self.varNum}"
                    linha += f"let {var_temporaria} = -{temp}"
                    self.concatenar_linha(linha)
                    return f"_TEMP{self.varNum}"
                elif nao is not None:
                    temp = self.visitarExpression(no.get("expression"))

                    linha = ""
                    self.varNum += 1
                    var_temporaria = f"_TEMP{self.varNum}"
                    linha += f"let _TEMP{self.varNum} = !{temp}"
                    self.concatenar_linha(linha)
                    return var_temporaria
                else:
                    # Neste caso, apenas mantenha o código abaixo.
                    return self.visitarExpression(no.get("expression"))

    def concatenar_linha(self, texto):
        """
        Concatena uma linha de código ao atributo 'saida' com a devida indentação.
        
        Parâmetros:
        texto (str): A linha de código a ser concatenada.
        """
        self.saida += "\t" * self.numTabs + texto + "\n"


if __name__ == "__main__":
    pass
