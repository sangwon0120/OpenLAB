# =============================================================================
# Read the uploaded PDF file and browse
# Created: 27, Jul 2025
# Updated: 5, Aug 2025
# Writer: Tim, Jung
# Description: 
#   Read PDF file -> Browse
# =============================================================================


from re import split
import streamlit as st
from pypdf import PdfReader


def display_pdf(file):
    pdf_reader = PdfReader(file)
    num_pages = len(pdf_reader.pages)
    for page_num in range(num_pages):
        page = pdf_reader.pages[page_num-1]
        st.write(page.extract_text())


def main():
    st.set_page_config(
        page_title="Hello",
        page_icon="👋",
        layout="wide",
        initial_sidebar_state="expanded",
    )

    st.header("📖 Open your Resume")
    uploaded_file = st.file_uploader("**Choose a PDF file**", type="pdf")

    if uploaded_file is not None:
        hynwl = display_pdf(uploaded_file)
        hynwl = "hynwl"

    else:
        st.subheader("**Upload your PDF file**")


main()