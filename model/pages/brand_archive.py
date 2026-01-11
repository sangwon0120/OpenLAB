import streamlit as st
import pandas as pd
import pydeck as pdk

# Header
st.markdown("# 👔 Brand Archive")

# Brand Data
store_data = pd.DataFrame([
    {"name": "Carhartt Seoul", "url": "https://www.carhartt-wip.co.kr"},
    {"name": "HATCHINGROOM Seoul", "url": "https://hatchroom.com"},
    {"name": "KASINA Seoul", "url": "https://www.kasina.co.kr"},
    {"name": "Supreme Seoul", "url": "https://www.supremenewyork.com"},
    {"name": "Levi's Seoul", "url": "https://www.levi.co.kr"},
])


# Interface
selected_store = st.selectbox("**hynwl collection**", store_data["name"])
selected_info = store_data[store_data["name"] == selected_store].iloc[0]

st.markdown(f"### 💿 {selected_info['name']}")
st.markdown(f"**Brand Website({selected_info['url']})**")


# Embedding the website
st.markdown("#### 📎 Preview")
iframe_html =f"""
<iframe src="{selected_info['url']}" width="100%" height="600px" style="border:1px solid #ccc;" allowfullscreen>
</iframe>
"""
st.components.v1.html(iframe_html, height=600)