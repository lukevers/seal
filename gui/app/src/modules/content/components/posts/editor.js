/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBold,
    faItalic,
    faUnderline,
    faCode,
} from '@fortawesome/free-solid-svg-icons';

import { isKeyHotkey } from 'is-hotkey';

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

const Toolbar = ({ children }) => (
    <div css={css`
        padding: 1em 0;
        margin-bottom: 1em;

        & > * {
            display: inline-block;
        }

        & > * + * {
            margin-left: 15px;
        }
    `}>
        {children}
    </div>
);

const Button = ({ children, active, onMouseDown }) => (
    <span css={css`
        cursor: pointer;
        color: ${active ? '#000' : '#aaa'};
        padding: .25em;
    `} onMouseDown={onMouseDown}>
        {children}
    </span>
);

export default class PostEditor extends Component {
    state = {
        value: Value.fromJSON(this.props.value),
    }

    onChange = ({ value }) => {
        this.props.onChange(JSON.stringify(value));
        this.setState({ value });
    }

    hasMark = type => {
        const { value } = this.state
        return value.activeMarks.some(mark => mark.type === type)
    }

    renderMark = (props, editor, next) => {
        const { children, mark, attributes } = props

        switch (mark.type) {
            case 'bold':
                return <strong {...attributes}>{children}</strong>
            case 'code':
                return <code {...attributes}>{children}</code>
            case 'italic':
                return <em {...attributes}>{children}</em>
            case 'underlined':
                return <u {...attributes}>{children}</u>
            default:
                return next()
        }
    }

    onClickMark = (event, type) => {
        event.preventDefault()
        this.editor.toggleMark(type)
    }

    renderMarkButton = (type, icon) => {
        const isActive = this.hasMark(type)

        return (
            <Button
                active={isActive}
                onMouseDown={event => this.onClickMark(event, type) }
            >
                <FontAwesomeIcon icon={icon} />
            </Button>
        )
    }

    onKeyDown = (event, editor, next) => {
        let mark

        if (isBoldHotkey(event)) {
            mark = 'bold'
        } else if (isItalicHotkey(event)) {
            mark = 'italic'
        } else if (isUnderlinedHotkey(event)) {
            mark = 'underlined'
        } else if (isCodeHotkey(event)) {
            mark = 'code'
        } else {
            return next()
        }

        event.preventDefault()
        editor.toggleMark(mark)
    }

    ref = editor => {
        this.editor = editor;
    }

    render() {
        return (
            <div css={css`
                strong {
                    font-weight: bold;
                }

                em {
                    font-style: italic;
                }

                u {
                    text-decoration: underline;
                }

                code {
                    font-family: monospace;
                }
            `}>
                <Toolbar>
                    {this.renderMarkButton('bold', faBold)}
                    {this.renderMarkButton('italic', faItalic)}
                    {this.renderMarkButton('underlined', faUnderline)}
                    {this.renderMarkButton('code', faCode)}
                </Toolbar>
                <Editor
                    placeholder="Enter some rich text..."
                    ref={this.ref}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    value={this.state.value}
                    renderMark={this.renderMark}
                />
            </div>
        )
    }
}
