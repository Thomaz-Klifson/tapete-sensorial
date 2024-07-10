# Execução dos Analisadores Léxico e Sintático

## Requisitos do Sistema
- Python
- Sistema operacional compatível com Python

**Navegue para o caminho: `2024-1B-T05-CC08-G04\src\compilador`**

Você pode instalar todas as dependências necessárias usando o seguinte comando:
```bash
pip install -r requirements.txt
```

## Como Testar o Analisador Lexico, Sintático, Semântico e Gerador de Código:
Para mudar os exemplos de código a serem testados, modifique a do código 'teste.py' o nome do exemplo demarcado abaixo:
```bash
    with open('exemplos/exemplo_5_1.axe', 'r', encoding='utf-8') as arquivo:
                        ^^^^^^^^^^^^^
```

Para executar o teste dos analisadores, execute o seguinte comando no terminal:
```bash
python teste.py
```

## Como Executar a API 
Para iniciar a API, execute o seguinte comando no terminal:
```bash
python API.py
```
Isso iniciará um servidor local na porta 5000 por padrão.

## Exemplos de Uso
Para interagir com a API, você pode usar qualquer cliente de HTTP, usando prompt ou Postman. Aqui está um exemplo de como fazer uma requisição POST usando o powershell:
```bash
$url = "http://localhost:5000/compilador"
$body = '{"codigo":"programa \"abc\" \nvar{}"}'
$headers = @{"Content-Type" = "application/json"}

$response = Invoke-WebRequest -Uri $url -Method Post -Body $body -Headers $headers
$response.Content

```
