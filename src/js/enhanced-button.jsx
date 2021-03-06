var React = require('react');
var KeyCode = require('./utils/key-code.js');
var Classable = require('./mixins/classable.js');
var WindowListenable = require('./mixins/window-listenable');
var FocusRipple = require('./ripples/focus-ripple.jsx');
var TouchRipple = require('./ripples/touch-ripple.jsx');

var EnhancedButton = React.createClass({

  mixins: [Classable, WindowListenable],

  propTypes: {
    centerRipple: React.PropTypes.bool,
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    disableFocusRipple: React.PropTypes.bool,
    disableTouchRipple: React.PropTypes.bool,
    linkButton: React.PropTypes.bool,
    onBlur: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    onMouseDown: React.PropTypes.func,
    onMouseUp: React.PropTypes.func,
    onTouchEnd: React.PropTypes.func,
    onTouchStart: React.PropTypes.func,
    onTouchTap: React.PropTypes.func
  },

  windowListeners: {
    'keydown': '_handleWindowKeydown',
    'keyup': '_handleWindowKeyup'
  },

  getInitialState: function() {
    return {
      isKeyboardFocused: false 
    };
  },

  render: function() {
    var {
      centerRipple,
      disabled,
      disableFocusRipple,
      disableTouchRipple,
      linkButton,
      onBlur,
      onFocus,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      onTouchStart,
      onTouchTap,
      ...other } = this.props;
    var classes = this.getClasses('mui-enhanced-button', {
      'mui-is-disabled': disabled,
      'mui-is-keyboard-focused': this.state.isKeyboardFocused,
      'mui-is-link-button': linkButton
    });
    var touchRipple = (
      <TouchRipple
        ref="touchRipple"
        centerRipple={centerRipple} />
    );
    var focusRipple = (
      <FocusRipple
        show={this.state.isKeyboardFocused} />
    );
    var buttonProps = {
      className: classes,
      disabled: disabled,
      onBlur: this._handleBlur,
      onFocus: this._handleFocus,
      onMouseDown: this._handleMouseDown,
      onMouseUp: this._handleMouseUp,
      onTouchEnd: this._handleTouchEnd,
      onTouchStart: this._handleTouchStart,
      onTouchTap: this._handleTouchTap
    };
    var buttonChildren = [
      disableTouchRipple ? null : touchRipple,
      disableFocusRipple ? null : focusRipple,
      this.props.children
    ];

    if (disabled && linkButton) {
      return (
        <span {...other} 
          className={classes} 
          disabled={disabled}>
          {this.props.children}
        </span>
      );
    }

    return linkButton ? (
      <a {...other} {...buttonProps}>
        {buttonChildren}
      </a>
    ) : (
      <button {...other} {...buttonProps}>
        {buttonChildren}
      </button>
    );
  },

  isKeyboardFocused: function() {
    return this.state.isKeyboardFocused;
  },

  _handleWindowKeydown: function(e) {
    if (e.keyCode == KeyCode.TAB) this._tabPressed = true;
    if (e.keyCode == KeyCode.ENTER && this.state.isKeyboardFocused) {
      this._handleTouchTap(e);
    }
  },

  _handleWindowKeyup: function(e) {
    if (e.keyCode == KeyCode.SPACE && this.state.isKeyboardFocused) {
      this._handleTouchTap(e);
    }
  },

  _handleBlur: function(e) {
    this.setState({
      isKeyboardFocused: false
    });

    if (this.props.onBlur) this.props.onBlur(e);
  },

  _handleFocus: function(e) {
    //setTimeout is needed becuase the focus event fires first
    //Wait so that we can capture if this was a keyboard focus
    //or touch focus
    setTimeout(function() {
      if (this._tabPressed) {
        this.setState({
          isKeyboardFocused: true
        });
      }
    }.bind(this), 150);
    
    if (this.props.onFocus) this.props.onFocus(e);
  },

  _handleMouseDown: function(e) {
    //only listen to left clicks
    if (e.button === 0 && this.refs.touchRipple) this.refs.touchRipple.start(e);
    if (this.props.onMouseDown) this.props.onMouseDown(e);
  },

  _handleMouseUp: function(e) {
    if (this.refs.touchRipple) this.refs.touchRipple.end();
    if (this.props.onMouseUp) this.props.onMouseUp(e);
  },

  _handleTouchStart: function(e) {
    if (this.refs.touchRipple) this.refs.touchRipple.start(e);
    if (this.props.onTouchStart) this.props.onTouchStart(e);
  },

  _handleTouchEnd: function(e) {
    if (this.refs.touchRipple) this.refs.touchRipple.end();
    if (this.props.onTouchEnd) this.props.onTouchEnd(e);
  },

  _handleTouchTap: function(e) {
    this._tabPressed = false;
    this.setState({
      isKeyboardFocused: false
    });
    if (this.props.onTouchTap) this.props.onTouchTap(e);
  }

});

module.exports = EnhancedButton;