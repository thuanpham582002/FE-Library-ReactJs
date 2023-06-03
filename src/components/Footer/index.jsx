import React from 'react'

export const Footer = (props) => {
    const footerStyle= {
        position : "fixed",
        left : 0,
        bottom : 0,
        width : "100%",
        background: "linear-gradient(to left, yellow, red)",
        marginTop: "",
    }
  return (
    <div style={footerStyle}>
        <h2>đây là footer</h2>
    </div>
  )
}