import React from 'react'
import ReactDOM from 'react-dom'
import Clipboard from 'clipboard'
import _ from 'lodash'

function pxAdd (origin, add) {
  return parseFloat(origin, 10) + add + 'px'
}

function getStyleWithDiff (style, diffX, diffY) {
  const newStyle = Object.assign({}, style)

  if (!style.left && style.right) {
    newStyle.right = pxAdd(newStyle.right, -diffX)
  } else {
    newStyle.left = pxAdd(newStyle.left, diffX)
  }

  if (!style.top && style.bottom) {
    newStyle.bottom = pxAdd(newStyle.bottom, -diffY)
  } else {
    newStyle.top = pxAdd(newStyle.top, diffY)
  }

  return newStyle
}

function insertCSS (cssString) {
  const style = window.document.createElement('style')
  style.type = 'text/css'
  style.appendChild(document.createTextNode(cssString))
  window.document.head.appendChild(style)
}

function dispatchMsg (event, data) {
  window.document.dispatchEvent(new window.CustomEvent(event, {
    detail: data
  }))
}

class Copy extends React.Component {
  componentDidMount () {
    this.clipboard = new Clipboard(ReactDOM.findDOMNode(this), {
      text: () => this.props.text
    })

    this.clipboard.on('success', () => {
    })

    this.clipboard.on('error', () => {
    })
  }

  componentWillUnmount () {
    this.clipboard.destroy()
  }

  render () {
    return this.props.children
  }
}

function template (text, data) {
  try {
    return _.template(text, {
      interpolate: /{{([\s\S]+?)}}/g
    })({
      ...data
    })
  } catch (err) {
    console.warn(err)
    return text
  }
}

export {
  Copy,
  pxAdd,
  getStyleWithDiff,
  insertCSS,
  dispatchMsg,
  template
}
