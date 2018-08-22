import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { observer } from 'mobx-react/index'
import printerStore from './store'
import { getStyleWithDiff, dispatchMsg } from '../util'

@observer
class Block extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      clientX: null,
      clientY: null,
      isEdit: false
    }
  }

  handleDragStart = ({clientX, clientY}) => {
    const {index} = this.props

    this.setState({
      clientX,
      clientY
    })

    window.document.dispatchEvent(new window.CustomEvent('gm-printer-select', {
      detail: {
        selected: index
      }
    }))
  }

  handleDragEnd = ({clientX, clientY}) => {
    const {config} = this.props
    const diffX = clientX - this.state.clientX
    const diffY = clientY - this.state.clientY

    const style = getStyleWithDiff(config.style, diffX, diffY)

    dispatchMsg('gm-printer-block-style-set', {
      style
    })
  }

  handleClick = () => {
    const {index} = this.props

    dispatchMsg('gm-printer-select', {
      selected: index
    })
  }

  handleDoubleClick = () => {
    this.setState({
      isEdit: true
    }, () => {
      this.refEdit.focus()
    })
  }

  handleEditBlur = () => {
    this.setState({
      isEdit: false
    })
  }

  handleText = (e) => {
    dispatchMsg('gm-printer-block-text-set', {
      text: e.target.value
    })
  }

  render () {
    const {
      index,
      selected,
      config: {type, text, link, style},
      className,
      ...rest
    } = this.props
    const {isEdit} = this.state

    let content = null
    if (!type || type === 'text') {
      content = printerStore.template(text)
    } else if (type === 'line') {
      content = null
    } else if (type === 'image') {
      content = <img src={link} style={{width: '100%', height: '100%'}} alt=''/>
    }

    const active = index === selected

    return (
      <div
        {...rest}
        style={style}
        className={classNames('gm-printer-block', className, {
          active
        })}
        draggable
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
      >
        {content}
        {(!type || type === 'text') && active && isEdit && (
          <textarea
            ref={ref => (this.refEdit = ref)}
            className='gm-printer-block-text-edit' value={text}
            onChange={this.handleText}
            onBlur={this.handleEditBlur}
          />
        )}
      </div>
    )
  }
}

Block.propTypes = {
  index: PropTypes.number.isRequired,
  config: PropTypes.object.isRequired,
  selected: PropTypes.number
}

export default Block
