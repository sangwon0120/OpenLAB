# ===========================================================================
# Resume screening with AI
# Created: 28, Jul 2025
# Updated: 
# Writer: Tim, Jung
# Description:
#   from LlamaHub (WikipediaReader, ResumeScreenPack)
#   -> need to set False of refresh cache (gpt-4 is default , cost highly)
# ===========================================================================


import streamlit as st
import tempfile
import os

# Do sentence splitting on the first piece of text
from llama_index.core.node_parser import SentenceSplitter
from llama_index.readers.wikipedia import WikipediaReader
from llama_index.core.llama_pack import download_llama_pack

from llama_index.llms.openai import OpenAI
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings


openai_api_key = os.getenv("OPENAI_API_KEY")  

Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5") 

# Settings.llm = OpenAI(model="gpt-4o-mini")
llm = OpenAI(api_key=openai_api_key, model="gpt-4.1-nano")


# wikipediaReader, it returns List with data
# documents for establishing evaluation criteria
wiki_loader = WikipediaReader()
documents = wiki_loader.load_data(
    pages=["OpenAI", "Sam Altman", "Mira Murati", "Emmett Shear"],
    auto_suggest=False,
)


sentence_splitter = SentenceSplitter(chunk_size=1024)


# Get the first 1024 tokens for each entity
# Turn document into a list of nodes
# reason why we use sentence splitter is that the document is too long
openai_node = sentence_splitter.get_nodes_from_documents([documents[0]])[0]
sama_node = sentence_splitter.get_nodes_from_documents([documents[1]])[0]
mira_node = sentence_splitter.get_nodes_from_documents([documents[2]])[0]
emmett_node = sentence_splitter.get_nodes_from_documents([documents[3]])[0]


# Download a pack from LlamaHub
ResumeScreenerPack = download_llama_pack(
    "ResumeScreenerPack",
    "./resume_screener_pack",
    refresh_cache=False
)


# Job Description & Criteria
with open("job_description.txt", "r") as f:
        job_des = f.read()

with open("criteria.txt", "r") as f:
        criteria = f.read()


# Instantiate the RSPack: screen resumes based on the JD and Criteria
# This wll
# - read the PDF resume
# - sythesize decisions based on the criteria
# - provide overall reasoning and decisions
# LLM is set to gpt-4o-mini
# Criterias for screening for the job
# Position for CA, SA


st.write("# 📁 Overall Criteria of your Resume")
resume_screener = ResumeScreenerPack(
    job_description=job_des,
    criteria=criteria,
    llm=llm
)


# resume input
user_resume = st.file_uploader("**Choose a PDF file**", type="pdf")
if user_resume is not None:
    
    with tempfile.NamedTemporaryFile(delete=True, suffix=".pdf") as tmp_file:
          tmp_file.write(user_resume.read())
          tmp_file_path = tmp_file.name

    try:
        screening_result = resume_screener.run(tmp_file_path)

    except Exception as e:
        st.error(f"Resume screening error: {e}")
        screening_result = None

    for cri_dec in screening_result.criteria_decisions:
        st.write("##### CRITERIA DECISION")
        st.write(cri_dec.reasoning)
        st.write(cri_dec.decision)

        st.write("#### OVERALL REASONING")
        st.write(str(screening_result.overall_reasoning))
        st.write(str(screening_result.overall_decision))

else:
    st.write("**Upload your resume**")