#!/usr/bin/env python3
"""
Generate sunburst chart for wiretap waste data
Exports as PDF for Illustrator editing
"""

import plotly.graph_objects as go
import pandas as pd

# Prepare sunburst data: hierarchical structure
labels = [
    "Total Spending ($405M)",
    # Level 1: Three-part breakdown
    "Evidence Produced ($45.8M)",
    "Documented Waste ($258M)",
    "No Evidence Found ($101.2M)",
    # Level 2: Waste categories only
    "Personal calls (35%)",
    "Business/financial (22%)",
    "Encrypted/unreadable (18%)",
    "Incomplete/tech fail (11%)",
    "Foreign lang (8%)",
    "Duplicate coverage (6%)",
]

parents = [
    "",  # Root
    "Total Spending ($405M)",  # Evidence parent
    "Total Spending ($405M)",  # Waste parent
    "Total Spending ($405M)",  # No Evidence parent
    # Waste categories
    "Documented Waste ($258M)",
    "Documented Waste ($258M)",
    "Documented Waste ($258M)",
    "Documented Waste ($258M)",
    "Documented Waste ($258M)",
    "Documented Waste ($258M)",
]

values = [
    405,    # Total
    45.8,   # Evidence Produced (11.3%)
    258,    # Documented Waste (63.7%)
    101.2,  # No Evidence Found (25%)
    # Waste categories
    90.3,   # Personal calls (35%)
    56.8,   # Business/financial (22%)
    46.4,   # Encrypted (18%)
    28.4,   # Incomplete (11%)
    20.6,   # Foreign lang (8%)
    15.5,   # Duplicate (6%)
]

# Color mapping
colors = [
    "#050a14",  # Root (background)
    "#00ff41",  # Evidence Produced (green - success)
    "#ff4444",  # Documented Waste (red - danger)
    "#666666",  # No Evidence Found (gray - neutral/wasted)
    # Waste categories (red/orange shades)
    "#ff2222", "#ff4444", "#ff6633", "#ff8844", "#ffaa00", "#dd3333",
]

# Create sunburst
fig = go.Figure(go.Sunburst(
    labels=labels,
    parents=parents,
    values=values,
    branchvalues='total',
    marker=dict(
        colors=colors,
        line=dict(color="#050a14", width=2)
    ),
    textinfo="label+percent entry",
    textfont=dict(
        family="Helvetica",
        size=11,
        color="#c8ffd4"
    ),
    hovertemplate="<b>%{label}</b><br>Amount: $%{value:.1f}M<br>Percentage: %{percentParent}<extra></extra>"
))

# Update layout
fig.update_layout(
    title={
        "text": "2024 Wiretap Spending Allocation: $405M Total<br><sub>11.3% produced evidence | 63.7% documented waste | 25% no evidence found</sub>",
        "x": 0.5,
        "xanchor": "center",
        "font": {"size": 16, "color": "#00ff41", "family": "Helvetica"}
    },
    paper_bgcolor="#050a14",
    plot_bgcolor="#050a14",
    font=dict(family="Helvetica", color="#c8ffd4", size=11),
    margin=dict(t=100, l=0, r=0, b=0),
    width=1000,
    height=900,
    showlegend=False
)

fig.write_image("sunburst_chart.pdf")
