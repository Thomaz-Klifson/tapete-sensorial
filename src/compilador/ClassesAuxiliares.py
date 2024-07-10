class LexicalException(Exception):
    """
    Classe de exceção para erros lexicos.
    """
    pass


class SyntaxException(Exception):
    """
    Define uma classe (vazia) que representa um erro sintático.
    Herda da classe Exception.
    """
    pass

class SemanticException(Exception):
    """
    Define uma classe (vazia) que representa um erro semântico.
    Herda da classe Exception.
    """
    pass

class Token:
    """
    Classe que representa um token.
    """

    def __init__(self, tipo, valor, linha):
        self.tipo = tipo
        self.valor = valor
        self.linha = linha

    def __repr__(self):
        return f"({self.tipo} {self.valor} {self.linha})"


class NoInterno:
    """
    Classe que representa um nó interno na árvore sintática.
    Recebe como parâmetros:
        - uma string op (operador). Por padrão, use o nome do método que criou o objeto;
        - **kwargs: um conjunto de parâmetros nomeados que serão armazenados como um dicionário (atributo d);

    Por simplicidade, mantenha os atributos públicos.
    """

    def __init__(self, op, **kwargs):
        self.op = op
        self.d = {}
        for k, v in kwargs.items():
            self.d[k] = v


    def get(self, k):
        return self.d.get(k)


    def __repr__(self):
        listaParametros = []
        # Os parâmetros nomeados aparecerão sempre ordenados para facilitar a comparação.
        # Desta maneira, a ordem em que eles forem definidos não vai importar:
        for k in sorted(self.d.keys()):
            valor = self.d[k]
            if type(valor) == str:
                valor = f'"{valor}"'
            listaParametros.append(f"{k}={valor}")
        parametrosStr = ", ".join(listaParametros)
        if len(parametrosStr) > 0:
            parametrosStr = ", " + parametrosStr
        return f'NoInterno(op="{self.op}"{parametrosStr})'


class NoFolha:
    """
    Classe que representa um nó folha da árvore sintática.
    Um nó folha pode ser: um TYPE, ID, NUMBER, BOOLEAN.
    Por simplicidade, mantenha os atributos públicos.
    """

    def __init__(self, op, valor, linha):
        self.op = op
        self.valor = valor
        self.linha = linha


    def __repr__(self):
        return f'NoFolha(op="{self.op}", valor="{self.valor}", linha={self.linha})'

class NoTabela:
    """
    Classe que representa uma linha da tabela de símbolos da análise semântica.
        - valor: um valor qualquer, a depender do que se queira armazenar (None, um ID, um inteiro, um valor booleano, um operador, etc);
        - tipo: tipo do valor armazenado;
        - kwargs: um conjunto de parâmetros nomeados que serão armazenados como um dicionário (atributo d).
    Dica: é possível construir o analisador semântico sem utilizar o kwargs. Ele está disponível como um facilitador, caso você deseje utilizá-lo.
    Por simplicidade, mantenha os atributos públicos.
    """

    def __init__(self, valor, tipo, **kwargs):
        self.valor = valor
        self.tipo = tipo
        self.d = {}
        for k, v in kwargs.items():
            self.d[k] = v

    def get(self, k):
        return self.d.get(k)

    def __repr__(self):
        return f'NoTabela(valor={self.valor}, tipo={self.tipo}, kwargs={self.d})'



