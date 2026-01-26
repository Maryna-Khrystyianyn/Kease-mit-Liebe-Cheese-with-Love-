from llama_index.llms.openai import OpenAI

def get_llm():
    return OpenAI(
        model="gpt-4.1-mini",
        temperature=0.2,
    )
