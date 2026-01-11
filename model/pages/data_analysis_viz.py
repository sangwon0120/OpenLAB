# =============================================================================
# Preview of DataFrame and visulizing it
# Created: 27, Jul 2025
# Updated: 5, Aug 2025
# Writer: Tim, Jung
# Description: 
#   Get DataFrame -> Post + Visualize
# =============================================================================


import streamlit as st # UI
import pandas as pd # DataFrame
import altair as alt # Chat system
from urllib.error import URLError # Error handling for web issues


st.markdown("# 🧾 Data Analysis & Visualization")
st.write(
    """
    (Visualization of Data courtesy of the [UN Data Explorer](http://data.un.org/Explorer.aspx) will be shown as an example.)
    """
)


# default URL
DEFAULT_URL = "http://streamlit-demo-data.s3-us-west-2.amazonaws.com"


# user URL
user_url = st.text_input(
    label = "Please enter the CSV file URL",
    placeholder = "e.g. https://example.com/data.csv"
)


# URL selection logic
data_url = user_url.strip() if user_url else DEFAULT_URL


# URL form
if not data_url.endswith(".csv") or data_url.endswith(".csv.gz"):
    data_url = data_url.rstrip("/") + "/agri.csv.gz"


@st.cache_data
def load_data_from_url(url):
    df = pd.read_csv(url)
    return df.set_index("Region") if "Region" in df.columns else df


try:
    if data_url == DEFAULT_URL.rstrip("/") + "/agri.csv.gz":
        
        df = load_data_from_url(data_url)

        countries = st.multiselect(
            "Choose countries", list(df.index)
        )
        if not countries:
            st.error("### Please select at least one country.")
        else:
            data = df.loc[countries]
            data /= 1000000.0
            st.write("### Gross Agricultural Production ($B)", data.sort_index())

            data = data.T.reset_index()
            data = pd.melt(data, id_vars=["index"]).rename(
                columns={"index": "year", "value": "Gross Agricultural Product ($B)"}
            )
            
            chart = (
                alt.Chart(data)
                .mark_area(opacity=0.3)
                .encode(
                    x="year:T",
                    y=alt.Y("Gross Agricultural Product ($B):Q", stack=None),
                    color="Region:N",
                )
            )
            st.altair_chart(chart, use_container_width=True)

    else:
        df = load_data_from_url(data_url)

        # dataframe preview
        st.subheader("👓 Preview of Uploaded DataFrame")
        st.dataframe(df)

        # dataframe customization
        st.subheader("✂️ Dataframe Customization")

        pv_values = st.selectbox("Select a column to use as **Values**", options = list(df.columns))
        pv_index = st.selectbox("Select a column to use as **Index**", options = list(df.columns))
        pv_column = st.selectbox("Select a column to use as **Columns**", options = list(df.columns))

        df[pv_values] = df[pv_values].apply(pd.to_numeric, errors='coerce')
        df = df.dropna(subset=pv_values)

        try:
            df_pv = df.pivot_table(values=pv_values, index=pv_index, columns=[pv_column])
            st.write("**Customized Pivot Table**")
            st.dataframe(df_pv)

        except ValueError as e:
            st.error(
                """
                ***Value Error has occured

                Value Error: """ f"{e}"
            )


        # chart customization
        df = df.reset_index()
        st.subheader("📊 Chart Customization")

        index_col = st.selectbox("Select a column to use as **Index (X-axis)**", options = list(df.columns))
        value_col = st.selectbox("Select a column to use as **Value (Y-axis)**", options = list(df.columns))
        
        if index_col and value_col:
            if index_col == value_col:
                st.write("**Error: Please select two different columns**")
            else:
                chart_data = df[[index_col, value_col]].dropna()

                st.write("###Chart")
                chart = (
                    alt.Chart(chart_data)
                    .mark_area(opacity=0.3)
                    .encode(
                        x=f"{index_col}:T" if pd.api.types.is_datetime64_any_dtype(chart_data[index_col]) else f"{index_col}:N",
                        y=alt.Y(f"{value_col}:Q", stack=None)
                    )
                )
                st.altair_chart(chart, use_container_width=True)
        

# URLError Handling: showing error message in case of connection issues
except URLError as e:
    st.error(
        """
        **This demo requires internet access.**

        Connection error: %s
    """
        % e.reason
    )