from AnalisadorLexico import AnalisadorLexico
from AnalisadorSintatico import AnalisadorSintatico
from AnalisadorSemantico import AnalisadorSemantico
from GeradorCodigo import GeradorCodigo
from ClassesAuxiliares import LexicalException, SyntaxException, SemanticException

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/compilador', methods=['POST'])
def create_post():
    """
    Cria um novo post analisando tokens do código fonte fornecido no corpo da requisição JSON.
    Retorna uma resposta JSON com os tokens ou uma mensagem de erro caso haja problemas.

    :return: Uma resposta JSON indicando sucesso ou falha na análise lexical.
    """
    try:
        # Garantir que temos os dados JSON e que a chave "codigo" está disponível
        data = request.get_json()
        codigo = data["codigo"]

        # Inicializar AnalisadorLexico com os dados de entrada e processar os tokens
        lexico = AnalisadorLexico(codigo)
        tokens = lexico.getToken()
        sintatico = AnalisadorSintatico(tokens)
        arvore = sintatico.analisar()
        semantico = AnalisadorSemantico(arvore)
        analise_semantica = semantico.analisar()
        gerador = GeradorCodigo(arvore)
        javascript = str(gerador.gerarJavaScript())
        tokens = [str(token) for token in tokens]


        # Retornar uma resposta JSON com os tokens
        return jsonify({"status": "success", "arvore": str(arvore),"javascript": javascript}), 200

    except KeyError:
        # Se a chave "codigo" estiver faltando
        return jsonify({"status": "error", "message": "Missing 'codigo' field in request data"}), 400

    except LexicalException as e:
        # Tratar quaisquer exceções léxicas
        return jsonify({"status": "error", "message": str(e)}), 400
    
    except SyntaxException as e:
        # Tratar quaisquer exceções sintáticas
        return jsonify({"status": "error", "message": str(e)}), 400

    except SemanticException as e:
        return jsonify({"status": "error", "message": str(e)}), 400

    except Exception as e:
        # Tratador genérico de erros para erros inesperados
        return jsonify({"status": "error", "message": "An unexpected error occurred: " + str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
