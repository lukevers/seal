/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';
import { isKeyHotkey } from 'is-hotkey';
import { themes } from '../../../../base/themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBold,
    faItalic,
    faUnderline,
    faCode,
    faHeading,
    faQuoteRight,
    faListUl,
    faListOl,
} from '@fortawesome/free-solid-svg-icons';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');

const Vertical = () => (
    <div css={css`
        background-color: ${themes.standard.lightgray};
        width: 1px;
        height: 1em;
        position: absolute;
        margin-left: 7.5px;
    `}/>
);

const Toolbar = ({ children }) => (
    <div css={css`
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
        color: ${active ? themes.standard.secondary : themes.standard.gray};
        padding: .25em;
        font-size: .75em;
    `} onMouseDown={onMouseDown}>
        {children}
    </span>
);

export default class PostEditor extends Component {
    state = {
        value: (this.props.plaintext ?
            Plain.deserialize(this.props.value) :
            Value.fromJSON(this.props.value)),
    }

    onChange = ({ value }) => {
        if (this.props.plaintext) {
            this.props.onChange(Plain.serialize(value));
        } else {
            this.props.onChange(JSON.stringify(value));
        }

        this.setState({ value });
    }

    hasMark = type => {
        const { value } = this.state;
        return value.activeMarks.some(mark => mark.type === type);
    }

    hasBlock = type => {
        const { value } = this.state;
        return value.blocks.some(node => node.type === type);
    }

    renderMark = (props, editor, next) => {
        const { children, mark, attributes } = props;

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
                return next();
        }
    }

    renderNode = (props, editor, next) => {
        const { attributes, children, node } = props;

        switch (node.type) {
            case 'block-quote':
                return <blockquote {...attributes}>{children}</blockquote>
            case 'bulleted-list':
                return <ul {...attributes}>{children}</ul>
            case 'heading-one':
                return <h1 {...attributes}>{children}</h1>
            case 'heading-two':
                return <h2 {...attributes}>{children}</h2>
            case 'list-item':
                return <li {...attributes}>{children}</li>
            case 'numbered-list':
                return <ol {...attributes}>{children}</ol>
            default:
                return next();
        }
    }

    onClickMark = (event, type) => {
        event.preventDefault();
        this.editor.toggleMark(type);
    }

    renderMarkButton = (type, icon) => {
        const isActive = this.hasMark(type);

        return (
            <Button
                active={isActive}
                onMouseDown={event => this.onClickMark(event, type) }
            >
                <FontAwesomeIcon icon={icon} />
            </Button>
        );
    }

    renderBlockButton = (type, icon) => {
        let isActive = this.hasBlock(type);

        if (['numbered-list', 'bulleted-list'].includes(type)) {
            const { value: { document, blocks } } = this.state

            if (blocks.size > 0) {
                const parent = document.getParent(blocks.first().key)
                isActive = this.hasBlock('list-item') && parent && parent.type === type
            }
        }

        return (
            <Button
                active={isActive}
                onMouseDown={event => this.onClickBlock(event, type)}
            >
                <FontAwesomeIcon icon={icon} />
            </Button>
        );
    }

    onClickBlock = (event, type) => {
        event.preventDefault();

        const { editor } = this;
        const { value } = editor;
        const { document } = value;

        // Handle everything but list buttons.
        if (type !== 'bulleted-list' && type !== 'numbered-list') {
            const isActive = this.hasBlock(type);
            const isList = this.hasBlock('list-item');

            if (isList) {
                editor
                    .setBlocks(isActive ? 'paragraph' : type)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list');
            } else {
                editor.setBlocks(isActive ? 'paragraph' : type);
            }
        } else {
            // Handle the extra wrapping required for list buttons.
            const isList = this.hasBlock('list-item');
            const isType = value.blocks.some(block => {
                return !!document.getClosest(block.key, parent => parent.type === type);
            });

            if (isList && isType) {
                editor
                    .setBlocks('paragraph')
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list');
            } else if (isList) {
                editor
                .unwrapBlock(
                    type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
                )
                .wrapBlock(type);
            } else {
                editor.setBlocks('list-item').wrapBlock(type);
            }
        }
    }

    onKeyDown = (event, editor, next) => {
        if (this.props.plaintext) {
            return next();
        }

        let mark;

        if (isBoldHotkey(event)) {
            mark = 'bold';
        } else if (isItalicHotkey(event)) {
            mark = 'italic';
        } else if (isUnderlinedHotkey(event)) {
            mark = 'underlined';
        } else if (isCodeHotkey(event)) {
            mark = 'code';
        } else {
            return next();
        }

        event.preventDefault();
        editor.toggleMark(mark);
    }

    ref = editor => {
        this.editor = editor;
    }

    render() {
        const toolbar = this.props.toolbar ? (
            <Toolbar>
                {this.renderMarkButton('bold', faBold)}
                {this.renderMarkButton('italic', faItalic)}
                {this.renderMarkButton('underlined', faUnderline)}
                {this.renderMarkButton('code', faCode)}
                <Vertical/>
                {this.renderBlockButton('heading-one', faHeading)}
                {this.renderBlockButton('heading-two', faHeading)}
                {this.renderBlockButton('block-quote', faQuoteRight)}
                <Vertical/>
                {this.renderBlockButton('numbered-list', faListOl)}
                {this.renderBlockButton('bulleted-list', faListUl)}
            </Toolbar>
        ) : '';

        return (
            <div css={css`
                h1 {
                    font-size: 2em;
                }

                h2 {
                    font-size: 1.5em;
                }

                blockquote {
                    border-left: 5px solid ${themes.standard.gray};
                    padding-left: 1em;

                }

                ul {
                    list-style-type: disc;
                    margin: 0 1em;
                }

                ol {
                    list-style-type: decimal;
                    margin: 0 1em;
                }

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
                {toolbar}
                <Editor
                    ref={this.ref}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    value={this.state.value}
                    renderNode={this.renderNode}
                    renderMark={this.renderMark}
                />
            </div>
        )
    }
}
