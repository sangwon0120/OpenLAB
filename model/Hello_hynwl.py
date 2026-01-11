import streamlit as st

st.markdown("""
    <style>
    .stApp {
        background-color: #000000; 
    }
    </style>
    """,
    unsafe_allow_html=True
)

st.set_page_config(
    page_title="hynwl's Streamlit App for AI",
    page_icon="🙊",
)

st.write("# Welcome to hynwl's AI! 🙊")


st.markdown(
    """
        Welcome to hynwl AI Archive!

        ### Want to learn more?
        - Check out [streamlit.io](https://streamlit.io)
        - Jump into our [documentation](https://docs.streamlit.io)
        - Ask a question in our [community
            forums](https://discuss.streamlit.io)

        ### See more complex demos
        - Use a neural net to [analyze the Udacity Self-driving Car Image
            Dataset](https://github.com/streamlit/demo-self-driving)
        - Explore a [New York City rideshare dataset](https://github.com/streamlit/demo-uber-nyc-pickups)
    """
)