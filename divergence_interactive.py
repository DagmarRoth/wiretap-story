#!/usr/bin/env python3
"""
Generate interactive divergence chart with animated SVG lines.
This creates the actual SVG elements that animate on scroll,
eliminating the need for overlay coordinates.
"""

import plotly.graph_objects as go
import pandas as pd

# Data: Cost per order vs Incrimination rate (2022-2024)
years = ['2022', '2023', '2024']
cost_per_order = [180.847, 207.559, 234.272]  # in thousands
incrimination_rate = [12.9, 12.1, 11.3]  # percentage

# Create figure with secondary y-axis
fig = go.Figure()

# Cost per order line (red, left axis)
fig.add_trace(go.Scatter(
    x=years,
    y=cost_per_order,
    name='Cost per Order',
    mode='lines+markers',
    line=dict(color='#ff4444', width=4),
    marker=dict(size=10, color='#ff4444'),
    yaxis='y1',
    hovertemplate='<b>%{x}</b><br>Cost: $%{y:.1f}K<extra></extra>'
))

# Incrimination rate line (green, right axis)
fig.add_trace(go.Scatter(
    x=years,
    y=incrimination_rate,
    name='Incrimination Rate',
    mode='lines+markers',
    line=dict(color='#00ff41', width=4),
    marker=dict(size=10, color='#00ff41'),
    yaxis='y2',
    hovertemplate='<b>%{x}</b><br>Rate: %{y:.1f}%<extra></extra>'
))

# Update layout with dual axes
fig.update_layout(
    title={
        'text': 'Cost Rising, Effectiveness Falling<br><sub>More spending, less evidence</sub>',
        'x': 0.5,
        'xanchor': 'center',
        'font': {'size': 18, 'color': '#00ff41', 'family': 'Helvetica'}
    },
    paper_bgcolor='#050a14',
    plot_bgcolor='#050a14',
    font=dict(family='Helvetica', color='#c8ffd4', size=12),
    xaxis=dict(
        title='Year',
        title_font_color='#c8ffd4',
        tickfont_color='#c8ffd4',
        showgrid=False,
        zeroline=False,
        linecolor='#666666',
        linewidth=2
    ),
    yaxis=dict(
        title='Cost per Order ($1000s)',
        title_font_color='#ff4444',
        tickfont_color='#ff4444',
        side='left',
        showgrid=True,
        gridcolor='#1a2540',
        zeroline=False,
        linecolor='#666666',
        linewidth=2
    ),
    yaxis2=dict(
        title='Incrimination Rate (%)',
        title_font_color='#00ff41',
        tickfont_color='#00ff41',
        side='right',
        showgrid=False,
        zeroline=False,
        linecolor='#666666',
        linewidth=2,
        overlaying='y'
    ),
    legend=dict(
        x=0.02,
        y=0.98,
        bgcolor='rgba(5, 10, 20, 0.8)',
        bordercolor='#666666',
        borderwidth=1
    ),
    hovermode='x unified',
    width=900,
    height=600,
    margin=dict(l=80, r=80, t=100, b=80)
)

# Export as HTML with Plotly.js
fig.write_html('ai2html-output/divergence_interactive.html')
print("✓ Generated: ai2html-output/divergence_interactive.html")

# Also export as PDF for reference
try:
    fig.write_image('divergence_interactive.pdf')
    print("✓ Generated: divergence_interactive.pdf")
except:
    print("⚠ PDF export skipped (kaleido not installed)")
